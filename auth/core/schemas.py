from pydantic import BaseModel


class UserBase(BaseModel):
    """
    Base User schema
    """
    username: str


class UserInfo(UserBase):
    """
    Schema for User creation
    """
    email: str
    is_student: bool


class UserLogin(UserBase):
    """
    Schema for Login information
    """
    password: str


class UserCreate(UserLogin, UserInfo):
    """
    Schema for User creation
    """
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

    class Config:
        orm_mode = True


class LoginResult(BaseModel):
    access_token: str = None
    refresh_token: str = None
