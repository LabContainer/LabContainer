import imp
from typing import Dict, Optional, Union
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.core import schemas
import traceback

router = APIRouter(prefix="/labs")

# Instructor only endpoints
@router.post("/create")
def create_lab(
    lab: schemas.LabCreate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        crud.create_lab(db, lab)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/{lab_id}")
def get_lab(
    lab_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        return crud.get_lab(db, lab_id)
    teams = crud.get_teams_for_user(db, payload["user"])
    for team in teams:
        if team.lab_id == lab_id:
            # User in lab
            return crud.get_lab(db, lab_id)
    response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/{lab_id}/users")
def get_lab_users(
    lab_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        return crud.get_users_per_lab(db, lab_id)
    response.status_code = status.HTTP_403_FORBIDDEN


@router.post("/{lab_id}/users")
def add_lab_user(
    lab_id: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        return crud.add_user_to_lab(db, username, lab_id)
    response.status_code = status.HTTP_403_FORBIDDEN


@router.delete("/{lab_id}/users")
def delete_lab(
    lab_id: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        return crud.remove_user_from_lab(db, username, lab_id)
    response.status_code = status.HTTP_403_FORBIDDEN


@router.get("")
def get_labs(
    response: Response,
    username: Optional[str] = None,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        if username is None:
            return crud.get_labs(db)
        else:
            return crud.get_labs_for_user(db, username)
    elif username is not None and payload["user"] == username:
        return crud.get_labs_for_user(db, username)
    response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/{lab_id}/teams")
def get_lab_teams(
    lab_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        return crud.get_teams_per_lab(db, lab_id)
    response.status_code = status.HTTP_403_FORBIDDEN
