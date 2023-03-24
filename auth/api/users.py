from fastapi import APIRouter, status, Depends, Response
from typing import Dict, List, Union
import auth.core.schemas as schemas
from auth.core.db import SessionLocal
from auth.crud import crud

from auth.dependencies import get_db, has_access

router = APIRouter(prefix="/users")


@router.get("/me", response_model=schemas.UserInfo, tags=["users"])
async def get_current_user_info(
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    # Cannot have "me" username
    user = crud.get_user(db, payload["user"])
    return {
        "username": user.username,
        "email": user.email,
        "is_student": user.is_student,
    }


@router.get("/{username}", response_model=schemas.UserInfo, tags=["users"])
async def get_user_info(
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    user = crud.get_user(db, username)
    # TODO check is_student in db instead of jwt
    if not payload["is_student"] or user.username == payload["user"]:
        # Either staff or logged in student can access personal details
        return {
            "username": user.username,
            "email": user.email,
            "is_student": user.is_student,
        }
    response.status_code = status.HTTP_403_FORBIDDEN
    return


@router.get("/", response_model=List[schemas.UserInfo], tags=["users"])
def get_users(
    response: Response,
    limit: Union[int, None] = None,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        users = crud.get_all_users(db, limit)
        usernames = [
            {
                "username": user.username,
                "email": user.email,
                "is_student": user.is_student,
            }
            for user in users
        ]
        return usernames
    else:
        response.status_code = status.HTTP_403_FORBIDDEN
        return


@router.post("/create", tags=["users"])
def create_user(
    user_info: schemas.UserCreate,
    response: Response,
    db: SessionLocal = Depends(get_db),
):
    # TODO: Email validation for students/staff
    user = crud.get_user(db, user_info.username)
    if not user:
        response.status_code = status.HTTP_201_CREATED
        crud.create_user(db, user_info)
        return
    else:
        response.status_code = status.HTTP_409_CONFLICT
        return
