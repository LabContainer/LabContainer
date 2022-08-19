
from auth.core.db import SessionLocal
import jwt
import dotenv
import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from auth.crud import crud
security = HTTPBearer()

env_path = os.path.abspath(os.path.join(os.getenv('PYTHONPATH'), '..', '.env'))
dotenv.load_dotenv(dotenv_path=env_path)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def has_access(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
        Function that is used to validate the access token in the case that it requires it
    """
    token = credentials.credentials

    try:
        header_data = jwt.get_unverified_header(token)
        payload = jwt.decode(
            token,
            key=os.environ['SECRET_TOKEN'],
            algorithms=[header_data['alg'], ]
        )
        return payload
    except Exception as e:  # catches any exception
        raise HTTPException(
            status_code=401,
            detail=str(e))


def has_refresh(credentials: HTTPAuthorizationCredentials = Depends(security), db: SessionLocal = Depends(get_db)):
    """
        Function that is used to validate the refresh token in the case that it requires it
    """
    token = credentials.credentials
    try:
        header_data = jwt.get_unverified_header(token)
        payload = jwt.decode(
            token,
            key=os.environ['REFRESH_SECRET'],
            algorithms=[header_data['alg'], ]
        )
        if crud.check_rt(db, payload["user"], token):
            return payload
        else:
            raise Exception("Refresh token invalidated")
    except Exception as e:  # catches any exception
        raise HTTPException(
            status_code=401,
            detail=str(e))
