declare module '@opuscapita/filemanager-server';
export type activeList = {
    user: string;
    team: string;
}[];

export interface SocketData {
    decoded: jwt.JwtPayload
    timeout: timer.Timeout
    active_users: activeList
}

export interface Environment {
    host: string
    network: string
    id: string
    ssh_user: string
    ssh_password: string
}
import { Socket } from "socket.io";
type SocketIOMiddleware = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>, next: (err?: ExtendedError | undefined) => any) => void

export type ServerType = Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    SocketData
>;
export type SocketType = Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    SocketData
>;
