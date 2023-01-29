import imp
from typing import Dict, List
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.core import schemas
import traceback
from analytics.logger import logger

router = APIRouter(prefix="/teams")


@router.get("/{team_name}", response_model=schemas.Team, tags=["teams"])
def get_team(
    team_name: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    team = crud.get_team(db, team_name)
    if not payload["is_student"]:
        return team
    logger.info(team.users)
    users = crud.get_users_in_team(db, team.name)
    logger.info(users)
    for user in users:
        if user.name == payload["user"]:
            return schemas.Team(
                name=team.name,
                lab_id=team.lab_id,
                current_milestone=team.current_milestone,
                users=team.users
            )
    response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/", response_model=List[schemas.TeamCreate], tags=["teams"])
def get_user_teams(
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"] or payload["user"] == username:
        teams = crud.get_teams_for_user(db, username)
        return [schemas.TeamCreate(**team.__dict__) for team in teams]
    response.status_code = status.HTTP_403_FORBIDDEN


@router.post("/create", tags=["teams"])
def create_new_team(
    team: schemas.TeamCreate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        return crud.create_team(db, team)
    try:
        crud.create_team(db, team)
        try:
            crud.join_team(db, team.name, payload["user"])
        except:
            response.status_code = status.HTTP_403_FORBIDDEN
            crud.delete_team(db, team.name)
        return team
    except:
        print("Here")
        response.status_code = status.HTTP_409_CONFLICT


@router.post("/{team_name}/join", tags=["teams"])
def join_team(
    team_name: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"] or payload["user"] == username:
        crud.join_team(db, team_name, username)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.post("/{team_name}/leave", tags=["teams"])
def leave_team(
    team_name: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"] or payload["user"] == username:
        try:
            crud.leave_team(db, team_name, username)
        except:
            # unable to leave team
            response.status_code = status.HTTP_404_NOT_FOUND
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


# Individual
@router.get("/{team_name}/lab", response_model=schemas.LabCreate, tags=["teams"])
def get_team_lab(
    team_name: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    labs = crud.get_lab_for_team(db, team_name)
    return schemas.LabCreate(**labs.__dict__)
