import { Box, Stack } from "@mui/material";
import React from "react";
import { Suspense } from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";

import "./Environment.css";
import "../../components/Editor/Editor.css";

import Editor from "../../components/Editor/Editor";
import { useParams } from "react-router-dom";
import FileExplorer from "../../components/FileExplorer/FileExplorer";
import { AnalyticsServiceAPI } from "../../constants";
import { AuthContext } from "../../components/App/AuthContext";

const Term = React.lazy(async () => {
  return import("../../components/Terminal/Terminal");
});

// server status enum
enum ServerStatus {
  Available,
  Unavailable,
}

// const sleep = (ms:  number) => new Promise( resolve => setTimeout(resolve, ms))
export default function Environment() {
  const { user, team } = useParams();
  const { token } = React.useContext(AuthContext);
  const [server, setServer] = React.useState("");
  const [loadFile, setLoadFile] = React.useState({
    name: "",
    id: "",
  });
  const [serverStatus, setServerStatus] = React.useState(
    ServerStatus.Unavailable
  );
  const [childKey, setChildKey] = React.useState(1);
  //Fetch Server
  React.useEffect(() => {
    fetch(AnalyticsServiceAPI + `/environment/${team}/${user}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((r) => r.json())
      .then((env) => {
        console.log("Received Environment from analytics service: ", env);
        setServer(`http://localhost:${env?.port}`);
      });
  }, [setServer, team, user, token]);
  React.useEffect(() => {
    if (serverStatus === ServerStatus.Available) {
      setChildKey((prev: number) => prev + 1);
    }
    // window.location.reload();
  }, [serverStatus]);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (server) {
        // fetch /health endpoint
        fetch(server + "/health", {
          method: "GET",
        }).then((r) => {
          if (r.status === 200) {
            setServerStatus(ServerStatus.Available);
          } else {
            setServerStatus(ServerStatus.Unavailable);
          }
        });
      }
    }, 2000);

    return () => {
      // cleanup
      clearTimeout(timer);
    };
  }, [server]);
  return (
    <>
      {team && user ? (
        <>
          <Stack direction="row" sx={{ height: "100%" }}>
            <Box flex={1} sx={{ display: "flex" }}>
              <FileExplorer
                server={server}
                addToDoubleQuickQueue={setLoadFile}
                key={childKey}
              />
            </Box>
            <Stack
              flex={3}
              sx={{
                margin: "auto",
                padding: 0,
                // width: "80%",
                height: "100%",
                justifyContent: "center",
                // marginTop: "80px",
                // marginBottom: "80px",
                display: "flex",
              }}
              direction="column"
              justifyContent={"center"}
            >
              {serverStatus === ServerStatus.Unavailable ? (
                <div className="editor-container">
                  {/* center div */}
                  <div
                    style={{
                      position: "relative",
                      top: "50%",
                      // left: "50%",
                      textAlign: "center",
                    }}
                  >
                    <h2>Loading Environment, please wait...</h2>
                    <div
                      style={{
                        position: "relative",
                        left: "50%",
                      }}
                    >
                      <CircularIndeterminate />
                    </div>
                  </div>
                </div>
              ) : (
                <Editor
                  team={team}
                  user={user}
                  loadFile={loadFile}
                  server={server}
                ></Editor>
              )}
              <Stack flex={1}>
                <Suspense fallback={<CircularIndeterminate />}>
                  <Term team={team} user={user} server={server} />
                </Suspense>
              </Stack>
            </Stack>
          </Stack>
        </>
      ) : null}
    </>
  );
}
