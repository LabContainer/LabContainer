from pydantic import BaseModel, Field


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


class UserForgotInfo(UserBase):
    """
    Schema for User creation
    """

    email: str



class UserLogin(UserBase):
    """
    Schema for Login information
    """

    password: str

class resetPassword(UserBase):
    """
    Schema for Login information
    """

    password: str




class passwordUpdate(UserBase):
    """
    Schema for Updating password
    """

    newPassword : str



class UserCreate(UserLogin, UserInfo):
    """
    Schema for User creation
    """

    class Config:
        orm_mode = True

class LoginAccess(BaseModel):
    access_token: str = None
    
class LoginResult(BaseModel):
    access_token: str = None
    refresh_token: str = None
