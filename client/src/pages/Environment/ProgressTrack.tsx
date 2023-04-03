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

function ProgressTrack({ milestones, current, timeSpent, currEnvCreated} : { 
  milestones: Milestone[], 
  current: Milestone | undefined, 
  timeSpent: number,
  currEnvCreated: string,
}) {
  
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
  const [timeSpentClock, setTimeSpentClock] = React.useState(0);
    
  function refreshClock() {
    // get time in current timezone
    setTimeLeft( new Date(current?.deadline || "").getTime()  - new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000);
    setTimeSpentClock(new Date().getTime() - new Date(currEnvCreated).getTime() + new Date().getTimezoneOffset() * 60 * 1000 + timeSpent * 1000);
  }
  React.useEffect(() => {
      const timerId = setInterval(refreshClock, 1000);
      return function cleanup() {
        clearInterval(timerId);
      };
  }, []);
  
  const secs = Math.floor(Math.abs(timeLeft) / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  
  const secs_spent = Math.floor(Math.abs(timeSpentClock) / 1000);
  const mins_spent = Math.floor(secs_spent / 60);
  const hours_spent = Math.floor(mins_spent / 60);
  const days_spent = Math.floor(hours_spent / 24);

  return (
    <div className="progress-tracking">
      <Typography variant="h5" component="h2" gutterBottom sx={{height: "5%", fontWeight: "bold"}}>
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
        <div className='time'>
          <b> 
            <Typography variant="h5" component="h2" sx={{height: "5%"}}>
              Time Spent on Lab
            </Typography>
          </b>
          <div className="timer">
            {
              timeSpentClock > 0 ? `${days_spent} Days ${hours_spent - days_spent * 24}:${mins_spent - hours_spent * 60}:${secs_spent - mins_spent * 60}` : "unkonwn"
            }
          </div>
        {/* </div> */}
        {/* <div className='time'> */}
          <b> 
            <Typography variant="h5" component="h2" sx={{height: "5%"}}>
              Current Milestone Time Left
            </Typography>
          </b>
          <div className="timer">
            {
              timeLeft > 0 ? `${days} Days ${hours - days * 24}:${mins - hours * 60}:${secs - mins * 60}` : "No current milestone"
            }
          </div>
        </div>
    </div>
  )
}

export default ProgressTrack