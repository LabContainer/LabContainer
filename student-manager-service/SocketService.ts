import { Server } from "socket.io";
import http from "http";
import timer from "long-timeout";
import jwt from 'jsonwebtoken';
import { AnalyticsService } from "./AnalyticsClient/AnalyticsService.js";
import util from 'util';
import { exec as exec_callback } from "child_process";
const exec = util.promisify(exec_callback);


import {
    authenticateUser,
    checkTokenExpiry,
    checkMultipleSesions,
} from "./middleware.js";
import { ServerType, Environment, activeList, SocketType, SocketIOMiddleware } from ".";
import TerminalService from "./TerminalService.js";
import { AnalyticsServiceAPI } from "./constants.js";


export default class SocketService {
    active_users: activeList;
    terminal: TerminalService | null;
    valid_user: string;
    analytics: AnalyticsService;

    constructor(valid_user: string) {
        this.valid_user = valid_user;
        this.active_users = [];
        this.terminal = null;
        this.analytics = new AnalyticsService({
            BASE: 'http://analytics:8000',
        });
    }

    attach(server: http.Server) {
        //socket.io instantiation
        const container_name = process.env.CONTAINER_NAME as string;
        const environment = process.env.ENVIRONMENT as string
        let path = `/env/${container_name}/socket.io`;
        path = `/socket.io`;
        if (environment !== "production") {
            path = ""
        }
        console.log(path)
        const io: ServerType = new Server(server, {
            cors: { origin: "*" },
            path: path,
        });
        console.log("Waiting for Socket Connections....");
        const addActiveList: SocketIOMiddleware = (socket, next) => {
            socket.data.active_users = this.active_users;
            next();
        }

        io
            .use(addActiveList)
            .use(authenticateUser(this.valid_user))
            .use(checkTokenExpiry)
            .use(checkMultipleSesions)
            .on("connection", (socket: SocketType) => {
                // configure analytics service
                this.analytics = new AnalyticsService({
                    BASE: 'http://analytics:8000',
                    TOKEN: socket.handshake.query.token as string,
                })
                socket.emit("connected", "Connected!");

                socket.on("disconnect", () => {
                    const ateam = socket.handshake.query.team;
                    const auser = socket.data.decoded?.user;
                    // TODO need to check if user is authorized to access this container
                    // Correct team is stored, but no way to check is user is in that team
                    // would need to query analytics service here
                    this.active_users = this.active_users.filter(
                        ({ user, team }) => !(team === ateam && user === auser)
                    );
                    if (socket.data.timeout)
                        timer.clearTimeout(socket.data.timeout);
                });
                console.log("Connection Complete!");
                // Connect to node-pty
                this.terminal = new TerminalService(socket);
                // ready
                socket.on("data", (data: string) => {
                    this.terminal?.write(data)
                });
                // Resize properly
                socket.on("resize", (size: { cols: number, rows: number }) => {
                    this.terminal?.ptyProcess?.resize(size.cols, size.rows);
                });
                // Test event, run command
                socket.on("test", async (milestone_id: string) => {
                    // get milestone from analytics service
                    const milestone = await this.analytics.milestones.milestonesGetMilestone(milestone_id);
                    milestone.test_script = milestone.test_script.replace(/\\n/g, "\n");

                    // spawn new process and run test script
                    // get exit code from test script
                    try {
                        const { stdout, stderr } = await exec(milestone.test_script);
                        // send to client
                        socket.emit("data", "Test script ran successfully with exit code: 0 Output:");
                        socket.emit("data", stdout);
                        socket.emit("data", stderr);

                        // assume test script is successful
                        // send exit code client
                        socket.emit("pass", milestone_id, "0");

                    } catch (error: any) {
                        console.error(error);
                        // assume test script failed

                        // send to client
                        socket.emit("data", "Test script failed with exit code: " + error.code.toString() + " Output:");
                        socket.emit("data", error.stdout);
                        socket.emit("data", error.stderr);
                        // send exit code client
                        socket.emit("fail", milestone_id, error.code.toString());
                    }

                    // this.terminal?.write(milestone.test_script + "\r");
                });

                socket.on("disconnect", () => {
                    this.terminal?.ptyProcess?.kill();
                });
            });
    }
}