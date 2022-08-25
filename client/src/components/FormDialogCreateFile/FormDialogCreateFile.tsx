import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, MenuItem, Select } from "@mui/material";

export default function FormDialogCreateFile({
  open,
  handleClose,
  handleSubmit,
  languages,
}: {
  open: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  languages: {
    lang: string;
    key: number;
  }[];
}) {
  const [lang, setLang] = React.useState(languages[0].lang);
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create File</DialogTitle>
        <DialogContent>
          <DialogContentText>Please Enter filename to create</DialogContentText>
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
                label="File Name"
                name="filename"
                type="name"
                fullWidth
                variant="standard"
                sx={{
                  marginRight: "20px",
                }}
              />
              <Select
                autoFocus
                onChange={(e) => setLang(e.target.value)}
                label="Language"
                value={lang}
                name="langSelect"
              >
                {languages.map(({ lang, key }) => (
                  <MenuItem value={lang} key={key}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
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
