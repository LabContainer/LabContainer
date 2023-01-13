import imp
from typing import Dict, Optional, Union, List
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.core import schemas
import traceback

router = APIRouter(prefix="/labs")

# Instructor only endpoints


@router.post("/create", tags=["labs"])
def create_lab(
    lab: schemas.LabCreate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        # create unique lab id for each lab
        lab_id = hash(lab.course + lab.instructor + lab.name) 
        
        crud.create_lab(db, lab, lab_id)
        return
    else:
        response.status_code = status.HTTP_403_FORBIDDEN
    return


@router.get("/{lab_id}", response_model=schemas.LabCreate, tags=["labs"])
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
            lab = crud.get_lab(db, lab_id)
            return schemas.LabCreate(
                course=lab.course,
                id=lab.id,
                instructor=lab.instructor,
            )

    response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/{lab_id}/users", response_model=List[schemas.User], tags=["labs"])
def get_lab_users(
    lab_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        users = crud.get_users_per_lab(db, lab_id)
        return [schemas.User(**user.__dict__) for user in users]
    response.status_code = status.HTTP_403_FORBIDDEN


@router.post("/{lab_id}/users", tags=["labs"])
def add_lab_user(
    lab_id: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        crud.add_user_to_lab(db, username, lab_id)
        return
    response.status_code = status.HTTP_403_FORBIDDEN


@router.delete("/{lab_id}/users", tags=["labs"])
def delete_lab_user(
    lab_id: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        return crud.remove_user_from_lab(db, username, lab_id)
    response.status_code = status.HTTP_403_FORBIDDEN


@router.get("", response_model=List[schemas.Lab], tags=["labs"])
def get_labs(
    response: Response,
    username: Optional[str] = None,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    labs = []
    if not payload["is_student"]:
        if username is None:
            labs = crud.get_labs(db)
        else:
            labs = crud.get_labs_for_user(db, username)
    elif username is not None and payload["user"] == username:
        labs = crud.get_labs_for_user(db, username)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN
        return
    return [schemas.Lab(**lab.__dict__) for lab in labs]


@router.get("/{lab_id}/teams", response_model=List[schemas.TeamCreate], tags=["labs"])
def get_lab_teams(
    lab_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"] or payload["user"] in [
        user.name for user in crud.get_users_per_lab(db, lab_id)
    ]:
        teams = crud.get_teams_per_lab(db, lab_id)
        return [schemas.TeamCreate(**team.__dict__) for team in teams]
    response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/{lab_id}/milestones", response_model=List[schemas.MilestoneCreate], tags=["labs"])
def get_lab_milestones(
    lab_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"] or payload["user"] in [
        user.name for user in crud.get_users_per_lab(db, lab_id)
    ]:
        milestones = crud.get_milestones_per_lab(db, lab_id)
        return [schemas.Milestone(**milestone.__dict__) for milestone in milestones]
    response.status_code = status.HTTP_403_FORBIDDEN
