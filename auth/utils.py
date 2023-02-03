import socket
from contextlib import closing
import os
from typing import Dict
import jwt
import dotenv
import datetime
import auth.core.schemas as schemas

pythonpath = os.getenv("PYTHONPATH")
pythonpath = pythonpath if pythonpath else os.getcwd()
env_path = os.path.abspath(os.path.join(pythonpath, "..", ".env"))
dotenv.load_dotenv(dotenv_path=env_path)


def find_free_port():
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(("", 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]


def expTime(seconds: int):
    return datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(
        seconds=seconds
    )


def gen_access_token(auth_user: schemas.UserCreate):
    payload = {
        "user": auth_user.username,
        "email": auth_user.email,
        "is_student": auth_user.is_student,
        # Keep logged in for 5 mins before refresh
        "exp": expTime(seconds=5),
    }
    return jwt.encode(payload, key=os.environ["SECRET_TOKEN"])


def gen_internal_token(payload_fields: Dict[str, str]):
    payload = {**payload_fields, "internal": "AuthService", "exp": expTime(seconds=10)}
    return jwt.encode(payload, key=os.environ["SECRET_TOKEN"])
