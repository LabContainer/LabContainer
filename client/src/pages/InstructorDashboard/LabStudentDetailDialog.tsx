import React from "react";
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from "@mui/material";
import useAPI from "../../api";
import { Lab } from "../../clients/AnalyticsClient";
import { UserInfo } from "../../clients/AuthClient";
import DataTable, { IHeadCell } from "../../components/DataTable/DataTable";
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

    return (
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Student Details</DialogTitle>

        <DialogContent>
          <DialogContentText>Lab Information</DialogContentText>
          
          {
            //display student details in a table
          }
          <DataTable
              title="Students"
              rows={ lusers.map((u, i) => {
                  return {
                    values: {
                      username: u.username,
                      email: u.email,
                      // get lab name from lab id using labs
                      lab: lab?.name || "Unknown",
                    },
                    key: i,
                  }
                })
              }
              headCells={headCellsUsers}
              selectionEnable={false}
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

