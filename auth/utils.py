import socket
from contextlib import closing
import os
from typing import Dict
import jwt
import dotenv
import datetime
import auth.core.schemas as schemas
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer


pythonpath = os.getenv("PYTHONPATH")
pythonpath = pythonpath if pythonpath else os.getcwd()
env_path = os.path.abspath(os.path.join(pythonpath, "..", ".env"))
dotenv.load_dotenv(dotenv_path=env_path)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


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
        "exp": expTime(seconds=300),
    }
    return jwt.encode(payload, key=os.environ["SECRET_TOKEN"])


def gen_internal_token(payload_fields: Dict[str, str]):
    payload = {**payload_fields, "internal": "AuthService", "exp": expTime(seconds=10)}
    return jwt.encode(payload, key=os.environ["SECRET_TOKEN"])


def gen_reset_token(auth_user: schemas.UserCreate):
    payload = {
        "reset_user": auth_user.username,
        "purpose": "reset",
        # 24 hours validity
        "exp": expTime(seconds=60 * 60 * 24),
    }
    return jwt.encode(payload, key=os.environ["SECRET_TOKEN"])


def verify_access_token(token: str, credential_exception: Dict):
    try:
        payload = jwt.decode(token, SECRET_TOKEN, algorithms=[ALGORITHM])

        id: str = payload.get("id")

        if not id:
            raise credential_exception

        token_data = TokenData(id=id)
        return token_data
    except JWTError:
        raise credential_exception


def get_current_user(token: str = Depends(oauth2_scheme)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not verify token, token expired",
        headers={
            "WWW-AUTHENTICATE": "Bearer",
        },
    )

    current_user_id = verify_access_token(
        token=token, credential_exception=credential_exception
    ).id

    current_user = db["users"].find_one({"_id": current_user_id})

    return current_user
