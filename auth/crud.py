from sqlalchemy.orm import Session
import bcrypt

from db import User, Envionment
import schemas


def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_env_for_user(db: Session, username: str):
    return db.query(Envionment).join(Envionment.owner).filter(User.username == username).first()


def get_all_students(db: Session, limit: int = None):
    query = db.query(User).filter(User.is_student)
    if limit is not None:
        return query.all()
    else:
        return query.limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    salt = bcrypt.gensalt()
    hashed_pass = bcrypt.hashpw(user.password.encode('utf8'), salt)
    db_user = User(username=user.username, email=user.email,
                   hashed_password=hashed_pass, is_active=False, is_student=user.is_student)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def login_user(db: Session, user: schemas.UserLogin):
    saved_user = get_user(db, user.username)
    if saved_user is not None and bcrypt.checkpw(user.password.encode('utf8'), saved_user.hashed_password):
        return saved_user
    return None


def create_student_env(db: Session, env: schemas.EnvCreate, username: str):
    db_env = Envionment(**env.dict(), ssh_user=username)
    db.add(db_env)
    db.commit()
    db.refresh(db_env)
    return db_env
