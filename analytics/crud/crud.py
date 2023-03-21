from datetime import datetime
from typing import Any, Union, List
from sqlalchemy import update
from sqlalchemy.orm import Session
from analytics.core.db import Envionment, Lab, Team, User, Milestone, Message
import analytics.core.schemas as schemas
from analytics.logger import logger
import uuid


def create_lab(db: Session, lab: schemas.LabCreate, lab_id: str):
    lab_dict = lab.dict()
    new_lab = Lab(**lab_dict, id=lab_id)
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
    # Find the first milestone in the lab (order by date)
    first_milestone = (
        db.query(Milestone)
        .filter(Milestone.lab_id == team.lab_id)
        .order_by(Milestone.deadline)
        .first()
    )
    new_team = Team(
        **team.dict(),
        current_milestone=first_milestone.milestone_id if first_milestone else None,
    )
    db.add(new_team)
    db.commit()


# move team to next milestone
def next_milestone(db: Session, team_name: str):
    team = get_team(db, team_name)
    if team is None:
        raise Exception("Invalid team name")
    # get current milestone
    if team.current_milestone is None:
        raise Exception("No current milestone")
    current = get_milestone(db, str(team.current_milestone))
    if current is None:
        raise Exception("Invalid current milestone")
    # Find the next milestone in the lab (order by date)
    next_milestone = (
        db.query(Milestone)
        .filter(Milestone.lab_id == team.lab_id)
        .filter(Milestone.deadline > current.deadline)
        .order_by(Milestone.deadline)
        .first()
    )
    if next_milestone is None:
        raise Exception("No next milestone")
    team.current_milestone = next_milestone.milestone_id
    db.commit()
    db.refresh(team)
    return team


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


def get_team_for_lab_user(db: Session, lab_id: str, username: str) -> Union[Team, None]:
    return (
        db.query(Team)
        .join(Team.lab)
        .join(Team.users)
        .filter(Lab.id == lab_id)
        .filter(User.name == username)
        .first()
    )


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
    if team is None:
        raise Exception("Invalid team")
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
        raise Exception(f"More than one env found for team {team_name} user {username}")
    if not env_list:
        return None
    return env_list[0]


def create_user_env(
    db: Session, env: schemas.EnvCreate, username: str, team_name: str
) -> Envionment:
    db_env = Envionment(**env.dict())
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
        logger.info(f"No Env for user {username}")
    return


def create_milestone(db: Session, milestone: schemas.MilestoneCreate):
    milestone_dict = milestone.dict()
    milestone_dict["deadline"] = milestone_dict["deadline"]
    # Create milestone id
    milestone_dict["milestone_id"] = str(uuid.uuid4())
    new_milestone = Milestone(**milestone_dict)
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    return new_milestone


def get_milestones(db: Session, lab_id: str) -> List[Milestone]:
    return (
        db.query(Milestone)
        .filter(Milestone.lab_id == lab_id)
        .order_by(Milestone.deadline)
        .all()
    )


def get_milestone(db: Session, milestone_id: str) -> Union[Milestone, None]:
    return db.query(Milestone).filter(Milestone.milestone_id == milestone_id).first()


def get_milestones_per_lab(db: Session, lab_id: str) -> List[Milestone]:
    return db.query(Milestone).join(Milestone.lab).filter(Lab.id == lab_id).all()


def delete_milestone(db: Session, milestone_id: str):
    milestone = get_milestone(db, milestone_id)
    if milestone:
        db.delete(milestone)
        db.commit()
        return True
    return False


def update_milestone(
    db: Session, milestone_id: str, milestone: schemas.MilestoneCreate
):
    new_milestone_dict = milestone.dict()
    old_milestone = get_milestone(db, milestone_id)
    if old_milestone:
        stmt = (
            update(Milestone)
            .where(Milestone.milestone_id == milestone_id)
            .values(**new_milestone_dict)
        )
        db.execute(stmt)
        db.commit()
        return True
    return False


def postMessage(db: Session, message: schemas.MessageCreate, env_id: str):
    new_message = Message(
        **message.dict(),
        timestamp=datetime.now(),
        env_id=env_id,
        message_id=str(uuid.uuid4()),
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


def getMessages(db: Session, env_id: str) -> List[Message]:
    return (
        db.query(Message)
        .filter(Message.env_id == env_id)
        .order_by(Message.timestamp)
        .all()
    )
