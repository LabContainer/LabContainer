import { Box, Container, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";

import "./StudentDashboard.css";
import { DashBoardData } from "./DashboardCard";
import fetchData from "../../components/App/fetch";
import { AuthContext } from "../../components/App/AuthContext";
import { AnalyticsServiceAPI } from "../../constants";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DashCard = React.lazy(async () => {
  return import("./DashboardCard");
});

export interface ITeam {
  name: string;
  lab_id: string;
}

export interface ILab {
  instructor: string;
  course: string;
  id: string;
}

async function getData(
  user: string,
  token: string,
  refresh_token: string,
  setToken: (s: string) => void
) {
  const teams: ITeam[] = await fetchData(
    AnalyticsServiceAPI,
    `/teams?username=${user}`,
    token,
    refresh_token,
    setToken,
    {
      method: "GET",
    }
  );
  const labs: ILab[] = await fetchData(
    AnalyticsServiceAPI,
    `/labs?username=${user}`,
    token,
    refresh_token,
    setToken,
    {
      method: "GET",
    }
  );
  const data: DashBoardData[] = [];
  for (let lab of labs) {
    const team = teams.filter((team) => team.lab_id === lab.id);
    data.push({
      Course: lab.course,
      Instructor: lab.instructor,
      LabName: lab.id,
      Progress: 30,
      Team: team[0]?.name,
      TimeLeft: "10",
    });
  }
  return data;
}

export default function StudentDashboard() {
  const { token, refresh_token, setToken, user } =
    React.useContext(AuthContext);
  const [reRender, setReRender] = React.useState(false);

  const [data, setData] = useState<
    {
      data: DashBoardData;
      id: number;
    }[]
  >([]);
  useEffect(() => {
    async function run() {
      if (user) {
        const data_list = await getData(
          user.username,
          token,
          refresh_token,
          setToken
        );
        setData(
          data_list.map((d, i) => ({
            data: d,
            id: i,
          }))
        );
      } else {
        setToken("");
      }
    }
    run();
  }, [user, token, refresh_token, setToken, setData, reRender]);

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
                      setReRender((prev) => !prev);
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
