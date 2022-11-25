from sqlalchemy import create_engine
from sqlalchemy import Boolean, Column, ForeignKey, String, Table, ForeignKeyConstraint, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

import os
import dotenv

# SQLALCHEMY_DATABASE_URL = "sqlite:///./sqlite.db"


env_path = os.path.abspath(os.path.join(os.getenv("PYTHONPATH"), "..", ".env"))
dotenv.load_dotenv(dotenv_path=env_path)

MIGRATIONS = False

postgres_host = "0.0.0.0" if MIGRATIONS else "postgres-analytics"
# postgres:
SQLALCHEMY_DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{postgres_host}:5432"

# sqlite ::: connect_args={"check_same_thread": False})
engine = create_engine(
    SQLALCHEMY_DATABASE_URL  # , connect_args={"check_same_thread": False}
)

Base = declarative_base(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


association_table_user_lab = Table(
    "association_user_lab",
    Base.metadata,
    Column("lab_id", ForeignKey("labs.id")),
    Column("user_name", ForeignKey("users.name")),
)


class Lab(Base):
    __tablename__ = "labs"
    id = Column(String, primary_key=True, index=True)
    course = Column(String)
    instructor = Column(String)
    teams = relationship("Team", back_populates="lab")
    milestones = relationship("Milestone", back_populates="lab")
    users = relationship(
        "User", secondary=association_table_user_lab, back_populates="labs"
    )


association_table_user_team = Table(
    "association_user_team",
    Base.metadata,
    Column("team_name", ForeignKey("teams.name")),
    Column("user_name", ForeignKey("users.name")),
)


class Team(Base):
    __tablename__ = "teams"
    name = Column(String, primary_key=True, index=True)
    lab_id = Column(String, ForeignKey("labs.id"))
    lab = relationship("Lab", back_populates="teams")
    current_milestone = Column(String, ForeignKey("milestone.milestone_id"))
    users = relationship(
        "User", secondary=association_table_user_team, back_populates="teams"
    )
    environments = relationship("Envionment", back_populates="owning_team")


class User(Base):
    __tablename__ = "users"
    name = Column(String, primary_key=True, index=True)
    teams = relationship(
        "Team", secondary=association_table_user_team, back_populates="users"
    )
    labs = relationship(
        "Lab", secondary=association_table_user_lab, back_populates="users"
    )
    environments = relationship("Envionment", back_populates="owning_user")


class Envionment(Base):
    __tablename__ = "environment"
    env_id = Column(String, primary_key=True, index=True)
    host = Column(String, index=True)
    network = Column(String, index=True)
    port = Column(String)
    ssh_password = Column(String)
    ssh_user_team = Column(String, ForeignKey("teams.name"))
    ssh_user = Column(String, ForeignKey("users.name"))
    owning_user = relationship("User", back_populates="environments")
    owning_team = relationship("Team", back_populates="environments")

#Need to make milestone connection for team
class Milestone(Base):
    __tablename__ = "milestone"
    milestone_id = Column(String, primary_key=True, index=True)
    lab_id = Column(String, ForeignKey("labs.id"))
    lab = relationship("Lab", back_populates="milestones")
    deadline = Column(Date)
    description = Column(String)

Base.metadata.create_all()
