import Timeline from '@mui/lab/Timeline';
import TimelineItem,  { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import React from 'react'
import { Milestone, MilestoneCreate } from '../../clients/AnalyticsClient'

import './ProgressTrack.css'
import { Typography } from '@mui/material';

function ProgressTrack({ milestones, current} : { milestones: Milestone[], current: Milestone | undefined}) {
  
  const [colours , setColours ]= React.useState<("success" | "error")[]>([])
  React.useEffect(() => {
    let encounteredCurrent = false
    for (let i = 0; i < milestones.length; i++) {
      if (current?.description === milestones[i].description) {
        encounteredCurrent = true
      }
      if (!encounteredCurrent) {
        setColours(colours => {
          colours[i] = "success"
          return [...colours]
        })
      } else {
        setColours(colours => {
          colours[i] = "error"
          return [...colours]
        })
      }
    }
  }, [current, milestones])

  const [timeLeft, setTimeLeft] = React.useState(0);
    
  function refreshClock() {
    setTimeLeft( new Date(current?.deadline || "").getTime() - new Date().getTime());
  }
  React.useEffect(() => {
      const timerId = setInterval(refreshClock, 1000);
      return function cleanup() {
        clearInterval(timerId);
      };
  }, [])
  
  const secs = Math.floor(Math.abs(timeLeft) / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  return (
    <div className="progress-tracking">
      <Typography variant="h6" component="h2" gutterBottom sx={{height: "5%"}}>
         Progress Tracking
      </Typography>
        <div className="milestones">
          {/*
          //@ts-ignore */}
          <Timeline position="right" sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}>      
            {milestones.map((milestone, i) => (
                <TimelineItem key={milestone.milestone_id}>
                <TimelineSeparator>
                  <TimelineDot color=
                  { 
                    colours[i]
                  } />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                <div className="milestone">
                  <h4>Milestone {i} {current?.milestone_id === milestone.milestone_id ? "[Current]" : null}</h4>
                  <p>{milestone.description}</p>

                  <div className="milestone-progress">
                    <div className="milestone-progress-bar-text">
                      
                      Due Date: {milestone.deadline}

                      <div className="milestone-progress-bar-text-arrow"></div>
                      
                    </div>
                  </div>
                </div>
                </TimelineContent>
                </TimelineItem>
                
            ))}
          </Timeline>
        </div>
        <b>Time Left</b>
        <div className="timer">
          {
            timeLeft > 0 ? `${days} Days ${hours - days * 24}:${mins - hours * 60}:${secs - mins * 60}` : "No current milestone"
          }
          {
            console.log(timeLeft)
          }
          {
            console.log(new Date(current?.deadline || "").getTime() - new Date().getTime())
          }
        </div>
    </div>
  )
}

export default ProgressTrack