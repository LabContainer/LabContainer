import { Container, Stack } from "@mui/material";
import React from "react";
import { Suspense } from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";

import './StudentDashboard.css'
import { DashBoardData } from "./DashboardCard";
const sleep = (ms:  number) => new Promise( resolve => setTimeout(resolve, ms))

const DashCard = React.lazy(async () => {
    await sleep(1000)
    return import('./DashboardCard');
})

export default function StudentDashboard(){
  const data : DashBoardData[] = [{
    LabName : "TestLab",
    Course : "TestCourse",
    Instructor: "TestInstructor",
    Progress: 30,
    TimeLeft: "1day"
  }, {
    LabName : "TestLab",
    Course : "TestCourse",
    Instructor: "TestInstructor",
    Progress: 30,
    TimeLeft: "1day"
  }, {
    LabName : "TestLab",
    Course : "TestCourse",
    Instructor: "TestInstructor",
    Progress: 30,
    TimeLeft: "1day"
  }]

  return <>
    <Suspense fallback={<CircularIndeterminate/>}>
    <Container sx={{
      width: "80%",
      justifyContent: "space-evenly"
    }}>
      {data.map(d =>  <DashCard data={d}/>)}

    </Container>
    </Suspense>
  </>
}

