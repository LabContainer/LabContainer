from typing import Any, Union, List
from sqlalchemy.orm import Session
import bcrypt
import jwt
from sqlalchemy.orm import Session
from analytics.core.db import Envionment, Lab, Team, User
import analytics.core.schemas as schemas


def create_lab(db: Session, lab: schemas.LabCreate):
    new_lab = Lab(**lab.dict())
    db.add(new_lab)
    db.commit()


def get_lab(db: Session, lab_id: str):
    return db.query(Lab).filter(Lab.id == lab_id).first()


def get_labs(db: Session):
    return db.query(Lab).all()


def create_team(db: Session, team: schemas.TeamCreate):
    exists = db.query(Lab).filter(Lab.id == team.lab_id).first() is not None
    if not exists:
        raise Exception("Invalid lab id")
    new_team = Team(**team.dict())
    db.add(new_team)
    db.commit()


def get_team(db: Session, team_name: str) -> Union[Team, None]:
    return db.query(Team).filter(Team.name == team_name).first()


def get_teams_per_lab(db: Session, lab_id: str) -> List[Team]:
    return db.query(Team).join(Team.lab).filter(Lab.id == lab_id).all()


def get_teams_for_user(db: Session, username: str) -> List[Team]:
    return db.query(Team).join(Team.users).filter(User.name == username).all()


def get_lab_for_team(db: Session, team_name: str) -> Union[Any, Lab]:
    return db.query(Lab).join(Lab.teams).filter(Team.name == team_name).first()


def get_users_in_team(db: Session, team_name: str) -> List[User]:
    return db.query(User).join(User.team).filter(Team.name == team_name).all()


def get_user(db: Session, username: str) -> Union[User, None]:
    return db.query(User).filter(User.name == username).first()


def join_team(db: Session, team_name: str, username: str):
    user = get_user(db, username)
    if user is None:
        # User is none, Can't be in other teams for the same lab
        team = get_team(db, team_name)
        user = User(name=username)
        team.users.append(user)
        db.commit()
        return

    teams = get_teams_for_user(db, username)
    lab = get_lab_for_team(db, team_name)
    for team in teams:
        if team.lab_id == lab.id:
            raise Exception("User already in team for lab")
    team = get_team(db, team_name)
    team.users.append(user)
    db.commit()
    return


def leave_team(db: Session, team_name: str, username: str):
    user = get_user(db, username)
    team = get_team(db, team_name)
    if team is not None and user is not None:
        team.users.remove(user)
        db.commit()
        return
    raise Exception("Invalid team/user")


def delete_team(db: Session, team_name: str):
    pass


def get_env_for_user_team(
    db: Session, username: str, team_name: str
) -> Union[Envionment, None]:
    env_list = (
        db.query(Envionment)
        .join(Envionment.owning_user)
        .filter(User.name == username)
        .join(Envionment.owning_team)
        .filter(Team.name == team_name)
        .all()
    )
    if len(env_list) > 1:
        raise Exception(f"More than one env found for team {team_name} user {username}")
    if not env_list:
        return None
    return env_list[0]


def create_user_env(
    db: Session, env: schemas.EnvCreate, username: str, team_name: str
) -> Envionment:

    db_env = Envionment(
        host=env.host,
        env_id=env.id,
        network=env.network,
        ssh_password=env.ssh_password,
        ssh_user=username,
        ssh_user_team=team_name,
    )
    db.add(db_env)
    db.commit()
    db.refresh(db_env)
    return db_env


def remove_user_env(db: Session, username: str, team_name: str):
    db_env = get_env_for_user_team(db, username, team_name)
    if db_env is not None:
        db.delete(db_env)
        db.commit()
    else:
        print(f"No Env for user {username}")
    return