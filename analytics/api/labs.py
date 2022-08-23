import imp
from typing import Dict
from fastapi import APIRouter, status, Response, Header, Depends

from analytics.core.db import SessionLocal
import analytics.crud.crud as crud
from analytics.dependencies import has_access, get_db
from analytics.core import schemas
import traceback

router = APIRouter(prefix="/labs")

# Instructor only endpoints
@router.post("/create")
def create_lab(lab: schemas.LabCreate, db: SessionLocal = Depends(get_db)):
    return crud.create_lab(db, lab)


@router.get("/{lab_id}")
def get_lab(lab_id: str, db: SessionLocal = Depends(get_db)):
    return crud.get_lab(db, lab_id)


@router.get("")
def get_labs(db: SessionLocal = Depends(get_db)):
    return crud.get_labs(db)


@router.get("/{lab_id}/teams")
def get_lab_teams(lab_id: str, db: SessionLocal = Depends(get_db)):
    return crud.get_teams_per_lab(db, lab_id)
