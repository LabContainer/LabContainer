import { Box, Container, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";

import "./StudentDashboard.css";
import { DashBoardData } from "./DashboardCard";
import { AuthContext } from "../../components/App/AuthContext";
import useAPI from "../../api";
// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DashCard = React.lazy(async () => {
  return import("./DashboardCard");
});

export default function StudentDashboard() {
  const { user } = React.useContext(AuthContext);
  const { LabsApi, TeamsApi } = useAPI();
  const [data, setData] = useState<
    {
      data: DashBoardData;
      id: number;
    }[]
  >([]);
  useEffect(() => {
    async function run() {
      if (user) {
        const teams = await TeamsApi.teamsGetUserTeams(user.username);
        const labs = await LabsApi.labsGetLabs(user.username);
        const data_list: DashBoardData[] = [];
        for (let lab of labs) {
          const team = teams.filter((team) => team.lab_id === lab.id);
          data_list.push({
            Course: lab.course,
            Instructor: lab.instructor,
            LabName: lab.id,
            Progress: 30,
            Team: team[0]?.name,
            TimeLeft: "10",
          });
        }
        setData(
          data_list.map((d, i) => ({
            data: d,
            id: i,
          }))
        );
      }
    }
    run();
  }, [user]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{
            width: "80%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Hi , {user?.username}</Typography>
          <Typography variant="h6">Current labs</Typography>
          <Suspense fallback={<CircularIndeterminate />}>
            <Container
              sx={{
                width: "80%",
                justifyContent: "space-evenly",
              }}
            >
              {data.length ? (
                data.map((d) => (
                  <DashCard
                    data={d.data}
                    key={d.id}
                    reRender={() => {
                      console.log("Called");
                      // setReRender((prev) => !prev);
                    }}
                  />
                ))
              ) : (
                <p> No Labs Available for user</p>
              )}
            </Container>
          </Suspense>
        </Stack>
      </Box>
    </>
  );
}
