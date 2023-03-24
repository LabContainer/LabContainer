import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, TextareaAutosize, Typography } from "@mui/material";

import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AuthContext } from "../App/AuthContext";

export default function FormDialogAddLab({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
  const { user } = React.useContext(AuthContext);
  const [count, setCount] = React.useState(0);
  const [deadline, setDeadline] = React.useState<Dayjs | null>(
    dayjs(''),
  );
  // create a list of deadlines for milestones
  const [deadlines, setDeadlines] = React.useState<(Dayjs | null)[]>([]);

  const handleChange = (newValue: Dayjs | null) => {
    setDeadline(newValue);
  };

  const clearhandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCount(0);
  };

  const addButtonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCount(x => {
      setDeadlines(deadlines => [...deadlines, deadline]);
      return x + 1;
    });
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "50%" }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Lab</DialogTitle>

        <DialogContent>
          <DialogContentText>Lab Information</DialogContentText>
          <form onSubmit={(event) => {
            handleSubmit(event);
            setCount(0);
          }} id="dialog_form">
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
                required
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
                required
              />
              <input type="hidden" name="instructor" value={user?.username} />
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
                  marginBottom: "20px",
                }}
                required
              />
             <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Lab Deadline"
                inputFormat="YYYY-MM-DD"
                
                value={deadline}
                onChange={handleChange}
                disablePast
                renderInput={(params) => <TextField {...params} required />}
                
                />
              </LocalizationProvider>
              < input type="hidden" name="deadline" value={deadline?.format('YYYY-MM-DD')} />
              
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Environment Init Script
              </Typography>
              <TextareaAutosize
                maxRows={4}
                minRows={4}
                aria-label="init_script"
                placeholder="Environment Init Bash Script"
                defaultValue=""
                autoFocus
                id="environment_init_script"
                // label="Environment Init Script"
                name="environment_init_script"
                style={{
                  width: "100%",

                }}
                required
              />
              <Box
                component="span"
                m={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button onClick={addButtonHandler} variant="contained">Add Milestone</Button>
                <Button onClick={clearhandler} variant="contained">Clear Milestones</Button>
              </Box>

              {count > 0 ? [...Array(count).keys()].map(n =>
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="milestoneBox"
                  label="Milestone Description"
                  name={"MilestoneDescription" + n}
                  type="name"
                  key={"MilestoneKey" + n}
                  multiline
                  fullWidth
                  variant="standard"
                  sx={{
                    marginRight: "20px",
                    marginBottom: "20px",
                  }}
                  required
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}   >
                  <DesktopDatePicker
                    key={"MilestoneKeyDate" + n}
                    label={"Milestone " + n + " Deadline"}
                    inputFormat="YYYY-MM-DD"
                    disablePast
                    minDate={ n > 0 ? deadlines[n-1] : null}
                    maxDate={deadline}
                    value={deadlines[n]}
                    onChange={(newValue) => {
                      setDeadlines(oldDeadlines => {
                        const newDeadlines = [...oldDeadlines];
                        newDeadlines[n] = newValue;
                        return newDeadlines;
                      });
                    }}
                    
                    renderInput={(params) => <TextField {...params} required />}
                  />
                </LocalizationProvider>
                < input type="hidden"  key={"MilestoneKeyHiddenDate" + n} name={"MilestoneDeadline" + n} value={deadlines[n]?.format('YYYY-MM-DD')} />
            
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }} key={"MilestoneKeyTestTitle" + n}>
                  Milestone {n} Test Script
                </Typography>
                <TextareaAutosize
                  maxRows={4}
                  minRows={2}
                  aria-label="test_script"
                  placeholder="Bash Script To Test Milestone, Must Return 0 for success, 1 for failure"
                  defaultValue=""
                  autoFocus
                  key={"MilestoneKeyScript" + n}
                  name={"MilestoneTestScript" + n}
                  style={{
                    width: "100%",
                  }}
                  required
                />
                  
              </>
                ) : null}
                {// add hiden input field to store the milestone count
                }
                <input type="hidden" name="milestoneCount" value={count} />

            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={(event) => {
            handleClose(event);
            clearhandler(event);
          }}>Cancel</Button>
          <Button onClick={(event) => {
            // handleClose(event);
          }} type="submit" form="dialog_form">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
