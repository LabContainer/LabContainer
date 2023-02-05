# Lab Capture

[![Deploy](https://github.com/LabContainer/LabContainer/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/LabContainer/LabContainer/actions/workflows/firebase-hosting-merge.yml)

https://labcontainer.dev

## Reqirements

- Python 3.8.10
- Nodejs 16 LTS
- Docker

## Start Demo

### Frontend

```bash
cd client
npm start
```

### Backend

Create `.env` file, secrets can be generated using `gen_auth_key` script.

Root Directory: 

```bash
SECRET_TOKEN=<secret>
REFRESH_SECRET=<secret>
AUTH_PORT=5000
ANALYTICS_PORT=8000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<secret>
```

`student-mamanger-service` :

```bash
SECRET_TOKEN=<secret>
```

#### Run

```bash
docker compose up --build
```

## Project Structure

- `client` - Frontend application
- `auth` - Authentication service
- `student-manager-service` - Student Remote server to run on env container
- `analytics` - Backend for course staff dashboard, analytics

## Links

- Projects - <https://github.com/orgs/Lab-Capture/projects/2>
- Drive - <https://drive.google.com/drive/folders/1IOdbpZZFkTWpxn6nbv3MexI9z9uzhqQF>
- Lucidchart - <https://lucid.app/lucidchart/3e2d8069-f729-4c23-8d20-7d3a1a409f48/edit?from_internal=true>

## Techonologies Used

- Frontent - React
- Frontend UI Library - Material UI
- Backend - Auth Service - FastAPI
- Backend - Student Manager Service - Nodejs express
- Backend - analytics - FastAPI
- Backend - Container runtime - docker
- Reverse Proxy - Nginx
- Deploying - Frontend - Firebase
- Deploying Backend - Google Cloud Compute Instance
