FROM python:3.8.13-slim-buster

WORKDIR /app
SHELL ["/bin/bash", "-c"] 

RUN apt update
RUN apt install libpq-dev gcc curl -y

ENV PYTHONPATH=/app/analytics

RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python - 
ENV PATH="/root/.poetry/bin:$PATH"
COPY poetry.lock pyproject.toml ./
RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction

COPY . analytics/

EXPOSE 5000

# Volume for named pipe on host. Temp Solution, change when using kubernetes api
# VOLUME [ "/hostpipe" ]

CMD [ "uvicorn" , "analytics.main:app", "--host", "0.0.0.0", "--port", "8000"]  