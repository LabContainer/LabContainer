import imp
from typing import Dict
from fastapi import APIRouter, status, Response, Header, Depends

from auth.core.db import SessionLocal
import auth.crud.crud as crud
from auth.dependencies import has_access, get_db
from auth.env_manager import check_env, create_new_container
from auth.core import schemas

router = APIRouter(
    prefix="/environment"
)


@router.get('/{username}')
def get_environment(username: str, response: Response, payload: Dict[str, str] = Depends(has_access), db: SessionLocal = Depends(get_db)):
    if(payload["user"] == username):
        env = crud.get_env_for_user(db, username)
        if env:
            if check_env(env.id):
                return env
            # Non running env, remove
            crud.remove_student_env(db, username)

        # TODO make secure with username and hashed password
        temp_pass = f"{username}#envpass"
        container_id, network, name = create_new_container(
            username, temp_pass)
        new_env = schemas.EnvCreate(
            id=container_id, host=name, network=network, ssh_password=temp_pass)
        return crud.create_student_env(db, new_env, username)


@router.post("/{username}/save")
def save_environment():
    # TODO: Save Environment
    pass
