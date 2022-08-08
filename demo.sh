#!/bin/bash

# Script to demo app

# Start up student-server
cd student-server 
npm i
node . &

# Start dev container
cd ../student-env
docker-compose up dev &

# Start up Auth service
cd ../auth
export PYTHONPATH=$PWD
pip install -r requirements.txt
uvicorn main:app --reload --port 5000 &

# start client
cd ../client
npm i
npm start &