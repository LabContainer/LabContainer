from pydantic import BaseModel


class TeamCreate(BaseModel):
    name: str
    lab_id: str


class LabCreate(BaseModel):
    id: str
    course: str
    instructor: str


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
