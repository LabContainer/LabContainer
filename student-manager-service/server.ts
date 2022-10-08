import express, { response } from 'express'
import fs from 'fs'
import http from 'http'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import SocketService from './SocketService.js'

//@ts-ignore
import pkg from '@opuscapita/filemanager-server';
const { middleware } = pkg;

let fileManagerConfig = {
    fsRoot: '/',
    rootName: 'Root folder'
};

const app = express();

config({
    path: '.env'
})

let serverPort = 8090;
let server = http.createServer(app);
app.use(cors({
    origin: "*" //["http://localhost:3000", "https://codecapture.web.app"]
}));
app.use('/filemanager/', middleware(fileManagerConfig));

server.listen(serverPort, '0.0.0.0', () => {
    const socketservice = new SocketService();
    socketservice.attach(server);
});









//Socket Connection




async function requestUserEnvironment(api_url: string, team: string, username: string) {
    console.log('Requesting Analytics Service for Environment...')
    const token = jwt.sign({
        user: username,
        internal: "StudentService"
    }, process.env.SECRET_TOKEN as string, {
        expiresIn: '10s'
    })
    const resp = await fetch(`${api_url}/environment/${team}/${username}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (resp.ok) {
        const env: any = await resp.json()
        console.log('Received Environment from analytics service: ', env)
        return env
    } else {
        console.error(await resp.text())
    }
    return undefined
}