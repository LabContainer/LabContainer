// Import XTerm
import { XTerm } from "xterm-for-react";
import { io, Socket } from "socket.io-client";
import { useContext, useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { FitAddon } from "xterm-addon-fit";
import { Chip, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import "./Terminal.css";
import { AuthContext } from "../App/AuthContext";
import { Pending } from "@mui/icons-material";
import { Container } from "@mui/system";
import { refresh } from "../App/fetch";

enum EnvStatus {
  disconnected,
  connected,
  connecting,
}
const NO_ADDITIONAL_SESSIONS = "no_additional";
const NO_USER_TEAMS = "no_user_team";
// const NO_TOKEN = "no_token";
const INVALID_TOKEN = "invalid_token";

function Term({ team, user }: { team: string; user: string }) {
  // function onKey(event: { key: string; domEvent: KeyboardEvent }) {
  //   const { key, domEvent } = event;
  //   const code = key.charCodeAt(0);
  //   if (code === 127) {
  //     //Backspace
  //     if (commandRef.current.length > 0)
  //       xtermRef.current?.terminal.write("\b \b");
  //     commandRef.current = commandRef.current.slice(0, -1);
  //   } else if (code === 13) {
  //     for (let i = 0; i < commandRef.current.length; i++) {
  //       xtermRef.current?.terminal.write("\b \b");
  //     }
  //     commandRef.current = commandRef.current.concat("\n");
  //     socketRef.current?.emit("data", commandRef.current);
  //     commandRef.current = "";
  //   } else if (domEvent.key === "ArrowUp" || domEvent.key === "ArrowDown") {
  //     socketRef.current?.emit("data", key);
  //   } else if (domEvent.key === "ArrowLeft" || domEvent.key === "ArrowRight") {
  //     // pass
  //   } else {
  //     commandRef.current = commandRef.current.concat(key);
  //     xtermRef.current?.terminal.write(key);
  //   }
  // }
  const { token, refresh_token, setToken } = useContext(AuthContext);
  const [data, setData] = useImmer("");
  const xtermRef = useRef<XTerm>(null);
  const socketRef = useRef<Socket>();
  const commandRef = useRef<string>("");
  const [status, setStatus] = useState(EnvStatus.disconnected);

  // Connect to remote container via ssh
  useEffect(() => {
    const onConnect = () => {
      console.log("Connected");
      xtermRef.current?.terminal.writeln("Backend Connected!");
      setStatus(EnvStatus.connected);
    };

    const onDisconnect = () => {
      xtermRef.current?.terminal.writeln("***Disconnected from backend***");
      refresh(refresh_token, setToken);
      setStatus(EnvStatus.disconnected);
    };
    const onConnectError = (err: Error) => {
      if (err.message === INVALID_TOKEN) refresh(refresh_token, setToken);
      else if (err.message === NO_ADDITIONAL_SESSIONS)
        xtermRef.current?.terminal.writeln("***Connection limit reached***");
      else console.error(err.message);
      setStatus(EnvStatus.disconnected);
    };
    const onError = (err: string) => {
      if (err === NO_USER_TEAMS) {
        socketRef.current?.off("disconnect");
        xtermRef.current?.terminal.writeln("***Invalid Team***");
      }
      setStatus(EnvStatus.disconnected);
    };
    const onData = (msg: string) => {
      setData(msg);
    };
    // Initial load
    setStatus(EnvStatus.disconnected);
    const server_url = "http://localhost:8090";
    socketRef.current = io(server_url, {
      query: {
        token,
        team,
      },
    }) as unknown as Socket;
    setStatus(EnvStatus.connecting);

    let fitaddon = new FitAddon();
    xtermRef.current?.terminal.loadAddon(fitaddon);
    fitaddon.fit();

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
    return () => {
      socketRef.current?.off("disconnect");
      socketRef.current?.disconnect();
    };
  }, [token, team, setData, refresh_token, setToken]);

  useEffect(() => {
    xtermRef.current?.terminal.write(data);
  }, [data]);

  return (
    <Stack sx={{}} flex={1}>
      <Stack direction="row" spacing={1}>
        <Container
          sx={{
            backgroundColor: "white",
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            borderLeft: "1px solid",
            padding: "7px",
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
