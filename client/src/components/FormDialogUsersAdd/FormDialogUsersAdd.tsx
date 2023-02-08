import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Select, MenuItem, SelectChangeEvent, InputLabel } from "@mui/material";
import { Lab } from "../../clients/AnalyticsClient";

export default function FormDialogUsersAdd({
  open,
  labs,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  labs: Lab[];
}) {
  const [labid, setID] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setID(event.target.value as string);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Selected Users to Lab</DialogTitle>
        <DialogContent>
          <DialogContentText>Select a Lab to Add Users To</DialogContentText>
          <form onSubmit={handleSubmit} id="dialog_form" style={{paddingTop: "5%"}}>
              <InputLabel>Lab</InputLabel>
              <Select
                id="labid"
                name="labid"
                value={labid}
                label="Lab"
                onChange={handleChange}
                autoWidth
                sx={{width: "100%"}}
              >
                {labs.map((lab) => (
                  <MenuItem value={lab.id} key={lab.id}>
                    Name: {lab.name} Course: {lab.course}
                  </MenuItem>
                ))}
              </Select>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} type="submit" form="dialog_form">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
