import React from 'react'
import { MilestoneCreate } from '../../clients/AnalyticsClient'

function ProgressTrack({ milestones} : { milestones: MilestoneCreate[]}) {
  // get current date
  const today = new Date();
  
  return (
    <div className="progress-tracking">
      {console.log(milestones)}
        <h3>Progress Tracking</h3>
        <div className="milestones">
            {milestones.map((milestone, i) => (
                <div className="milestone">
                  <h4>Milestone {i}</h4>
                  <p>{milestone.description}</p>

                  <div className="milestone-progress">
                    <div className="milestone-progress-bar-text">
                      
                      Due Date: {today.getDate()}

                      <div className="milestone-progress-bar-text-arrow"></div>
                      
                    </div>
                  </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ProgressTrack