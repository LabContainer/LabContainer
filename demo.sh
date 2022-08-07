#!/bin/bash

# Script to demo app

# Start up server
cd student-server 
npm i
node . &

# Start dev container
cd ../student-env
docker-compose up dev &

# start client
cd ../client
npm i
npm start