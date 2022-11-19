import imp
from typing import Dict
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.env_manager import check_env, create_new_container, kill_env
from analytics.core import schemas
import traceback

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


@router.get("/{team_name}/{username}", response_model=schemas.Environment, tags=["environment"])
async def get_environment(
    team_name: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    # only student service can call this endpoint
    if payload["user"] != username:
        response.status_code = status.HTTP_403_FORBIDDEN
        return
    teams = crud.get_teams_for_user(db, username)
    valid = False
    for team in teams:
        # No team for user, can't make env
        if team.name == team_name:
            valid = True
    if not valid:
        print(crud.get_env_for_user_team(db, username, team_name))
        return
    async with lock():
        env = crud.get_env_for_user_team(db, username, team_name)
        if env:
            if check_env(env.host):
                return schemas.Environment(
                    host=env.host,
                    port=env.port,
                    ssh_password=env.ssh_password,
                    network=env.network,
                    ssh_user=env.ssh_user,
                )
            # Non running env, remove
            crud.remove_user_env(db, username, team_name)

        # TODO make secure with username and hashed password
        temp_pass = f"{username}#envpass"
        port = find_free_port()
        container_id, network, name = create_new_container(
            username, team_name, temp_pass, port
        )
        new_env = schemas.EnvCreate(
            id=container_id, host=name, network=network, ssh_password=temp_pass, port=port
        )
        try:
            env = crud.create_user_env(db, new_env, username, team_name)
            return schemas.Environment(
                host=env.host,
                port=env.port,
                ssh_password=env.ssh_password,
                network=env.network,
                ssh_user=env.ssh_user,
            )
        except Exception:
            kill_env(name)
            traceback.print_exc()
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
        if check_env(env.host):
            print("Removing env:", env.host, "id:", env.env_id)
            kill_env(env.host)
        crud.remove_user_env(db, payload["user"], team_name)
    else:
        print(f"No env found for user {payload['user']} :", env)
        response.status_code = status.HTTP_404_NOT_FOUND


@router.post("/{username}/save", tags=["environment"])
def save_environment():
    # TODO: Save Environment
    pass
