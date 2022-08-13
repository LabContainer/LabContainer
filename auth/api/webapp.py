from fastapi import APIRouter, status, Depends, Response, Header
from typing import Dict, List, Union
import datetime
import os
import jwt

from auth.core.db import SessionLocal
from auth.crud import crud
import auth.core.schemas as schemas
from auth.dependencies import get_db, has_access
from auth.env_manager import kill_env

router = APIRouter(
    prefix="/webapp"
)


@router.post("/login", response_model=Union[str, schemas.LoginResult])
def login(login_info: schemas.UserLogin, response: Response, db: SessionLocal = Depends(get_db)):
    auth_user: schemas.UserCreate = crud.login_user(db, login_info)
    if auth_user is not None:
        payload = {
            "user": auth_user.username,
            "email": auth_user.email,
            "is_student": auth_user.is_student,
            # Keep logged in for 5 mins
            "exp": datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(seconds=300)
        }
        jwt_token = jwt.encode(payload, key=os.environ['SECRET_TOKEN'])
        return {
            "access_token": jwt_token
        }

    response.status_code = status.HTTP_401_UNAUTHORIZED
    return "Not Allowed"


@router.post("/logout")
def logout(payload: Dict = Depends(has_access), db: SessionLocal = Depends(get_db)):
    crud.set_user_inactive(db, payload["user"])
    env = crud.get_env_for_user(db, payload["user"])
    if env:
        print("Removing env:",  env.host, "id:", env.id)
        kill_env(env.id)
        crud.remove_student_env(db, payload["user"])
    else:
        print(f"No env found for user {payload['user']} :", env)
    return
