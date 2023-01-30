// Import XTerm
import { XTerm } from "xterm-for-react";
import { io, Socket } from "socket.io-client";
import { useContext, useEffect, useRef, useState } from "react";
import { FitAddon } from "xterm-addon-fit";
import { Chip, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import "./Terminal.css";
import { AuthContext } from "../App/AuthContext";
import { Pending } from "@mui/icons-material";
import { Container } from "@mui/system";
import useRefresh from "../App/useRefresh";

enum EnvStatus {
  disconnected,
  connected,
  connecting,
}
const NO_ADDITIONAL_SESSIONS = "no_additional";
const NO_USER_TEAMS = "no_user_team";
// const NO_TOKEN = "no_token";
const INVALID_TOKEN = "invalid_token";

function Term({
  team,
  user,
  server,
}: {
  team: string;
  user: string;
  server: string;
}) {
  const { token } = useContext(AuthContext);
  const xtermRef = useRef<XTerm>(null);
  const socketRef = useRef<Socket>();
  const commandRef = useRef<string>("");
  const [status, setStatus] = useState(EnvStatus.disconnected);
  const [refresh, toggleRefresh] = useState(false);
  useRefresh(refresh);
  // Connect to remote container via ssh
  useEffect(() => {
    const onConnect = () => {
      console.log("Connected");
      xtermRef.current?.terminal.writeln("Backend Connected!");
      setStatus(EnvStatus.connected);
    };

    const onDisconnect = () => {
      xtermRef.current?.terminal.writeln("***Disconnected from backend***");
      setStatus(EnvStatus.disconnected);
    };
    const onConnectError = async (err: Error) => {
      setStatus(EnvStatus.disconnected);
      console.log("Error connecting to backend");
      if (err.message === INVALID_TOKEN) {
        toggleRefresh(!refresh);
      } else if (err.message === NO_ADDITIONAL_SESSIONS)
        xtermRef.current?.terminal.writeln("***Connection limit reached***");
      else {
        setStatus(EnvStatus.connecting);
        console.error(err.message);
      }
    };
    const onError = (err: string) => {
      if (err === NO_USER_TEAMS) {
        socketRef.current?.off("disconnect");
        xtermRef.current?.terminal.writeln("***Invalid Team***");
      }
      setStatus(EnvStatus.disconnected);
    };
    const onData = (msg: string) => {
      // setData(msg);
      xtermRef.current?.terminal.write(msg);
    };
    // Initial load
    setStatus(EnvStatus.disconnected);
    console.log("Trying ", server);
    // get domain a https://api.labcontainer.io from server url

    const base_server = server.split("/").slice(0, 3).join("/");
    const path = server.split("/").slice(3).join("/");
    console.log(base_server);
    console.log(path);
    socketRef.current = io(base_server, {
      query: {
        token,
        team,
      },
      // resolve path, no double slash incase of localhost
      path:
        (!path.startsWith("/") && path !== "" ? "/" : "") + path + "/socket.io",
      // rejectUnauthorized: false,
      // server.includes("localhost")
      //   ? "/socket.io"
      //   : server.split(".dev")[1] + "/socket.io",
      // transports: ["websocket"],
    }) as unknown as Socket;
    setStatus(EnvStatus.connecting);
    console.log(token);

    let fitaddon = new FitAddon();
    xtermRef.current?.terminal.loadAddon(fitaddon);
    xtermRef.current?.terminal.onResize((size) => {
      socketRef.current?.emit("resize", size);
    });
    fitaddon.fit();

    // start observing a DOM node
    const terminal_container = document.querySelector(".terminal-container");
    if (terminal_container) {
      const resizeObserver = new ResizeObserver((entries) => {
        fitaddon.fit();
        console.log("Resized");
      });
      resizeObserver.observe(terminal_container);
    }

    // Allow copy and paste in terminal
    xtermRef.current?.terminal.attachCustomKeyEventHandler(
      (event: KeyboardEvent) => {
        if (event.repeat) return true;
        if (event.ctrlKey) {
          if (event.key === "c") {
            const text = xtermRef.current?.terminal.getSelection();
            if (text) navigator.clipboard.writeText(text);
          }
          if (event.key === "v") {
            navigator.clipboard.readText().then((text) => {
              if (text) {
                commandRef.current = commandRef.current.concat(text);
                xtermRef.current?.terminal.write(text);
                navigator.clipboard.writeText("");
              }
            });
          }
        }
        return true;
      }
    );

    socketRef?.current?.on("connect", onConnect);
    socketRef?.current?.on("data", onData);
    socketRef?.current?.on("error", onError);
    socketRef?.current?.on("disconnect", onDisconnect);
    socketRef?.current?.on("connect_error", onConnectError);
    socketRef?.current?.on("expired", () => {
      toggleRefresh(!refresh);
    });
    return () => {
      socketRef.current?.off("disconnect");
      socketRef.current?.disconnect();
    };
  }, [team, server, token]);

  return (
    <Stack sx={{ height: "100%", width: "100%" }} flex={1}>
      <Stack sx={{ width: "100%" }} direction="row" spacing={1}>
        <Container
          maxWidth={false}
          sx={{
            backgroundColor: "white",
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            borderLeft: "1px solid",
            padding: "7px",
            width: "100%",
          }}
        >
          <Typography sx={{ width: "fit-content", paddingRight: "10px" }}>
            Remote Environment Status :
          </Typography>
          {/* <Box> */}
          {status === EnvStatus.connected ? (
            <Chip
              label="Connected!"
              color="success"
              onDelete={() => {}}
              deleteIcon={<DoneIcon />}
            />
          ) : null}
          {status === EnvStatus.disconnected ? (
            <Chip
              label="Disconnected!"
              color="error"
              onDelete={() => {}}
              deleteIcon={<CloseIcon />}
            />
          ) : null}
          {status === EnvStatus.connecting ? (
            <Chip
              label="Connecting..."
              color="warning"
              onDelete={() => {}}
              deleteIcon={<Pending />}
            />
          ) : null}
          {/* </Box> */}
        </Container>
      </Stack>
      <XTerm
        className="terminal-container"
        ref={xtermRef}
        // onKey={()=>{}}
        onData={(data) => {
          socketRef.current?.emit("data", data);
        }}
        options={{
          theme: {
            background: "#151942",
            foreground: "#FFF",
          },
          fontSize: 15,
          rendererType: "dom",
          fontFamily: `'Fira Mono', monospace`,
          convertEol: true,
        }}
      />
    </Stack>
  );
}

export default Term;
