from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import jwt
import dotenv
import os
from analytics.utils import *
from analytics.env_manager import *
from analytics.api import environment, team, labs, milestones

env_path = os.path.abspath(os.path.join(os.getenv("PYTHONPATH"), "..", ".env"))
dotenv.load_dotenv(dotenv_path=env_path)


def custom_generate_unique_id(route):
    # if len(route.tags) == 0:
    #     raise Exception(route.name)
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(generate_unique_id_function=custom_generate_unique_id)


origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://labcontainer.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(environment.router)
app.include_router(team.router)
app.include_router(labs.router)
app.include_router(milestones.router)


@app.get("/", tags=["Root"])
def root():
    return "Analytics Service API"


if __name__ == "__main__":
    uvicorn.run(app, port=5000, host="0.0.0.0")
