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
  const data : { 
    data: DashBoardData,
    id: number
  }[] = [
    { 
      data: {
        LabName : "TestLab",
        Course : "TestCourse",
        Instructor: "TestInstructor",
        Progress: 30,
        TimeLeft: "1day"
      }, 
      id: 1
    },
    { 
      data: {
        LabName : "TestLab",
        Course : "TestCourse",
        Instructor: "TestInstructor",
        Progress: 30,
        TimeLeft: "1day"
      },
      id: 2
    },
    { 
      data: {
        LabName : "TestLab",
        Course : "TestCourse",
        Instructor: "TestInstructor",
        Progress: 30,
        TimeLeft: "1day"
      },
      id: 3
    }
  ]

  return <>
    <Suspense fallback={<CircularIndeterminate/>}>
    <Container sx={{
      width: "80%",
      justifyContent: "space-evenly"
    }}>
      {data.map(d =>  <DashCard data={d.data} key={d.id}/>)}

    </Container>
    </Suspense>
  </>
}

