from analytics.core.db import SessionLocal
import jwt
import dotenv
import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from analytics.crud import crud

security = HTTPBearer()

pythonpath = os.getenv("PYTHONPATH")
if pythonpath is None:
    pythonpath = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.abspath(os.path.join(pythonpath, "..", ".env"))
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
            key=os.environ["SECRET_TOKEN"],
            algorithms=[
                header_data["alg"],
            ],
        )
        return payload
    except Exception as e:  # catches any exception
        raise HTTPException(status_code=401, detail=str(e))
