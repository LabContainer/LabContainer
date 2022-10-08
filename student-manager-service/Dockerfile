FROM node:16

RUN apt update

ARG ssh_user=test
ARG ssh_pass=test
RUN useradd -rm -d /home/ubuntu -s /bin/bash -g root -G sudo -u 1001 ${ssh_user} 
RUN  echo $ssh_user:$ssh_pass | chpasswd

SHELL ["/bin/bash", "-c"] 

WORKDIR /app

RUN npm i -g typescript@4.4.3
RUN npm i -g nodemon

COPY package*.json ./
RUN npm ci

COPY . .
# COPY .env .
RUN tsc

USER ${ssh_user}

# CMD [ "nodemon" , "dist/server.js"]  
CMD [ "node" , "dist/server.js"]  