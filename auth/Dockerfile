FROM python:3.8.13-slim-buster

WORKDIR /app
SHELL ["/bin/bash", "-c"] 

RUN apt update
RUN apt install libpq-dev gcc curl -y

ENV PYTHONPATH=/app/auth

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/root/.poetry python3 -
ENV PATH="/root/.poetry/bin:$PATH"
COPY poetry.lock pyproject.toml ./
RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction

COPY . auth/

EXPOSE 5000

# Volume for named pipe on host. Temp Solution, change when using kubernetes api
# VOLUME [ "/hostpipe" ]

CMD [ "uvicorn" , "auth.main:app", "--host", "0.0.0.0", "--port", "5000"]  