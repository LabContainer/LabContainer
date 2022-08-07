#!/bin/bash

# Script to demo app

# Start up server
cd student-server 
npm i
node . &

# Start dev container
cd ../student-env
docker-compose up dev &

# start a client
cd ../student-client
npm i
npm start