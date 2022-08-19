from fastapi import APIRouter, status, Depends, Response, Header
from typing import Dict, List, Union
import datetime
import os
import jwt

from auth.core.db import SessionLocal
from auth.crud import crud
import auth.core.schemas as schemas
from auth.dependencies import get_db, has_access, has_refresh
from auth.env_manager import check_env, kill_env
from auth.utils import gen_access_token

router = APIRouter(
    prefix="/webapp"
)


@router.post("/login", response_model=Union[str, schemas.LoginResult])
def login(login_info: schemas.UserLogin, response: Response, db: SessionLocal = Depends(get_db)):
    auth_user: schemas.UserCreate = crud.login_user(db, login_info)
    if auth_user is not None:
        access_token = gen_access_token(auth_user)
        refresh_token = jwt.encode({
            "user": auth_user.username,
            # refresh token lasts for 24 hours
            "exp": datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(seconds=60*60*24)
        }, key=os.environ['REFRESH_SECRET'])
        crud.add_rt(db, auth_user.username, refresh_token)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token
        }

    response.status_code = status.HTTP_401_UNAUTHORIZED
    return "Not Allowed"


@router.get("/refresh")
def refresh(response: Response, payload: Dict = Depends(has_refresh), db: SessionLocal = Depends(get_db)):
    auth_user: schemas.UserCreate = crud.get_user(db, payload["user"])
    if auth_user is not None:
        access_token = gen_access_token(auth_user)
        response.status_code = status.HTTP_202_ACCEPTED
        return {
            "access_token": access_token
        }


@router.post("/logout")
def logout(payload: Dict = Depends(has_access), db: SessionLocal = Depends(get_db)):
    crud.set_user_inactive(db, payload["user"])
    env = crud.get_env_for_user(db, payload["user"])
    crud.invalidate_rts(db, payload["user"])
    if env:
        if check_env(env.id):
            print("Removing env:",  env.host, "id:", env.id)
            kill_env(env.id)
        crud.remove_student_env(db, payload["user"])
    else:
        print(f"No env found for user {payload['user']} :", env)
    return
