#!/bin/sh
# sleep 3h
export NAME=$(curl -X GET http://metadata.google.internal/computeMetadata/v1/instance/name -H 'Metadata-Flavor: Google')
export ZONE=$(curl -X GET http://metadata.google.internal/computeMetadata/v1/instance/zone -H 'Metadata-Flavor: Google')
# gcloud --quiet compute instances stop $NAME --zone=$ZONE

# get latest code
cd ~/LabContainer
git pull

# start container
sudo docker compose -f production.yml up
