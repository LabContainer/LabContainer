from typing import Dict, Optional, Union
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.core import schemas

router = APIRouter(prefix="/milestones")


@router.post("/create")
def create_milestone(
    milestone: schemas.MilestoneCreate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        return crud.create_milestone(db, milestone)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.get("")
def get_milestones(
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db)
):
    if not payload["is_student"]:
        return crud.get_milestones(db)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/{milestone_id}")
def get_milestone(
    milestone_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db)
):
    if not payload["is_student"]:
        return crud.get_milestone(db, milestone_id)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.delete("/{milestone_id}")
def delete_milestone(
    milestone_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db)
):
    if not payload["is_student"]:
        return crud.delete_milestone(db, milestone_id)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN



@router.patch("/{milestone_id}")
def patch_milestone(
    milestone_id: str,
    milestone: schemas.MilestoneCreate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db)
):
    if not payload["is_student"]:
        return crud.update_milestone(db, milestone_id, milestone)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN

# Instructor Only Endpoints