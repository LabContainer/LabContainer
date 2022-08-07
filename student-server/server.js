const express = require("express");
const fs = require("fs");
const http = require("http");
let SSHClient = require("ssh2").Client;
let utf8 = require("utf8");
const app = express();

let serverPort = 8080;
let server = http.createServer(app);
let cors = require('cors');
app.use(cors());

server.listen(serverPort);

//socket.io instantiation
const io = require("socket.io")(server, { cors: { origin : "*"}});

//Socket Connection
io.on("connection", function(socket) {
    let connected = true;

    socket.emit('connected', "Connected!");

    let ssh = new SSHClient();
    ssh.on("ready", () => {
        socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
        connected = true;
        ssh.shell(function(err, stream) {
            if (err)
                return socket.emit(
                    "data",
                    "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
                );
            // write user input to shell
            socket.on("data", function(data) {
                data.replace('\0', '')
                stream.write(data);
            });
            stream.on("data", function(d) {
                socket.emit("data", utf8.decode(d.toString("binary")));
            }).on("close", function() {
                ssh.end();
            });
        });
    })
    .on("close", function() {
      socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
    })
    .on("error", function(err) {
      console.log(err);
      socket.emit(
        "data",
        "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
      );
    })
    .connect({
      host: "127.0.0.1",
      port: "10022", // Generally 22 but some server have diffrent port for security Reson
      username: "test", // user name
      password: "test" // Set password or use PrivateKey
      // privateKey: require("fs").readFileSync("PATH OF KEY ") // <---- Uncomment this if you want to use privateKey ( Example : AWS )
    });
});