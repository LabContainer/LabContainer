import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, Select, MenuItem, InputLabel } from "@mui/material";
import useAPI from "../../api";
import { AuthContext } from "../../components/App/AuthContext";
import { useEffect } from "react";


export default function FormDialogJoinTeam({
  open,
  handleClose,
  handleSubmit
}: {
  open: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
    const { user } = React.useContext(AuthContext);
    const [data, setData] = React.useState<{ [lab: string]: string[]}>({});
    const [labSelect, setLabSelect] = React.useState("");
    const [teamSelect, setTeamSelect] = React.useState("");
    const { LabsApi } = useAPI();

    useEffect(() => {
        if (user) {
          const labs_promise = LabsApi.labsGetLabs(user.username);
          labs_promise.then((labs) => {
            for (let lab of labs) {
                LabsApi.labsGetLabTeams(lab.id).then((teams) => {
                    setData((data) => {
                        data[String(lab.name)] = [];
                        for (let team of teams) {
                            data[String(lab.name)].push(String(team.name));
                        }
                        return data
                    })
                })
            }
          });
          return () => {
            labs_promise.cancel();
          };
        }})
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Join Team</DialogTitle>
        <DialogContent>
          <DialogContentText>Please Select the Lab and Team you Wish to Join</DialogContentText>
          <form onSubmit={handleSubmit} id="dialog_form" style={{paddingTop: "10%"}}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <InputLabel>Lab</InputLabel>
                    <Select
                    autoFocus
                    onChange={(e) => setLabSelect(e.target.value)}
                    label="Labs"
                    value={labSelect}
                    name="labSelect"
                    sx={{width: "100%"}}
                    >
                        {Object.keys(data).map((key, index) =>
                            <MenuItem value={key} key={index}>
                                {key}
                            </MenuItem>
                        )}
                    </Select>
                </Grid>
                <Grid item xs={6}>
                    <InputLabel>Team</InputLabel>
                    <Select
                    autoFocus
                    onChange={(e) => setTeamSelect(e.target.value)}
                    label="Team"
                    value={teamSelect}
                    name="teamSelect"
                    sx={{width: "100%"}}
                    >
                        {data[labSelect]?.map((value, index) =>
                            <MenuItem value={value} key={index}>
                                {value}
                            </MenuItem>
                        )}
                    </Select>
                </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} type="submit" form="dialog_form">
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
