import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { ExtendedError } from 'socket.io/dist/namespace'
import timer from 'long-timeout'
import { SocketIOMiddleware } from '.'
import { config } from 'dotenv'
import { INVALID_TOKEN, NO_ADDITIONAL_SESSIONS, NO_TOKEN, NO_USER_TEAMS } from './constants.js'


// Store active user team envs here, allow only one per user - team
// if multiple student servers, change to do redis locks
config({
    path: '.env'
})


const arrayContainsObject = (array: any[], object: any) => {
    return array.some(item => Object.keys(item).every(key => item[key] === object[key]))
}

// Middleware to check is user is already connected to a server
export const checkMultipleSesions: SocketIOMiddleware = (socket, next) => {
    const team = socket.handshake.query.team as string
    const user = socket.data.decoded?.user as string
    if (!socket.data.active_users) {
        next(new Error('Active users not set'))
        return;
    }
    console.log("Checking Session", socket.data.active_users)
    if (team && user) {
        if (!arrayContainsObject(socket.data.active_users, { user, team })) {
            socket.data.active_users.push({ user, team })
            console.log("Session Added", { user, team })
            next()
            return;
        }
        console.log("Session Already Exists", { user, team });
        next(new Error(NO_ADDITIONAL_SESSIONS));
        return;
    }
    console.log("Session Not Added", { user, team });
    next(new Error(NO_USER_TEAMS));
    return;
}

// Middleware to check if the user has a valid token
export const authenticateUser = (valid_user: string): SocketIOMiddleware => (socket, next) => {
    // Authenticate User
    if (socket.handshake.query && socket.handshake.query.token) {
        try {
            const decoded = jwt.verify(socket.handshake.query.token as string, process.env.SECRET_TOKEN as string) as jwt.JwtPayload;
            socket.data.decoded = decoded;
            console.log('Connected to user: ', decoded)
            // check user
            if (decoded.user !== valid_user) {
                next(new Error('Invalid User'))
                return;
            }
            next();
            return;
        } catch (err) {
            next(new Error(INVALID_TOKEN));
            return;
        }
    }
    next(new Error(NO_TOKEN))
    return;
}

// Middleware to check if token is expired
export const checkTokenExpiry: SocketIOMiddleware = (socket, next) => {
    const decoded = socket.data.decoded as jwt.JwtPayload// Assuming the decoded user is save on socket.user

    if (!decoded?.exp) {
        next()
    }
    const expiresIn = (decoded.exp as number - Date.now() / 1000) * 1000
    console.log("Setting expry:", expiresIn)
    socket.data.timeout = timer.setTimeout(() => {
        socket.emit('expired', 'Token Expired')
        socket.disconnect(false)
        console.log("Disconnecting socket")
    }, expiresIn);

    next()
}

// Create Middleware for filemanager authentiation (http express middleware)
export const fileManagerAuth = (valid_user: string) => (req: any, res: any, next: any) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            console.log("File Manager Auth", token)
            const decoded = jwt.verify(token, process.env.SECRET_TOKEN as string) as jwt.JwtPayload
            console.log(decoded)
            if (decoded) {
                const user = decoded["user"] as string
                if (user === valid_user) {
                    next()
                    return;
                }
            }
        } catch (err) {
            console.log("File Manager Auth Error", err)
            res.status(401).send('Unauthorized')
            return;
        }
    }
    console.log("File Manager Auth Error", req.headers)
    res.status(401).send('Unauthorized')
    return;
}