from lib2to3.pytree import Base
from typing import List
from fastapi import FastAPI, status, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
]


class LoginInfo(BaseModel):
    username: str
    password: str


users: List[LoginInfo] = []


@app.post('/create-user', status_code=status.HTTP_201_CREATED)
def create_user(user_info: LoginInfo):
    users.append(user_info)
    return


@app.post("/login", status_code=status.HTTP_200_OK)
def login(login_info: LoginInfo, response: Response):
    matching_users = [
        user for user in users if login_info.username == user.username]
    if(len(matching_users) == 1):
        if(matching_users[0].password == login_info.password):
            return "Success!"
    response.status_code = status.HTTP_401_UNAUTHORIZED
    return "Not Allowed"


if __name__ == '__main__':
    uvicorn.run(app, port=5000, host='0.0.0.0')
