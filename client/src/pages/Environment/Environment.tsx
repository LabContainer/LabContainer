import { Box, Stack } from "@mui/material";
import React from "react";
import { Suspense } from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";

import "./Environment.css";
import "../../components/Editor/Editor.css";

import Editor from "../../components/Editor/Editor";
import { useParams } from "react-router-dom";
import FileExplorer from "../../components/FileExplorer/FileExplorer";
import ResizablePane from "../../components/ResizablePane/ResizablePane";
import { AnalyticsServiceAPI } from "../../constants";
import { AuthContext } from "../../components/App/AuthContext";
import Term from "../../components/Terminal/Terminal";

// const Term = React.lazy(async () => {
//   return import("../../components/Terminal/Terminal");
// });

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

  // States for resizing
  const [leftPaneWidth, setLeftPaneWidth] = React.useState(300);
  const [rightPaneWidth, setRightPaneWidth] = React.useState(300);

  // false ui if invalid team or user
  if (!team || !user) {
    return (
      <div
        style={{
          position: "relative",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1>Invalid Team or User</h1>
      </div>
    );
  }

  return (
    <div
      className="environment-container"
      style={{
        height: "100%",
      }}
    >
      <div
        className="sidebar"
        style={{
          width: leftPaneWidth,
        }}
      ></div>
      <div
        className="sidebar"
        style={{
          width: rightPaneWidth,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      ></div>
      {/* <FileExplorer
            server={server{team && user ? (}
            addToDoubleQuickQueue={setLoadFile}
            key={childKey}
          /> */}

      {
        // serverStatus === ServerStatus.Unavailable ? (
        //   <div className="editor-container">
        //     {/* center div */}
        //     <div
        //       style={{
        //         position: "relative",
        //         top: "50%",
        //         // left: "50%",
        //         textAlign: "center",
        //       }}
        //     >
        //       <h2>Loading Environment, please wait...</h2>
        //       <div
        //         style={{
        //           position: "relative",
        //           left: "50%",
        //         }}
        //       >
        //         <CircularIndeterminate />
        //       </div>
        //     </div>
        //   </div>
        // ) : (
        //   <Editor
        //     team={team}
        //     user={user}
        //     loadFile={loadFile}
        //     server={server}
        //   ></Editor>
        // )
      }

      {/* <Term team={team} user={user} server={server} /> */}

      {/* <div
        style={{
          height: "100%",
          backgroundColor: "yellow",
        }}
      ></div> */}
    </div>
  );
}
