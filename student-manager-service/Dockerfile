FROM node:16

RUN apt update

ARG user=ubuntu
ARG init_script="echo Test Script"

RUN useradd -rm -d /home/ubuntu -s /bin/bash -g root -G sudo -u 1001 ${user} 
RUN  echo $user:toor | chpasswd

SHELL ["/bin/bash", "-c"] 

WORKDIR /app

RUN npm i -g typescript@4.4.3
RUN npm i -g nodemon

COPY package*.json ./
RUN npm ci

COPY . .
# COPY .env .
RUN tsc

RUN ${init_script}

USER ${user}

# CMD [ "nodemon" , "dist/server.js"]  
CMD [ "node" , "dist/server.js"]  