import { Drawer, Box, Typography, IconButton } from "@mui/material";
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import MailIcon from '@mui/icons-material/Mail';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import './Panel.css';
import "./Environment.css";
import LabInfo from "./LabInfo";
import ProgressTrack from "./ProgressTrack";
import Feedback from "../../components/Feedback/Feedback";
import { useState } from "react";
import { Lab, Milestone } from "../../clients/AnalyticsClient";

interface PanelProps {
    lab: Lab | undefined;
    milestones: Milestone[];
    currentMilestone: Milestone | undefined;
    user: string;
    team: string;
    timeSpent: number;
    currEnvCreated: string;
  }

function Panel({lab, milestones, currentMilestone, user, team, timeSpent, currEnvCreated}: PanelProps){
    const [isDrawerOpen,  setIsDrawerOpen] = useState(false);
    const [section, setSection] = useState('Description');
    function openDrawer(section: string) {
        setSection(section);
        setIsDrawerOpen(true);
    }
    function showCurrentSection(){
        if (section === 'Description'){
            return (
                <div
                    style={{
                    // minHeight: labMinHeight + "px",
                    backgroundColor: "white",
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
                >
                    {lab ? ( <LabInfo lab={lab}/>) : null}
                </div>
            )
        }
        else if (section === 'Milestone'){
            return(
                <div
                    style={{
                    // height: progressTrackHeight,
                    // minHeight: progressTrackMinHeight + "px",
                    backgroundColor: "white",
                    width: "100%",
                    }}
                >
                    <ProgressTrack milestones={milestones} current={currentMilestone} timeSpent={timeSpent} currEnvCreated={currEnvCreated} />
                </div>
            )
        }
        else {
            return(
                <div
                    style={{
                    backgroundColor: "white",
                    width: "100%",
                    // height: `100% - ${progressTrackHeight}px - ${labSectionHeight}px`,
                    bottom: 0,
                    flexGrow: 1
                    }}
                >
                    <Feedback
                        team={team}
                        username={user}
                    />
                </div>
            )
        }
    }
    return (
        <div className="selection-panel">  
            <List>
                <ListItem disablePadding>
                    <IconButton size="large" edge='start' color='inherit' aria-label="logo" onClick={() => openDrawer("Description")}>
                        <ReceiptIcon fontSize="large"/>
                    </IconButton>
                </ListItem>
                <ListItem disablePadding>
                    <IconButton size="large" edge='start' color='inherit' aria-label="logo" onClick={() => openDrawer("Milestone")}>
                        <CheckBoxIcon fontSize="large"/>
                    </IconButton>
                </ListItem>
                <ListItem disablePadding>
                    <IconButton size="large" edge='start' color='inherit' aria-label="logo" onClick={() => openDrawer("Feedback")}>
                        <MailIcon fontSize="large"/>
                    </IconButton>
                </ListItem>
            </List>
            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box p={2} width='300px' textAlign='center' role='presentation'>
                    {showCurrentSection()}
                </Box>
            </Drawer>
        </div>

    )
}

export default Panel