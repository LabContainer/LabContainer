import React from "react";
import { Suspense } from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";

const sleep = (ms:  number) => new Promise( resolve => setTimeout(resolve, ms))

const DashCard = React.lazy(async () => {
    await sleep(1000)
    return import('./DashboardCard');
})

export default function StudentDashboard(){
  return <>
    <Suspense fallback={<CircularIndeterminate/>}>
    <DashCard />
    </Suspense>
  </>
}

