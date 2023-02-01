from typing import Dict, Optional, Union, List
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.core import schemas
from analytics.logger import logger

router = APIRouter(prefix="/milestones")


@router.post(
    "/create",
    tags=["milestones"],
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.Milestone,
)
def create_milestone(
    milestone: schemas.MilestoneCreate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db=Depends(get_db),
):
    if not payload["is_student"]:
        milestone = crud.create_milestone(db, milestone)
        return schemas.Milestone(**milestone.__dict__)
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.get("", response_model=List[schemas.Milestone], tags=["milestones"])
def get_milestones(
    response: Response,
    lab_id: str,
    payload: Dict[str, str] = Depends(has_access),
    db=Depends(get_db),
):
    milestones = crud.get_milestones(db, lab_id)
    return [schemas.Milestone(**milestone.__dict__) for milestone in milestones]


@router.get("/{milestone_id}", response_model=schemas.Milestone, tags=["milestones"])
def get_milestone(
    milestone_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db=Depends(get_db),
):
    m = crud.get_milestone(db, milestone_id)
    return schemas.Milestone(**m.__dict__)


@router.delete("/{milestone_id}", tags=["milestones"])
def delete_milestone(
    milestone_id: str,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db=Depends(get_db),
):
    if not payload["is_student"]:
        if crud.delete_milestone(db, milestone_id):
            response.status_code = status.HTTP_200_OK
            return
        response.status_code = status.HTTP_404_NOT_FOUND
        return
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


@router.patch("/{milestone_id}", tags=["milestones"])
def patch_milestone(
    milestone_id: str,
    milestone: schemas.MilestoneCreate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db=Depends(get_db),
):
    if not payload["is_student"]:
        if crud.update_milestone(db, milestone_id, milestone):
            response.status_code = status.HTTP_200_OK
            return
        response.status_code = status.HTTP_404_NOT_FOUND
        return
    else:
        response.status_code = status.HTTP_403_FORBIDDEN


# Instructor Only Endpoints
