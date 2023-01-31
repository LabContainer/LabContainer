import express, { response } from 'express'
import fs from 'fs'
import http from 'http'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import SocketService from './SocketService.js'
import { fileManagerAuth } from './middleware.js'

import winston from 'winston'
import expressWinston from 'express-winston'
import os from 'os'
//@ts-ignore
import pkg from '@opuscapita/filemanager-server';
const { middleware } = pkg;

// Rootname used in frontend -- must be set to /
let fileManagerConfig = {
    fsRoot: '/',
    rootName: ''
};

// Get valid user for this container
const valid_user = os.userInfo().username

const app = express();

config({
    path: '.env'
})
app.disable('etag');
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        // winston.format.colorize(),
        // winston.format.prettyPrint(),
        winston.format.simple(),
    ),
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}", // optional: customize the default logging message. E.g. " {{req.method}} {{res.responseTime}}ms {{req.url}}"
    // expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
}));

let serverPort = 8090;
let server = http.createServer(app);
app.use(cors({
    origin: ["http://localhost:3000", "https://labcontainer.dev"]
}));

// authenticate requests before they are passed to filemanager
app.use('/filemanager/', fileManagerAuth(valid_user));

console.log("Starting File Manager Server ")

// use filemanager middleware
app.use('/filemanager/', middleware(fileManagerConfig));

// create health endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

server.listen(serverPort, '0.0.0.0', () => {
    const socketservice = new SocketService(valid_user);
    socketservice.attach(server);
});