from pydantic import BaseModel
from typing import Optional
from datetime import date


class TeamCreate(BaseModel):
    name: str
    lab_id: str


class Team(BaseModel):
    name: str
    lab_id: str
    current_milestone: Optional[str]
    users: Optional[list]


class LabCreate(BaseModel):
    name: str
    course: str
    instructor: str
    description: str
    deadline: date
    environment_init_script: str


class String(BaseModel):
    response: str


class Lab(LabCreate):
    id: str

    class Config:
        orm_mode = True


class EnvCreate(BaseModel):
    """
    Schema for creating an environment
    TODO: Communicate with kubernetes controller to spin and keep track of running environments
    """

    env_id: str
    url: str
    image: str
    name: str
    user: str
    team: str

    class Config:
        orm_mode = True


class MilestoneCreate(BaseModel):
    lab_id: str
    deadline: date
    description: str


class Milestone(MilestoneCreate):
    milestone_id: str

    class Config:
        orm_mode = True


class Environment(BaseModel):
    """
    Schema for Environment
    """

    url: str

    class Config:
        orm_mode = True


class User(BaseModel):
    name: str
