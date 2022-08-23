FROM node:16

WORKDIR /app

RUN npm i -g typescript

COPY package*.json ./
RUN npm ci

COPY . .

RUN tsc
EXPOSE 8080
RUN npm i -g nodemon

CMD [ "nodemon" , "dist/server.js"]  