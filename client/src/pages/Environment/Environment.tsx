import { Box, Stack } from "@mui/material";
import React from "react";
import { Suspense } from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";

import "./Environment.css";

import Editor from "../../components/Editor/Editor";
import { useParams } from "react-router-dom";
import FileManagerFront from "../../components/FileManager/FileManager";
import fetchData from "../../components/App/fetch";
import { AnalyticsServiceAPI } from "../../constants";
import { AuthContext } from "../../components/App/AuthContext";

const Term = React.lazy(async () => {
  return import("../../components/Terminal/Terminal");
});

// const sleep = (ms:  number) => new Promise( resolve => setTimeout(resolve, ms))
export default function Environment() {
  const { user, team } = useParams();
  const { token, refresh_token, setToken } = React.useContext(AuthContext);
  const [server, setServer] = React.useState("");
  // const server = "http://0.0.0.0:39627";
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

  return (
    <>
      {team && user ? (
        <>
          <Stack direction="row" sx={{ height: "100%" }}>
            <Box flex={1} sx={{ display: "flex" }}>
              <FileManagerFront server={server} />
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
              {/* <Box flex={1}> */}
              <Editor team={team} user={user}></Editor>
              {/* </Box> */}
              {/* </Stack> */}
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
