from sqlalchemy import create_engine
from sqlalchemy import Boolean, Column, ForeignKey, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

import os
import dotenv

# SQLALCHEMY_DATABASE_URL = "sqlite:///./sqlite.db"


env_path = os.path.abspath(os.path.join(os.getenv('PYTHONPATH'), '..', '.env'))
dotenv.load_dotenv(dotenv_path=env_path)

# postgres:
SQLALCHEMY_DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@postgresserver:5432"

# sqlite ::: connect_args={"check_same_thread": False})
engine = create_engine(SQLALCHEMY_DATABASE_URL)

Base = declarative_base(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class User(Base):
    __tablename__ = 'user'
    username = Column(String, primary_key=True, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_student = Column(Boolean, default=True)
    # environment = relationship("Environment", back_populates="owner")


class Envionment(Base):
    __tablename__ = 'environment'
    id = Column(String, primary_key=True, index=True)
    host = Column(String, index=True)
    network = Column(String, index=True)
    ssh_password = Column(String)
    ssh_user = Column(String, ForeignKey("user.username"))
    # back_populates="environment")
    owner = relationship(User, backref='environment')


Base.metadata.create_all()
