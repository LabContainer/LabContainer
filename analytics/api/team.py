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
    db=Depends(get_db),
):
    team = crud.get_team(db, team_name)
    if not payload["is_student"]:
        return team
    if not team:
        response.status_code = status.HTTP_404_NOT_FOUND
        return
    users = crud.get_users_in_team(db, str(team.name))
    for user in users:
        if user.name == payload["user"]:
            return schemas.Team(
                name=str(team.name),
                lab_id=str(team.lab_id),
                current_milestone=str(team.current_milestone)
                if team.current_milestone
                else None,
                users=team.users,
            )
    response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/", response_model=List[schemas.TeamCreate], tags=["teams"])
def get_user_teams(
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db=Depends(get_db),
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
    db=Depends(get_db),
):
    try:
        if not payload["is_student"]:
            return crud.create_team(db, team)
        crud.create_team(db, team)
        try:
            crud.join_team(db, team.name, payload["user"])
        except:
            response.status_code = status.HTTP_403_FORBIDDEN
            crud.delete_team(db, team.name)
        return team
    except Exception as e:
        logger.error(traceback.format_exc())
        response.status_code = status.HTTP_409_CONFLICT


@router.post("/{team_name}/join", tags=["teams"])
def join_team(
    team_name: str,
    username: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db=Depends(get_db),
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
    db=Depends(get_db),
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
    db=Depends(get_db),
):
    labs = crud.get_lab_for_team(db, team_name)
    return schemas.LabCreate(**labs.__dict__)


# api endpoint to move team to next milestone
@router.post("/{team_name}/next", tags=["teams"], response_model=schemas.String)
def next_milestone(
    team_name: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db=Depends(get_db),
):
    # TODO ideally should check if called from lab server. But lab server is exposed and keys cannot be encrypted there
    try:
        # return schemas.Team(**crud.next_milestone(db, team_name).__dict__)
        return schemas.String(
            response=str(crud.next_milestone(db, team_name).current_milestone)
        )
    except Exception as e:
        # return exception message if message is "No next milestone"
        if str(e) == "No next milestone":
            response.status_code = status.HTTP_404_NOT_FOUND
            return schemas.String(response=str(e))
        # return 409 if any other exception
        response.status_code = status.HTTP_409_CONFLICT
        logger.error(traceback.format_exc())
