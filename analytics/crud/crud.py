from datetime import datetime
from typing import Any, Union, List
from sqlalchemy import update
from sqlalchemy.orm import Session
from analytics.core.db import Envionment, Lab, Team, User, Milestone
import analytics.core.schemas as schemas


def create_lab(db: Session, lab: schemas.LabCreate, lab_id: str):
    new_lab = Lab(**lab.dict(), id=lab_id)
    db.add(new_lab)
    db.commit()


def get_lab(db: Session, lab_id: str) -> Union[Lab, None]:
    return db.query(Lab).filter(Lab.id == lab_id).first()


def get_labs(db: Session):
    return db.query(Lab).all()


def get_users_per_lab(db: Session, lab_id: str) -> List[User]:
    return db.query(User).join(User.labs).filter(Lab.id == lab_id).all()


def get_labs_for_user(db: Session, username: str):
    return db.query(Lab).join(Lab.users).filter(User.name == username).all()


def create_team(db: Session, team: schemas.TeamCreate):
    exists = db.query(Lab).filter(Lab.id == team.lab_id).first() is not None
    if not exists:
        raise Exception("Invalid lab id")
    new_team = Team(**team.dict())
    db.add(new_team)
    db.commit()


def get_team(db: Session, team_name: str) -> Union[Team, None]:
    return db.query(Team).filter(Team.name == team_name).first()


def add_user_to_lab(db: Session, username: str, lab_id: str):
    user = get_user(db, username)
    lab = get_lab(db, lab_id)

    if lab is not None:
        # define user if none
        if user is None:
            user = User(name=username)
            db.add(user)
        lab.users.append(user)
        db.commit()
    else:
        return False
    
    return True


def remove_user_from_lab(db: Session, username: str, lab_id: str):
    user = get_user(db, username)
    # define user if none
    if user is None:
        raise Exception("Invalid User")

    lab = get_lab(db, lab_id)
    if not lab:
        raise Exception("Invalid Lab")
    lab.users.remove(user)
    db.commit()


def get_teams_per_lab(db: Session, lab_id: str) -> List[Team]:
    return db.query(Team).join(Team.lab).filter(Lab.id == lab_id).all()


def get_teams_for_user(db: Session, username: str) -> List[Team]:
    return db.query(Team).join(Team.users).filter(User.name == username).all()


def get_lab_for_team(db: Session, team_name: str) -> Union[Any, Lab]:
    return db.query(Lab).join(Lab.teams).filter(Team.name == team_name).first()


def get_users_in_team(db: Session, team_name: str) -> List[User]:
    return db.query(User).join(User.teams).filter(Team.name == team_name).all()


def get_user(db: Session, username: str) -> Union[User, None]:
    return db.query(User).filter(User.name == username).first()


def join_team(db: Session, team_name: str, username: str):
    user = get_user(db, username)
    if user is None:
        # User is none, Can't be in other teams for the same lab
        return Exception("No user in database, Add to lab")

    user_labs = get_labs_for_user(db, username)
    lab = get_lab_for_team(db, team_name)
    # check if user in labs
    valid = False
    for ulab in user_labs:
        if ulab.id == lab.id:
            valid = True
    if not valid:
        raise Exception(f"User not in lab {lab.id}")
    teams = get_teams_for_user(db, username)
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
    team = get_team(db, team_name)
    if team:
        db.delete(team)
        db.commit()


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
        raise Exception(
            f"More than one env found for team {team_name} user {username}")
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
        port=env.port,
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


def create_milestone(db: Session, milestone: schemas.MilestoneCreate):
    milestone_dict = milestone.dict()
    milestone_dict["deadline"] = datetime.strptime(
        milestone_dict["deadline"], "%Y-%m-%d").date()
    new_milestone = Milestone(**milestone_dict)
    db.add(new_milestone)
    db.commit()
    return new_milestone


def get_milestones(db: Session) -> List[Milestone]:
    return db.query(Milestone).all()


def get_milestone(db: Session, milestone_id: str) -> Union[Milestone, None]:
    return db.query(Milestone).filter(Milestone.milestone_id == milestone_id).first()


def get_milestones_per_lab(db: Session, lab_id: str) -> List[Milestone]:
    return db.query(Milestone).join(Milestone.lab).filter(Lab.id == lab_id).all()


def delete_milestone(db: Session, milestone_id: str):
    milestone = get_milestone(db, milestone_id)
    if milestone:
        db.delete(milestone)
        db.commit()


def update_milestone(db: Session, milestone_id: str, milestone: schemas.MilestoneCreate):
    new_milestone_dict = milestone.dict()
    new_milestone_dict["deadline"] = datetime.strptime(
        new_milestone_dict["deadline"], "%Y-%m-%d").date()

    old_milestone = get_milestone(db, milestone_id)
    if old_milestone:
        stmt = (
            update(Milestone)
            .where(Milestone.milestone_id == milestone_id)
            .values(**new_milestone_dict)
        )
        db.execute(stmt)
        db.commit()
        return
