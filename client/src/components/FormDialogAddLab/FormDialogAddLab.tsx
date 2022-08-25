import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

export default function FormDialogAddLab({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Lab</DialogTitle>
        <DialogContent>
          <DialogContentText>Please Enter Lab ID</DialogContentText>
          <form onSubmit={handleSubmit} id="dialog_form">
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
              }}
            >
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Lab ID"
                name="id"
                type="name"
                fullWidth
                variant="standard"
                sx={{
                  marginRight: "20px",
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="course_name"
                label="Course"
                name="course"
                type="name"
                fullWidth
                variant="standard"
                sx={{
                  marginRight: "20px",
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="instructor_name"
                label="Instructor"
                name="instructor"
                type="name"
                fullWidth
                variant="standard"
                sx={{
                  marginRight: "20px",
                }}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} type="submit" form="dialog_form">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
