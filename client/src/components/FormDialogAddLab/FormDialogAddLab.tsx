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
  const [clickedButton, setClickedButton] = React.useState('');
  const [boolChecker, setboolChecker] = React.useState(false)
  const [count, setCount] = React.useState(0);


  const clearhandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCount(0);
  };

  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setboolChecker(true)
    setCount(count + 1)
    if (count == 3) {
      setCount(3)
    }
    const button: HTMLButtonElement = event.currentTarget;
    setClickedButton(button.name);
  };
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
                id="deadline"
                label="Deadline yyyy-mm-dd"
                name="deadline"
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



              <Box
                component="span"
                m={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button onClick={buttonHandler} variant="contained">Add Milestone</Button>
                <Button onClick={clearhandler} variant="contained">Clear Milestones</Button>
              </Box>
              {count > 0 && <TextField
                autoFocus
                margin="dense"
                id="milestoneBox One"
                label="Milestone Name One"
                name="Milestone Name One"
                type="name"
                multiline
                fullWidth
                variant="standard"
                sx={{
                  marginRight: "20px",
                }}
              />}

              {count > 0 ? [...Array(count)].map(n => <TextField
                autoFocus
                margin="dense"
                id="milestoneBox One"
                label="Milestone Description One"
                name="MileStoneDescription One"
                type="name"
                key={"MilestoneKey" + n}
                multiline
                fullWidth
                variant="standard"
                sx={{
                  marginRight: "20px",
                }}


              />) : null}


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
