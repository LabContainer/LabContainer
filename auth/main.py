import imp
import crud
from db import SessionLocal, Envionment, User
import schemas
from typing import List, Union
from fastapi import Depends, FastAPI, status, Response
from fastapi.middleware.cors import CORSMiddleware
from requests import Session
import uvicorn
import jwt
import dotenv
import os

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
    users = crud.get_all_students(db, limit)
    usernames = [{"username": user.username} for user in users]
    return usernames


@ app.post('/create-user', status_code=status.HTTP_201_CREATED)
def create_user(user_info: schemas.UserCreate, db: Session = Depends(get_db)):
    crud.create_user(db, user_info)
    return


@ app.get('/getenv')
def get_environment(username: str, db: Session = Depends(get_db)):
    verify_jwt()
    return crud.get_env_for_user(db, username)


@ app.post("/login", status_code=status.HTTP_200_OK, response_model=Union[str, schemas.LoginResult])
def login(login_info: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    auth_user: schemas.UserCreate = crud.login_user(db, login_info)
    if auth_user is not None:
        payload = {
            "user": auth_user.username,
            "email": auth_user.email,
            "is_student": auth_user.is_student
        }
        jwt_token = jwt.encode(payload, key=os.environ['SECRET_TOKEN'])
        return {
            "access_token": jwt_token
        }

    response.status_code = status.HTTP_401_UNAUTHORIZED
    return "Not Allowed"


def verify_jwt(token: str):
    header_data = jwt.get_unverified_header(token)
    return jwt.decode(
        token,
        key=os.environ['SECRET_TOKEN'],
        algorithms=[header_data['alg'], ]
    )


if __name__ == '__main__':
    uvicorn.run(app, port=5000, host='0.0.0.0')
