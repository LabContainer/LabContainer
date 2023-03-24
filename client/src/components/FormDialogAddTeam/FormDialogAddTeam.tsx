import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Select, MenuItem, Grid, InputLabel } from "@mui/material";
import useAPI from "../../api";
import { AuthContext } from "../../components/App/AuthContext";
import { useEffect } from "react";

export default function FormDialogAddTeam({
  open,
  handleClose,
  handleSubmit,
  labNames
}: {
  open: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  labNames: string[];
}) {
  const { user } = React.useContext(AuthContext);
  const [labSelect, setLabSelect] = React.useState("");
  // const [data, setData] = React.useState<string[]>([]);
  // const { LabsApi } = useAPI();

  // useEffect(() => {
  //   if (user) {
  //     const labs_promise = LabsApi.labsGetLabs(user.username);
  //     labs_promise.then((labs) => {
  //       for (let lab of labs) {
  //         setData((data) => {
  //             if (data.includes(lab.name)) {
  //               return data;
  //             } else {
  //               data.push(lab.name);
  //               return data;
  //             }
  //         })
  //       }
  //     });
  //     return () => {
  //       labs_promise.cancel();
  //     };
  // }}, [user])

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Team</DialogTitle>
        <DialogContent>
          <DialogContentText>Please Enter the Lab Name and Team Name to add</DialogContentText>
          <form onSubmit={handleSubmit} id="dialog_form" style={{paddingTop: "10%"}}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputLabel>Lab</InputLabel>
                <Select
                  onChange={(e) => setLabSelect(e.target.value)}
                  id="labSelect"
                  value={labSelect}
                  name="labSelect"
                  sx={{width: "100%"}}
                >
                  {labNames.map((value, index) =>
                      <MenuItem value={value} key={index}>
                          {value}
                      </MenuItem>
                  )}
                </Select>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Team</InputLabel>
                <TextField
                  id="team_name"
                  name="team_name"
                  type="team_name"
                  required
                  fullWidth
                />
              </Grid>
            </Grid> 
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
