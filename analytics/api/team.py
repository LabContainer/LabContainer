import imp
from typing import Dict
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.core import schemas
import traceback

router = APIRouter(prefix="/teams")


@router.get("/{team_name}")
def get_team(
    team_name: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    team = crud.get_team(db, team_name)
    if not payload["is_student"]:
        return team
    print(team.users)
    users = crud.get_users_in_team(db, team.name)
    print(users)
    for user in users:
        if user.name == payload["user"]:
            return team
    response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/")
def get_user_teams(
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"] or payload["user"] == username:
        return crud.get_teams_for_user(db, username)
    response.status_code = status.HTTP_403_FORBIDDEN


@router.post("/create")
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
        response.status_code = status.HTTP_409_CONFLICT


@router.post("/{team_name}/join")
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


@router.post("/{team_name}/leave")
def leave_team(
    team_name: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"] or payload["user"] == username:
        crud.leave_team(db, team_name, username)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


# Individual
@router.get("/{team_name}/lab")
def get_team_lab(
    team_name: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    return crud.get_lab_for_team(db, team_name)
