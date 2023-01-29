from typing import Dict
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.env_manager import check_env, create_new_container, kill_env, build_env, check_image, commit_env, get_image_name
from analytics.core import schemas
import traceback
from datetime import datetime, timedelta
from analytics.logger import logger

import asyncio
import fcntl
from contextlib import asynccontextmanager

from analytics.utils import find_free_port


router = APIRouter(prefix="/environment")


def acquire_lock():
    f = open("/tmp/test.lock", "w")
    fcntl.flock(f, fcntl.LOCK_EX)
    return f


@asynccontextmanager
async def lock():
    loop = asyncio.get_running_loop()
    f = await loop.run_in_executor(None, acquire_lock)
    try:
        yield
    finally:
        f.close()


"""
Dict of active environments, expiry time
"""
active_environments = {}
env_expiry_time = 100


@router.get("/{team_name}/{username}", response_model=schemas.Environment, tags=["environment"])
async def get_environment(
    team_name: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if payload["user"] != username:
        response.status_code = status.HTTP_403_FORBIDDEN
        return
    teams = crud.get_teams_for_user(db, username)
    valid = False
    init_script = ""
    for team in teams:
        # No team for user, can't make env
        if team.name == team_name:
            init_script = team.lab.environment_init_script
            valid = True
    if not valid:
        logger.info(crud.get_env_for_user_team(db, username, team_name))
        return
    async with lock():
        env = crud.get_env_for_user_team(db, username, team_name)
        if env:
            check = check_env(env.name)
            if check:
                # add to active if not exist
                key = f"{team_name}_{username}_{len(team_name)}"
                active_environments[key] = datetime.now() + \
                    timedelta(seconds=env_expiry_time)
                return schemas.Environment(url=env.url)
            # No env, remove
            crud.remove_user_env(db, username, team_name)
            if check is False:
                kill_env(env.name)
        # env does not exist, build
        image = get_image_name(username, team_name)
        if not check_image(image):
            # if previous image did not exist, build new
            image = build_env(username, team_name, init_script)
        port = find_free_port()
        container_id, network, name = create_new_container(
            username, team_name, port, image
        )
        # url = f"http://localhost:{port}"
        url = f"https://api.labcontainer.dev/env/{name}"
        # url = f"https://api.labcontainer.dev/"
        # url = f"http://localhost:80/env/{name}"
        new_env = schemas.EnvCreate(

            env_id=container_id, url=url, image=image, name=name, user=username, team=team_name
        )
        try:
            env = crud.create_user_env(db, new_env, username, team_name)
            # add to active if not exist
            key = f"{team_name}_{username}_{len(team_name)}"
            active_environments[key] = datetime.now(
            ) + timedelta(seconds=env_expiry_time)
            return schemas.Environment(url=env.url)
        except Exception as err:
            kill_env(name)
            traceback.print_exc()
            logger.error(err)
            response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE


@router.delete("/{team_name}/{username}", tags=["environment"])
def delete_env(
    team_name: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    # only Auth Service can call this endpoint
    if payload["internal"] != "AuthService":
        response.status_code = status.HTTP_403_FORBIDDEN
        return

    env = crud.get_env_for_user_team(db, username, team_name)
    if env:
        if check_env(env.name) is not None:
            env.image = commit_env(env.env_id, username, team_name)
            kill_env(env.name)
        crud.remove_user_env(db, payload["user"], team_name)
        # remove from active environments
        key = f"{team_name}_{username}_{len(team_name)}"
        if key in active_environments:
            del active_environments[key]
    else:
        logger.error(f"No env found for user {payload['user']} :")
        response.status_code = status.HTTP_404_NOT_FOUND


@router.post("/{team_name}/{username}/active", tags=["environment"])
def report_active_environment(
    team_name: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    """
    Endpoint for frontend to report active status of environment
    If not reported within a time limit, env automatically deleted
    On active reports, time limit is reset and env is saved
    """
    if payload["user"] != username:
        response.status_code = status.HTTP_403_FORBIDDEN
        return

    env = crud.get_env_for_user_team(db, username, team_name)

    if not env:
        response.status_code = status.HTTP_404_NOT_FOUND
        return

    if not check_env(env.name):
        response.status_code = status.HTTP_404_NOT_FOUND
        return

    # env is running, and active set expiry time as current time + limit

    # create key with retreivable team_name and username
    key = f"{team_name}_{username}_{len(team_name)}"
    active_environments[key] = datetime.utcnow(
    ) + timedelta(seconds=env_expiry_time)

# Run checking active environments every 10 seconds


async def check_active_environments():
    while True:
        await asyncio.sleep(env_expiry_time)
        check_active_envs()

asyncio.create_task(check_active_environments())


def del_user_team(username, team_name):
    db_gen = get_db()
    db = next(db_gen)
    env = crud.get_env_for_user_team(db, username, team_name)
    if env:
        image = commit_env(env.env_id, username, team_name)
        kill_env(env.name)
        env.image = image
        db.commit()


def check_active_envs():
    # save dict items to list to avoid runtime error
    for key, value in list(active_environments.items()):
        if value < datetime.utcnow():
            # env has expired, delete
            del active_environments[key]

            # fetch user, team from key
            team_name_len = key.split("_")[-1]
            team_name = key[:int(team_name_len)]
            username = '_'.join(key[int(team_name_len)+1:].split('_')[:-1])

            # TODO delete env from db
            logger.info(f"Deleting env for user: {username} team: {team_name}")

            del_user_team(username, team_name)
