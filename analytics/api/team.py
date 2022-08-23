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
def get_team(team_name: str, db: SessionLocal = Depends(get_db)):
    return crud.get_team(db, team_name)


@router.get("/")
def get_user_teams(username: str, db: SessionLocal = Depends(get_db)):
    return crud.get_teams_for_user(db, username)


@router.post("/create")
def create_new_team(team: schemas.TeamCreate, db: SessionLocal = Depends(get_db)):
    return crud.create_team(db, team)


@router.post("/{team_name}/join")
def join_team(team_name: str, username: str, db: SessionLocal = Depends(get_db)):
    crud.join_team(db, team_name, username)
    return


@router.post("/{team_name}/leave")
def leave_team(team_name: str, username: str, db: SessionLocal = Depends(get_db)):
    crud.leave_team(db, team_name, username)
    return


# Individual
@router.get("/{team_name}/labs")
def get_team_labs(
    team_name: str, response: Response, db: SessionLocal = Depends(get_db)
):
    return crud.get_lab_for_team(db, team_name)
