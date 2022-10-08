import { Server } from "socket.io";
import http from "http";
import timer from "long-timeout";
import jwt from 'jsonwebtoken';

import {
    authenticateUser,
    checkTokenExpiry,
    checkMultipleSesions,
} from "./middleware.js";
import { ServerType, Environment, activeList, SocketType, SocketIOMiddleware } from ".";
import TerminalService from "./TerminalService.js";


export default class SocketService {
    active_users: activeList;
    terminal: TerminalService | null;

    constructor() {
        this.active_users = [];
        this.terminal = null;
    }

    attach(server: http.Server) {
        //socket.io instantiation
        const io: ServerType = new Server(server, { cors: { origin: "*" } });
        console.log("Waiting for Connections....");
        const addActiveList: SocketIOMiddleware = (socket, next) => {

            console.log("Authenticating User0")
            socket.data.active_users = this.active_users;
            next();
        }
        io
            .use(addActiveList)
            .use(authenticateUser)
            .use(checkTokenExpiry)
            .use(checkMultipleSesions)
            .on("connection", (socket: SocketType) => {
                socket.emit("connected", "Connected!");

                const decoded = socket.data.decoded as jwt.JwtPayload;
                // const token = socket.handshake.query.token as string
                socket.on("disconnect", () => {
                    const ateam = socket.handshake.query.team;
                    const auser = socket.data.decoded?.user;
                    this.active_users = this.active_users.filter(
                        ({ user, team }) => !(team === ateam && user === auser)
                    );
                    if (socket.data.timeout)
                        timer.clearTimeout(socket.data.timeout);
                });

                // Connect to node-pty
                this.terminal = new TerminalService(socket);
                // ready
                socket.on("data", (data: string) => {
                    this.terminal?.write(data)
                });
            });
    }
}
