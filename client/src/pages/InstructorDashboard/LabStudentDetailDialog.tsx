import React from "react";
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from "@mui/material";
import useAPI from "../../api";
import { CancelablePromise, Lab, Milestone, MilestoneCreate, Team } from "../../clients/AnalyticsClient";
import { UserInfo } from "../../clients/AuthClient";
import DataTable, { IHeadCell } from "../../components/DataTable/DataTable";
import LabStudentTable from "./LabStudentTable";
const headCellsUsers: IHeadCell[] = [
  {
    id: "username",
    numeric: false,
    disablePadding: true,
    label: "Username",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "lab",
    numeric: false,
    disablePadding: false,
    label: "Labs",
  }
];
export default function LabStudentDetailDialog({
    open,
    handleClose,
    lab,
    lusers
} : {
    open: boolean;
    handleClose: React.MouseEventHandler<HTMLButtonElement>;
    lab: Lab | null;
    lusers: UserInfo[];
}) {
    const {LabsApi } = useAPI();
    // fetch teams fir lusers
    const [teams, setTeams] = React.useState<{
      [username: string]: Team;
    }>({});
    // get lab milestones
    const [milestones, setMilestones] = React.useState<Milestone[]>([]);
    React.useEffect(() => {
      let labPromise: CancelablePromise<Milestone[]>;
      let teamPromises: CancelablePromise<Team[]>[] = [];
      let teamPromise: CancelablePromise<Team[]>;
      if(lab?.id){
        lusers.forEach((u) => {
          teamPromise = LabsApi.labsGetLabTeams(lab.id, u.username)
          teamPromises.push(teamPromise);
          teamPromise.then((t) => {

            setTeams((teams) => {
              return {
                ...teams,
                [u.username]: t[0],
              };
            });
          })
        })
        labPromise = LabsApi.labsGetLabMilestones(lab.id)
        labPromise.then((m) => {
          setMilestones(m);
        });
      }
      return () => {
        if(labPromise){
          labPromise.cancel();
        }
        teamPromises.forEach((p) => {
          p.cancel();
        })
      }
    }, [lab, lusers])
    return (
        <Dialog open={open} onClose={handleClose} sx={{
            width: "100%",
        }}>
        <DialogTitle>Student Details</DialogTitle>

        <DialogContent>
          <DialogContentText>Students in this Lab</DialogContentText>
          
          {
            //display student details in a table
          }
          
          <LabStudentTable
            rows={lusers.map((u, i) => {
              // number of completed milestones is index of current milestone
              return {
                  name: u.username,
                  email: u.email,
                  status: "Active",
                  studentEnvironment: teams[u.username] ? `/environment/${teams[u.username].name}/${u.username}` : null,
                  // get lab name from lab id using labs
                  // progress: "0"
                  progress: teams[u.username] ? `${
                    (milestones.findIndex((m) => {
                      return m.milestone_id === teams[u.username]?.current_milestone;
                    }) + 1).toString()
                  } / ${milestones.length.toString()} milestones completed` : "No progress"
                }
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={(event) => {
            handleClose(event);
          }}>Close</Button>
          
        </DialogActions>
      </Dialog>
    );
}

