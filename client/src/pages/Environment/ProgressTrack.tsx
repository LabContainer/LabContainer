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

function ProgressTrack({ milestones, current} : { milestones: MilestoneCreate[], current: Milestone | undefined}) {
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
                <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color=
                  { 
                    current?.description === milestone.description ?
                    "primary" : 
                    "secondary"
                  } />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                <div className="milestone">
                  <h4>Milestone {i}</h4>
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
    </div>
  )
}

export default ProgressTrack