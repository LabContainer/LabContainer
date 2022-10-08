
import os from 'os';
import pty from 'node-pty'
import { SocketType } from '.';

export default class TerminalService {
    shell: string
    ptyProcess: pty.IPty | null;
    socket: SocketType | null;

    // Initialize the terminal service
    constructor(socket: SocketType) {
        this.shell = "bash";
        this.ptyProcess = null;
        this.socket = socket;

        // Initialize PTY process.
        this.startPtyProcess();
    }

    // Start the PTY process
    startPtyProcess() {
        this.ptyProcess = pty.spawn(this.shell, [], {
            name: "xterm-color",
            cwd: process.env.HOME,
            env: Object.entries(process.env).reduce((obj: { [key: string]: string }, [ckey, cval]) => (cval ? { ...obj, [ckey]: cval } : obj), {}),
        });

        // Add a "data" event listener.
        this.ptyProcess.on("data", (data) => {
            this.sendToClient(data);
        });
    }

    write(data: string) {
        this.ptyProcess?.write(data);
    }

    sendToClient(data: string) {
        this.socket.emit("data", data);
    }
}