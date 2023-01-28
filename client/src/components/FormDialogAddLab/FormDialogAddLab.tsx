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
    <div style={{ display: "flex", justifyContent: "center", width: "50%" }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Lab</DialogTitle>
        <DialogContent>
          <DialogContentText>Lab Information</DialogContentText>
          <form onSubmit={handleSubmit} id="dialog_form">
            <Box
              sx={{
                display: "inline",
                flexDirection: "column",
            
              }}
            >
              <TextField
                autoFocus
                multiline
                margin="dense"
                id="name"
                label="Lab Name"
                name="name"
                type="name"
                fullWidth
                variant="standard"
                sx={{
                  marginRight: "20px",
                }}
              />
              <TextField
                autoFocus
                multiline
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
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                name="description"
                type="name"
                multiline
                fullWidth
                variant="standard"
                sx={{
                  marginRight: "20px",
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="environment_init_script"
                label="Environment Init Script"
                name="environment_init_script"
                type="name"
                multiline
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
