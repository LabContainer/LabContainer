# Keeps track of student assigned environments
from sqlalchemy.orm import relationship
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String

from ..db import Base


class Envionments(Base):
    __tablename__ = 'environments'
    ip = Column(String, primary_key=True, index=True)
    port = Column(String, index=True)
    ssh_password = Column(String)
    ssh_user = Column(String, ForeignKey("users.username"))

    users = relationship("Users", back_populates="environments")
