from typing import Dict, Optional, Union, List
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.core import schemas
from analytics.logger import logger

router = APIRouter(prefix="/milestones")


@router.post("/create", tags=["milestones"])
def create_milestone(
    milestone: schemas.MilestoneCreate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db),
):
    if not payload["is_student"]:
        milestone = crud.create_milestone(db, milestone)
        return schemas.MilestoneCreate(**milestone.__dict__)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.get("", response_model=List[schemas.MilestoneCreate], tags=["milestones"])
def get_milestones(
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db)
):
    if not payload["is_student"]:
        milestones = crud.get_milestones(db)
        return [schemas.MilestoneCreate(**milestone.__dict__) for milestone in milestones]
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.get("/{milestone_id}", response_model=schemas.MilestoneCreate, tags=["milestones"])
def get_milestone(
    milestone_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db)
):
    if not payload["is_student"]:
        m = crud.get_milestone(db, milestone_id)
        return schemas.MilestoneCreate(**m.__dict__)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.delete("/{milestone_id}", tags=["milestones"])
def delete_milestone(
    milestone_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db)
):
    if not payload["is_student"]:
        crud.delete_milestone(db, milestone_id)
        return
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.patch("/{milestone_id}", tags=["milestones"])
def patch_milestone(
    milestone_id: str,
    milestone: schemas.MilestoneCreate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db: SessionLocal = Depends(get_db)
):
    if not payload["is_student"]:
        crud.update_milestone(db, milestone_id, milestone)
        return
    else:
        response.status_code = status.HTTP_403_FORBIDDEN

# Instructor Only Endpoints
