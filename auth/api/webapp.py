
import requests
from fastapi import APIRouter, status, Depends, Response, Header
from typing import Dict, List, Union
import datetime
import os
import jwt
import smtplib, ssl
import bcrypt




from auth.core.db import SessionLocal
from auth.crud import crud
import auth.core.schemas as schemas
from auth.dependencies import get_db, has_access, has_refresh
from auth.utils import gen_access_token, gen_internal_token, gen_reset_token
import smtplib


router = APIRouter(prefix="/webapp")



@router.post("/login", response_model=Union[str, schemas.LoginResult])
def login(
    login_info: schemas.UserLogin,
    response: Response,
    db: SessionLocal = Depends(get_db),
):
    auth_user: schemas.UserCreate = crud.login_user(db, login_info)
    if auth_user is not None:
        access_token = gen_access_token(auth_user)
        refresh_token = jwt.encode(
            {
                "user": auth_user.username,
                # refresh token lasts for 24 hours
                "exp": datetime.datetime.now(tz=datetime.timezone.utc)
                + datetime.timedelta(seconds=60 * 60 * 24),
            },
            key=os.environ["REFRESH_SECRET"],
        )
        crud.add_rt(db, auth_user.username, refresh_token)
        return {"access_token": access_token, "refresh_token": refresh_token}

    response.status_code = status.HTTP_401_UNAUTHORIZED
    return "Not Allowed"


#############



@router.post("/passReset", response_model=Union[str, schemas.passwordUpdate])
def resetPasswordFunction(
    usernameInfo: schemas.UserForgotInfo,
    response: Response,
    db: SessionLocal = Depends(get_db),
):
    auth_user = crud.get_user(db,usernameInfo.username)
    print(auth_user.email)

    if auth_user is not None:
        print("username belowz")
        print(auth_user.username)
        print(auth_user.email)

        try :
            print("Generating token")
            access_token = gen_reset_token(auth_user)
            fromMy = "ece496@outlook.com" # fun-fact: "from" is a keyword in python, you can't use it as variable.. did anyone check if this code even works?
            to  = auth_user.email 
            print("THISHIFAOEUBFGOEUBGOUEWGOUWENGU")
            print(auth_user.email)
            resetLink = "http://localhost:3000/passReset/?token=%s" % (access_token)
            subj='Password Reset Email'
            date='2/1/2010'
            message_text= "Your Password Reset Link is %s" % (resetLink)

            msg = "From: %s\nTo: %s\nSubject: %s\nDate: %s\n\n%s" % ( fromMy, to, subj, date, message_text )
            
            mailserver = smtplib.SMTP('smtp.office365.com',587)
            mailserver.ehlo()
            mailserver.starttls()
            print("point two")
            mailserver.login("ece496@outlook.com", "designteam1234")
            print("point3")
            #Adding a newline before the body text fixes the missing message body
            mailserver.sendmail(fromMy, to,msg)
            print("point4")
            mailserver.quit()
            print("email sent")
        except:
            print('email not sent')


@router.put("", response_model=schemas.passwordUpdate)
def reset(new_password: schemas.passwordUpdate, response: Response, payload: Dict[str, str] = Depends(has_access), db: SessionLocal = Depends(get_db)):
    print("stR")

    if payload["purpose"] == "reset":
        print("initially ok")
        try:
            user = payload["reset_user"]
            print("user is")
            print(user)
            crud.updatePassword(db,user,new_password)
            print("worked")
        except:     
            print("didnt work")  

# @router.post("/passReset", response_model=Union[str, schemas.passwordUpdate])
# def resetPasswordFunction(
#     usernameInfo: schemas.UserForgotInfo,
#     response: Response,
#     db: SessionLocal = Depends(get_db),
# ):
#     auth_user = crud.get_user(db,usernameInfo.username)

@router.get("/forgot")
def forgot(
    usernameInfo: schemas.UserForgotInfo,
    db: SessionLocal = Depends(get_db),
):
    auth_user = crud.get_user(db,usernameInfo.username)
    if auth_user is not None:
        try :
            access_token = gen_access_token(auth_user)
            print("point one")
            fromMy = "ece496@outlook.com" # fun-fact: "from" is a keyword in python, you can't use it as variable.. did anyone check if this code even works?
            to  = usernameInfo.email
            resetLink = "http://localhost:3000/passReset/%s" % (access_token)
            subj='Password Reset Email'
            date='2/1/2010'
            message_text= "Your Password Reset Link is %s" % (resetLink)

            msg = "From: %s\nTo: %s\nSubject: %s\nDate: %s\n\n%s" % ( fromMy, to, subj, date, message_text )


            mailserver = smtplib.SMTP('smtp.office365.com',587)
            mailserver.ehlo()
            mailserver.starttls()
            print("point two")
            mailserver.login("ece496@outlook.com", "designteam1234")
            print("point3")
            #Adding a newline before the body text fixes the missing message body
            mailserver.sendmail(fromMy, to,msg)
            print("point4")
            mailserver.quit()
            print("email sent")
        except :
            print('email not sent')






@router.get("/refresh")
def refresh(
    response: Response,
    payload: Dict = Depends(has_refresh),
    db: SessionLocal = Depends(get_db),
):
    auth_user: schemas.UserCreate = crud.get_user(db, payload["user"])
    if auth_user is not None:
        access_token = gen_access_token(auth_user)
        response.status_code = status.HTTP_202_ACCEPTED
        return {"access_token": access_token}


@router.post("/logout")
def logout(payload: Dict = Depends(has_refresh), db: SessionLocal = Depends(get_db)):
    crud.set_user_inactive(db, payload["user"])
    crud.invalidate_rts(db, payload["user"])
    # TODO
    auth_service_token = gen_internal_token(
        payload_fields={"user": payload["user"], "is_student": False}
    )
    analytics_api = "http://analytics:8000"
    resp = requests.get(
        f"{analytics_api}/teams?username={payload['user']}",
        headers={"Authorization": f"Bearer {auth_service_token}"},
    )
    teams = resp.json()
    print(teams)
    for team in teams:
        print(team)
        resp = requests.delete(
            f"{analytics_api}/environment/{team['name']}/{payload['user']}",
            headers={"Authorization": f"Bearer {auth_service_token}"},
        )
        print(resp.text)
    return
