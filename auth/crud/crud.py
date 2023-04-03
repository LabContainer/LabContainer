from typing import List
from sqlalchemy.orm import Session
import bcrypt
import jwt

from auth.core.db import RefreshTokens, User
import auth.core.schemas as schemas


def get_user(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()


def get_all_users(db: Session, limit: int = None) -> List[User]:
    query = db.query(User)
    if limit is None:
        return query.all()
    else:
        return query.limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate) -> User:
    print("skr")
    salt = bcrypt.gensalt()
    hashed_pass = bcrypt.hashpw(user.password.encode("utf8"), salt).hex()
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pass,
        is_active=False,
        is_student=user.is_student,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def login_user(db: Session, user: schemas.UserLogin):
    saved_user = get_user(db, user.username)
    if saved_user is not None and bcrypt.checkpw(
        user.password.encode("utf8"), bytes.fromhex(str(saved_user.hashed_password))
    ):
        saved_user.is_active = True
        db.commit()
        db.refresh(saved_user)
        return saved_user
    return None


def update_password(db: Session, username: str, new_password: str) -> User:
    user = get_user(db, username)
    salt = bcrypt.gensalt()
    user.hashed_password = bcrypt.hashpw(new_password.encode("utf8"), salt).hex()
    db.commit()
    db.refresh(user)
    return user


def set_user_inactive(db: Session, username: str):
    user = get_user(db, username)
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user


def add_rt(db: Session, username: str, token: str):
    """
    Add new rt for user
    """
    rt = RefreshTokens(token=token, user=username)
    db.add(rt)
    db.commit()


def invalidate_rts(db: Session, username: str):
    """
    Invalidate all refresh tokens of user
    """
    rts = get_rts(db, username)
    for rt in rts:
        db.delete(rt)
    db.commit()


def get_rts(db: Session, username: str) -> List[RefreshTokens]:
    """
    Get all Refresh tokens for user.
    """
    return (
        db.query(RefreshTokens)
        .join(RefreshTokens.owner)
        .filter(User.username == username)
        .all()
    )


def check_rt(db: Session, username: str, token: str) -> bool:
    """
    Chaeck if user refresh token is valid
    """
    rts = get_rts(db, username)
    for rt in rts:
        if rt.token == token:
            return True
    return False
