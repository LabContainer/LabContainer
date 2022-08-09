import socket
from contextlib import closing
import auth.crud.crud as crud
from auth.core.db import SessionLocal, Envionment, User
import auth.core.schemas as schemas
from typing import List, Union
from fastapi import Depends, FastAPI, status, Response, Header
from fastapi.middleware.cors import CORSMiddleware
from requests import Session
import uvicorn
import jwt
import dotenv
import os
import datetime
from auth.utils import *

env_path = os.path.abspath(os.path.join(os.getenv('PYTHONPATH'), '..', '.env'))
dotenv.load_dotenv(dotenv_path=env_path)
app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@ app.get('/students/', response_model=List[schemas.UserBase])
def get_students(limit: Union[int, None] = None, db: Session = Depends(get_db)):
    # TODO add authentication
    users = crud.get_all_students(db, limit)
    usernames = [{"username": user.username} for user in users]
    return usernames


@ app.post('/create-user', status_code=status.HTTP_201_CREATED)
def create_user(user_info: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_info.username)
    if not user:
        crud.create_user(db, user_info)
        return
    else:
        response.status_code = status.HTTP_409_CONFLICT
        return


@ app.get('/getenv', status_code=status.HTTP_200_OK)
def get_environment(username: str, response: Response, authorization: str = Header(default=None), db: Session = Depends(get_db)):
    if authorization is not None:
        user_token = authorization.split(' ')[1]
        try:
            payload = verify_jwt(token=user_token)
            if(payload["user"] == username):
                env = crud.get_env_for_user(db, username)
                if not env:
                    port = find_free_port()
                    print(port)
                    make_env(port)
                    new_env = schemas.EnvCreate(
                        ip="127.0.0.1", port=port, ssh_password="testpass")
                    return crud.create_student_env(db, new_env, username)
                return env
        except jwt.exceptions.ExpiredSignatureError as e:
            response.status_code = status.HTTP_401_UNAUTHORIZED
    response.status_code = status.HTTP_401_UNAUTHORIZED
    return


@ app.post("/login", status_code=status.HTTP_200_OK, response_model=Union[str, schemas.LoginResult])
def login(login_info: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    auth_user: schemas.UserCreate = crud.login_user(db, login_info)
    if auth_user is not None:
        payload = {
            "user": auth_user.username,
            "email": auth_user.email,
            "is_student": auth_user.is_student,
            # Keep logged in for 5 mins
            "exp": datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(seconds=300)
        }
        print(auth_user.is_active)
        jwt_token = jwt.encode(payload, key=os.environ['SECRET_TOKEN'])
        return {
            "access_token": jwt_token
        }

    response.status_code = status.HTTP_401_UNAUTHORIZED
    return "Not Allowed"


@app.post("/logout", status_code=status.HTTP_200_OK)
def logout(username: str, response: Response, authorization: str = Header(default=None), db: Session = Depends(get_db)):
    if authorization is not None:
        user_token = authorization.split(' ')[1]
        try:
            payload = verify_jwt(token=user_token)
            if(payload["user"] == username):
                user = crud.set_user_inactive(db, username)
                return user
        except jwt.exceptions.ExpiredSignatureError as e:
            return
    response.status_code = status.HTTP_401_UNAUTHORIZED
    return


if __name__ == '__main__':
    uvicorn.run(app, port=5000, host='0.0.0.0')
