import React from 'react'
import { Lab } from '../../clients/AnalyticsClient'
import { Typography } from '@mui/material';
import "./LabInfo.css";

function LabInfo({lab} : {lab: Lab}) {
  return (
    <div className="lab-section">
      <Typography variant="h4" sx={{paddingBottom: "5%"}}>
        Lab Information
      </Typography>
      <Typography variant="h5" sx={{paddingBottom: "5%"}}>
        {lab.name}
      </Typography>
      <Typography sx={{paddingBottom: "5%"}}>
        Course Name: {lab.course} | Instructor:{lab.instructor}
      </Typography>
      <Typography sx={{width: "100%", paddingBottom: "5%", overflowY: "visible"}}>
        <b>Lab Description:</b> {lab.description}
      </Typography>
      <Typography>
        <b>Due:</b> {lab.deadline}
      </Typography>
    </div>
  )
}

export default LabInfo