# Analytics Server

TODO: Create a server to display dahsboard information, metrics for students and course staff. Ther server should be responsible for keepting track of and managing, creation , progress of labs

## Setup

```bash
poetry install
```

## Start

Use `docker-compose` to run analytics in conjunction with postgres db, student-server . Manual run requries editing db url.

```bash
# in analytics/
export PYTHONPATH=$PWD
poetry run uvicorn analytics.main:app --reload --port 5000
```

## Database Migrations

Using `Alembic` for database migrations. Need to do migrations whenever Models are changed

### Steps

- Run `poetry shell` to enter virtualenv
- Run `docker-compose up -d postgresserver` to start postgres
- Change `MIGRATIONS=True` in line 15 `core/db.py`, change it back before `docker-compose build`
- Run `alembic revision --autogenerate -m "<Revision Message>"`
- Run `alembic upgrade head` to apply revision
