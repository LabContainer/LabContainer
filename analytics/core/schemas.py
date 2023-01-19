from pydantic import BaseModel


class TeamCreate(BaseModel):
    name: str
    lab_id: str


class LabCreate(BaseModel):
    name: str
    course: str
    instructor: str
    description: str
    environment_init_script: str
class Lab(LabCreate):
    id: str

    class Config:
        orm_mode = True


class EnvCreate(BaseModel):
    """
    Schema for creating an environment
    TODO: Communicate with kubernetes controller to spin and keep track of running environments 
    """
    id: str
    host: str
    network: str
    ssh_password: str  # Plain string , security concern ?
    port: int

    class Config:
        orm_mode = True


class MilestoneCreate(BaseModel):
    milestone_id: str
    lab_id: str
    deadline: str
    description: str


class Environment(BaseModel):
    """
    Schema for Environment
    """
    host: str
    network: str
    ssh_password: str  # Plain string , security concern ?
    port: int
    ssh_user: str

    class Config:
        orm_mode = True


class User(BaseModel):
    name: str
