# Auth Service

Provides API for creating and authenting users with JWT and Manages student environments

## Setup

```bash
poetry install
```

## Start

Use `docker-compose` to run auth in conjunction with postgres db, student-server . Manual run requries editing db url.

```bash
# in auth/
export PYTHONPATH=$PWD
poetry run uvicorn auth.main:app --reload --port 5000
```

## Database Migrations

Using `Alembic` for database migrations. Need to do migrations whenever Models are changed

### Steps

- Run `poetry shell` to enter virtualenv
- Run `docker-compose up -d postgresserver` to start postgres
- Change `MIGRATIONS=True` in line 15 `core/db.py`, change it back before `docker-compose build`
- Run `alembic revision --autogenerate -m "<Revision Message>"`
- Run `alembic upgrade head` to apply revision
