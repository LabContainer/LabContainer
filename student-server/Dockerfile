FROM node:16

WORKDIR /app

RUN npm i -g typescript
RUN npm i -g nodemon

COPY package*.json ./
RUN npm ci

COPY . .

RUN tsc
EXPOSE 8080

CMD [ "nodemon" , "dist/server.js"]  