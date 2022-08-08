import express from 'express';
import http from 'http';
import { Client as SSHClient } from 'ssh2';
import utf8 from 'utf8';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import fetch from 'node-fetch';
const app = express();
config({
    path: '../.env'
});
let serverPort = 8080;
let server = http.createServer(app);
app.use(cors());
server.listen(serverPort);
//socket.io instantiation
const io = new Server(server, { cors: { origin: "*" } });
console.log('Waiting for Connections...');
//Socket Connection
io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.SECRET_TOKEN, function (err, decoded) {
            if (err)
                return next(new Error('Authentication error'));
            //@ts-ignore
            socket.decoded = decoded;
            console.log('Connected to user: ', decoded);
            next();
        });
    }
    else {
        next(new Error('Authentication Error'));
    }
}).on("connection", async function (socket) {
    let connected = true;
    socket.emit('connected', "Connected!");
    const auth_service_api = 'http://localhost:5000';
    //@ts-ignore
    const decoded = socket.decoded;
    console.log('Requesting Auth Service for Environment...');
    const resp = await fetch(`${auth_service_api}/getenv?username=${decoded.user}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${socket.handshake.query.token}`
        }
    });
    const env = await resp.json();
    console.log('Received Environment from auth service: ', env);
    let ssh = new SSHClient();
    ssh.on("ready", () => {
        socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
        connected = true;
        ssh.shell(function (err, stream) {
            if (err)
                return socket.emit("data", "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n");
            // write user input to shell
            socket.on("data", function (data) {
                data.replace('\0', '');
                stream.write(data);
            });
            stream.on("data", function (d) {
                socket.emit("data", utf8.decode(d.toString("binary")));
            }).on("close", function () {
                ssh.end();
            });
        });
    })
        .on("close", function () {
        socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
    })
        .on("error", function (err) {
        console.log(err);
        socket.emit("data", "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n");
    })
        .connect({
        host: "127.0.0.1",
        port: 15000,
        username: "test",
        password: "test" // Set password or use PrivateKey
        // privateKey: require("fs").readFileSync("PATH OF KEY ") // <---- Uncomment this if you want to use privateKey ( Example : AWS )
    });
});
