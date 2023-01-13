import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Select, MenuItem, SelectChangeEvent } from "@mui/material";
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
          <DialogContentText>Select Lab</DialogContentText>
          <form onSubmit={handleSubmit} id="dialog_form">
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
              }}
            >
              <Select
                id="labid"
                name="labid"
                value={labid}
                label="Lab"
                onChange={handleChange}
                autoWidth
              >
                {labs.map((lab) => (
                  <MenuItem value={lab.id}>
                    Name: {lab.name} Course: {lab.course}
                  </MenuItem>
                ))}
              </Select>
            </Box>
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
