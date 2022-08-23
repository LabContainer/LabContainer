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
import { ExtendedError } from 'socket.io/dist/namespace'
import timer from 'long-timeout'
import { setTokenSourceMapRange } from 'typescript'

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

async function connectToEnvironment(env: Environment, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>) {
  console.log(`Starting Secure shell to ${env.host}`)
  let ssh = new SSHClient();

  ssh.on("ready", () => {
    socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
    ssh.shell((err, stream) => {
      if (err) {
        socket.emit(
          "data",
          "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n");
        socket.disconnect(true)
      }
      // write user input to shell
      socket.on("data", data => {
        data.replace('\0', '')
        stream.write(data);
      })
      socket.on("disconnect", () => {
        socket.emit("d")
        console.log("Closing ssh")
        ssh.end()
      })
      stream
        //@ts-ignore
        .on("data", d => socket.emit("data", utf8.decode(d.toString("binary"))))
        .on("close", ssh.end);
    });
  }).on("close", function () {
    socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
    socket.disconnect()
  }).on("error", function (err) {
    console.log(err);
    socket.emit(
      "data",
      "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
    );
    socket.disconnect()
  }).connect({
    // host: env.ip_port.split(':')[0],
    // port: parseInt(env.ip_port.split(':')[1]),
    host: env.host,
    username: env.ssh_user,
    password: env.ssh_password
  });
}

type SocketIOMiddleware = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>, next: (err?: ExtendedError | undefined) => any) => void

const authenticateUser: SocketIOMiddleware = (socket, next) => {
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
}

const checkTokenExpiry: SocketIOMiddleware = (socket, next) => {
  const decoded = socket.data.decoded // Assuming the decoded user is save on socket.user

  if (!decoded?.exp) {
    return next()
  }

  const expiresIn = (decoded.exp - Date.now() / 1000) * 1000
  console.log("Setting expry:", expiresIn)
  const timeout = timer.setTimeout(() => {
    socket.disconnect(true)
    console.log("Disconnecting socket")
  }, expiresIn)

  socket.on('disconnect', () => timer.clearTimeout(timeout))

  return next()
}

//Socket Connection
io
  .use(authenticateUser)
  .use(checkTokenExpiry)
  .on("connection", async function (socket) {
    socket.emit('connected', "Connected!");

    const analyitcs_service_api = 'http://analytics:8000'
    const decoded = socket.data.decoded as jwt.JwtPayload
    // const token = socket.handshake.query.token as string

    const env = await requestUserEnvironment(analyitcs_service_api, socket.handshake.query.team as string, decoded.user)

    if (env) {
      connectToEnvironment(env, socket)
    }
    else {
      console.log("No env found , deleting socket")
      socket.disconnect(true)
    }
  });

