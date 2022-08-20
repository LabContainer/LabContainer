import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({open, handleClose, handleSubmit} : {open : boolean , handleClose : React.MouseEventHandler<HTMLButtonElement>, handleSubmit: React.FormEventHandler<HTMLFormElement>}) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter filename to create
          </DialogContentText>
          <form onSubmit={handleSubmit} id="dialog_form">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="File Name"
              name="filename"
              type="name"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} type="submit" form="dialog_form">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}