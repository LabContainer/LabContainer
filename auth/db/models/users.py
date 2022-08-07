from sqlalchemy.orm import relationship
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String

from ..db import Base


class User(Base):
    __tablename__ = 'users'
    username = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_student = Column(Boolean, default=True)

    environments = relationship("Environments", back_populates="users")
