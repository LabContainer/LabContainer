import express, { response } from 'express'
import fs from 'fs'
import http from 'http'
import { Client as SSHClient } from 'ssh2'
import utf8 from 'utf8'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import fetch from 'node-fetch'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

const app = express();
config({
  path: '../.env'
})

let serverPort = 8080;
let serverHost = '0.0.0.0';
let server = http.createServer(app);
app.use(cors({
  origin: ["http://localhost:3000", "https://codecapture.web.app"]
}));

server.listen(serverPort, serverHost);

interface SocketData {
  decoded: jwt.JwtPayload
}

interface Environment {
  host: string
  network: string
  id: string
  ssh_user: string
  ssh_password: string
}

//socket.io instantiation
const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(server, { cors: { origin: "*" } });

console.log('Waiting for Connections...')

async function requestUserEnvironment(api_url: string, token: string, username: string) {
  console.log('Requesting Auth Service for Environment...')
  const resp = await fetch(`${api_url}/getenv?username=${username}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const env: any = await resp.json()
  console.log('Received Environment from auth service: ', env)
  return env
}

async function connectToEnvironment(env: Environment, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>) {
  console.log(`Starting Secure shell to ${env.host}`)
  let ssh = new SSHClient();
  ssh.on("ready", () => {
    socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
    ssh.shell(function (err, stream) {
      if (err)
        return socket.emit(
          "data",
          "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
        );
      // write user input to shell
      socket.on("data", function (data) {
        data.replace('\0', '')
        stream.write(data);
      });
      stream.on("data", function (d: any) {
        socket.emit("data", utf8.decode(d.toString("binary")));
      }).on("close", function () {
        ssh.end();
      });
    });
  }).on("close", function () {
    socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
  }).on("error", function (err) {
    console.log(err);
    socket.emit(
      "data",
      "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
    );
  }).connect({
    // host: env.ip_port.split(':')[0],
    // port: parseInt(env.ip_port.split(':')[1]),
    host: env.host,
    username: env.ssh_user,
    password: env.ssh_password
  });
}

//Socket Connection
io.use((socket, next) => {
  // Authenticate User
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token as string, process.env.SECRET_TOKEN as string, function (err, decoded) {
      if (err)
        return next(new Error('Authentication error'));
      socket.data.decoded = decoded as jwt.JwtPayload;
      console.log('Connected to user: ', decoded)
      next();
    });
  } else {
    next(new Error('Authentication Error'))
  }
}).on("connection", async function (socket) {
  socket.emit('connected', "Connected!");

  const auth_service_api = 'http://auth:5000'
  const decoded = socket.data.decoded as jwt.JwtPayload
  const token = socket.handshake.query.token as string

  const env = await requestUserEnvironment(auth_service_api, token, decoded.user)

  if (env !== null) {
    connectToEnvironment(env, socket)
  }
});

