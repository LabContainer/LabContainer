from fastapi import APIRouter, status, Depends, Response, Header
from typing import Dict, List, Union
import datetime
import os
import jwt
import smtplib, ssl
import requests
import smtplib

from auth.logger import logger
from auth.core.db import SessionLocal
from auth.crud import crud
import auth.core.schemas as schemas
from auth.dependencies import get_db, has_access, has_refresh
from auth.utils import gen_access_token, gen_internal_token, gen_reset_token

router = APIRouter(prefix="/webapp")


@router.post("/login", response_model=schemas.LoginResult, tags=["webapp"])
def login(
    login_info: schemas.UserLogin,
    response: Response,
    db=Depends(get_db),
):
    auth_user: schemas.UserCreate = crud.login_user(db, login_info)
    if auth_user is not None:
        access_token = gen_access_token(auth_user)
        refresh_token = jwt.encode(
            {
                "user": auth_user.username,
                # refresh token lasts for 24 hours
                "exp": datetime.datetime.now(tz=datetime.timezone.utc)
                + datetime.timedelta(hours=24),
            },
            key=os.environ["REFRESH_SECRET"],
        )
        crud.add_rt(db, str(auth_user.username), refresh_token)
        return {"access_token": access_token, "refresh_token": refresh_token}

    response.status_code = status.HTTP_401_UNAUTHORIZED
    return schemas.LoginResult()


@router.post("/passReset", tags=["webapp"])
def resetPasswordFunction(
    usernameInfo: schemas.UserForgotInfo,
    response: Response,
    db=Depends(get_db),
):
    auth_user = crud.get_user(db, usernameInfo.username)
    logger.info(f"Reset request received for {str(auth_user.email)}")

    if auth_user is not None and auth_user.email == usernameInfo.email:
        try:
            access_token = gen_reset_token(auth_user)
            from_email = "ece496@outlook.com"
            to = auth_user.email
            base_url = f"http://localhost:3000"
            if os.getenv("ENVIRONMENT") == "production":
                base_url = f"https://api.labcontainer.dev"
            resetLink = f"{base_url}/passreset/?token={access_token}"
            subject = "Password Reset Email"
            date = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            message_text = f"""
            Your Password Reset Link is {resetLink}

            The link will expire in 24 hours.
            If you did not request a password reset, please ignore this email.
            """

            msg = "From: %s\nTo: %s\nSubject: %s\nDate: %s\n\n%s" % (
                from_email,
                to,
                subject,
                date,
                message_text,
            )

            mailserver = smtplib.SMTP("smtp.office365.com", 587)
            mailserver.ehlo()
            mailserver.starttls()
            mailserver.login("ece496@outlook.com", "designteam1234")
            mailserver.sendmail(from_email, str(to), msg)

            mailserver.quit()
            logger.info(f"Reset email sent to {str(auth_user.email)}")
            response.status_code = status.HTTP_200_OK
            return
        except:
            response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
            return
    else:
        response.status_code = status.HTTP_403_FORBIDDEN
        return


@router.put("/updatePass", tags=["webapp"])
def reset(
    new_password_data: schemas.PasswordUpdate,
    response: Response,
    payload: Dict[str, str] = Depends(has_access),
    db=Depends(get_db),
):
    if "purpose" in payload and payload["purpose"] == "reset":
        try:
            user = payload["reset_user"]
            if user != new_password_data.username:
                response.status_code = status.HTTP_403_FORBIDDEN
                return
            crud.update_password(db, user, new_password_data.newPassword)
        except:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return


@router.get("/refresh", response_model=schemas.LoginAccess, tags=["webapp"])
def refresh(
    response: Response,
    payload: Dict = Depends(has_refresh),
    db=Depends(get_db),
):
    auth_user: schemas.UserCreate = crud.get_user(db, payload["user"])
    if auth_user is not None:
        access_token = gen_access_token(auth_user)
        response.status_code = status.HTTP_202_ACCEPTED
        return {"access_token": access_token}


@router.post("/logout", tags=["webapp"])
def logout(payload: Dict = Depends(has_refresh), db=Depends(get_db)):
    crud.set_user_inactive(db, payload["user"])
    crud.invalidate_rts(db, payload["user"])
    # TODO
    auth_service_token = gen_internal_token(
        payload_fields={"user": payload["user"], "is_student": str(False)}
    )
    analytics_api = "http://analytics:8000"
    resp = requests.get(
        f"{analytics_api}/teams?username={payload['user']}",
        headers={"Authorization": f"Bearer {auth_service_token}"},
    )
    teams = resp.json()
    for team in teams:
        resp = requests.delete(
            f"{analytics_api}/environment/{team['name']}/{payload['user']}",
            headers={"Authorization": f"Bearer {auth_service_token}"},
        )
    return
