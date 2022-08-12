# Lab Capture

## Reqirements

- Python 3.8.10
- Nodejs 16 LTS
- Docker

## Start Demo

### Frontend

<https://codecapture.web.app>

### Backend
```bash
docker-compose up
```

## Project Structure

- `client` - Frontend application
- `auth` - Authentication service
- `student-server` - Student Remote server to serve client, and connect to env container via ssh
- `auth/student-env` - Student Working Container
- `instructor-server` - Backend for course staff dashboard, analytics

## Links

- Trello - <https://trello.com/b/HU2vVJx2/project-tasks>
- Drive - <https://drive.google.com/drive/folders/1IOdbpZZFkTWpxn6nbv3MexI9z9uzhqQF>
- Lucidchart - <https://lucid.app/lucidchart/3e2d8069-f729-4c23-8d20-7d3a1a409f48/edit?from_internal=true>

## Techonologies

- Frontent - React
- Frontend UI Library - Material UI?
- Backend - Auth Service - FastAPI
- Backend - Student Server - Nodejs express
- Backend for student/ instructor dashboard - Seperate or included in auth - FastAPI/Express?
  - Seperate Prefered, single service to manage both dashboards
- Managing Student container - kubernetes
- Deploying - Firebase ?
