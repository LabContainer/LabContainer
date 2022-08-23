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
  timeout: timer.Timeout
  ssh?: SSHClient
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

console.log('Waiting for Connections....')

// Store active user team envs here, allow only one per user - team
// if multiple student servers, change to do redis locks
var active_users: {
  user: string, team: string
}[] = []

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
      if (socket.disconnected) {
        console.log("Disconnected socket received")
        ssh.end()
      }
      socket.data.ssh = ssh
      // write user input to shell
      socket.on("data", data => {
        data.replace('\0', '')
        stream.write(data);
      })

      stream
        //@ts-ignore
        .on("data", d => {
          const s = utf8.decode(d.toString("binary"))
          socket.emit("data", s)
        })
        .on("close", () => {
          console.log("Stream Closed!")
          socket.disconnect(true)

          ssh.end()
        });
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

const NO_ADDITIONAL_SESSIONS = 'no_additional'
const NO_USER_TEAMS = 'no_user_team'
const NO_TOKEN = 'no_token'
const INVALID_TOKEN = 'invalid_token'

const authenticateUser: SocketIOMiddleware = (socket, next) => {
  // Authenticate User
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token as string, process.env.SECRET_TOKEN as string, function (err, decoded) {
      if (err)
        return next(new Error(INVALID_TOKEN));
      socket.data.decoded = decoded as jwt.JwtPayload;
      console.log('Connected to user: ', decoded)
      next();
    });
  } else {
    next(new Error(NO_TOKEN))
  }
}

const checkTokenExpiry: SocketIOMiddleware = (socket, next) => {
  const decoded = socket.data.decoded as jwt.JwtPayload// Assuming the decoded user is save on socket.user

  if (!decoded?.exp) {
    next()
  }

  const expiresIn = (decoded.exp as number - Date.now() / 1000) * 1000
  console.log("Setting expry:", expiresIn)
  socket.data.timeout = timer.setTimeout(() => {
    socket.disconnect(false)
    console.log("Disconnecting socket")
  }, expiresIn)
  next()
}

const arrayContainsObject = (array: any[], object: any) => {
  return array.some(item => Object.keys(item).every(key => item[key] === object[key]))
}



const checkMultipleSesions: SocketIOMiddleware = (socket, next) => {
  const team = socket.handshake.query.team as string
  const user = socket.data.decoded?.user as string
  console.log("Checking Session", active_users)
  if (team && user) {
    if (!arrayContainsObject(active_users, { user, team })) {
      active_users.push({ user, team })
      console.log("Session Added", { user, team })
      next()
    } else next(new Error(NO_ADDITIONAL_SESSIONS))
  } else next(new Error(NO_USER_TEAMS))
}

//Socket Connection
io
  .use(authenticateUser)
  .use(checkTokenExpiry)
  .use(checkMultipleSesions)
  .on("connection", function (socket) {
    socket.emit('connected', "Connected!");

    const analyitcs_service_api = 'http://analytics:8000'
    const decoded = socket.data.decoded as jwt.JwtPayload
    // const token = socket.handshake.query.token as string
    socket.on("disconnect", () => {
      console.log("Closing ssh")
      socket.emit("d")
      socket.data.ssh?.end()
      const ateam = socket.handshake.query.team
      const auser = socket.data.decoded?.user
      console.log("Removing", { auser, ateam })
      active_users = active_users.filter(({ user, team }) =>
        !(team === ateam &&
          user === auser)
      );
      console.log("Removing", active_users)
      if (socket.data.timeout)
        timer.clearTimeout(socket.data.timeout)
    })

    requestUserEnvironment(analyitcs_service_api, socket.handshake.query.team as string, decoded.user).then(env => {
      if (env) {
        connectToEnvironment(env, socket)
      }
      else {
        console.log("No env found , deleting socket")
        socket.disconnect(true)
      }
    })
  });

