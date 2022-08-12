from typing import List
from sqlalchemy.orm import Session
import bcrypt

from auth.core.db import User, Envionment
import auth.core.schemas as schemas


def get_user(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()


def get_env_for_user(db: Session, username: str) -> Envionment:
    return db.query(Envionment).join(Envionment.owner).filter(User.username == username).first()


def get_all_students(db: Session, limit: int = None) -> List[User]:
    query = db.query(User).filter(User.is_student)
    if limit is None:
        return query.all()
    else:
        return query.limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate) -> User:
    salt = bcrypt.gensalt()
    hashed_pass = bcrypt.hashpw(user.password.encode('utf8'), salt).hex()
    db_user = User(username=user.username, email=user.email,
                   hashed_password=hashed_pass, is_active=False, is_student=user.is_student)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def login_user(db: Session, user: schemas.UserLogin):
    saved_user = get_user(db, user.username)
    if saved_user is not None and bcrypt.checkpw(user.password.encode('utf8'), bytes.fromhex(saved_user.hashed_password)):
        saved_user.is_active = True
        db.commit()
        db.refresh(saved_user)
        return saved_user
    return None


def create_student_env(db: Session, env: schemas.EnvCreate, username: str) -> Envionment:

    db_env = Envionment(host=env.host, id=env.id, network=env.network,
                        ssh_password=env.ssh_password, ssh_user=username)
    db.add(db_env)
    db.commit()
    db.refresh(db_env)
    return db_env


def remove_student_env(db: Session, username: str):
    db_env = get_env_for_user(db, username)
    db.delete(db_env)
    db.commit()
    # db.refresh(db_env)
    return db_env


def set_user_inactive(db: Session, username: str):
    user = get_user(db, username)
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user
