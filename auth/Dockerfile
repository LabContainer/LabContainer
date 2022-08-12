FROM python:3.8.13-slim-buster

WORKDIR /app

RUN apt update
RUN apt install libpq-dev gcc -y

ENV PYTHONPATH=/app/auth

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . auth/

EXPOSE 5000

# Volume for named pipe on host. Temp Solution, change when using kubernetes api
# VOLUME [ "/hostpipe" ]

CMD [ "uvicorn" , "auth.main:app", "--host", "0.0.0.0", "--port", "5000"]  