#!/bin/bash

# Script to demo app

# Start up student-server
cd student-server 
npm i
npm start &
cd ..

# Start up Auth service
cd auth
export PYTHONPATH=$PWD
pip install -r requirements.txt
cd ..
uvicorn auth.main:app --reload --port 5000 &

# start client
cd client
npm i
npm start &