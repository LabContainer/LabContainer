FROM node:16

WORKDIR /app

RUN npm i -g typescript

COPY package*.json ./
RUN npm ci

COPY . .

RUN tsc
EXPOSE 8080

CMD [ "node" , "dist/server.js"]  