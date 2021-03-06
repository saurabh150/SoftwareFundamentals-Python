import React from 'react';
import axios from 'axios';

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  DialogContentText,
  Button,
  TextField,
} from '@material-ui/core';
import AuthContext from '../../AuthContext';

function AddMemberDialog({ channel_id, ...props }) {
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState('');
  const [users, setUsers] = React.useState([]);

  const token = React.useContext(AuthContext);
  console.log("Selected use is ")
  console.log(selectedUser)
  console.log(setSelectedUser)

  function fetchUserData() {
    axios
    .get('/users/all', {
      params: {
        token,
      },
    })
    .then(({ data }) => {
      setUsers(data['users']);
    })
    .catch((err) => {});
  }

  React.useEffect(() => {
      fetchUserData();
  }, []);

  const handleUserSelect = event => {
      console.log("Handle selecting.")
      const newUserId = parseInt(event.target.value,10);
      console.log(newUserId)
      setSelectedUser(newUserId);
  };

  function handleClickOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  function handleSubmit(event) {
    event.preventDefault();
    const u_id = selectedUser;
    console.log("Submitting for user:")
    console.log(u_id)

    if (!u_id) return;

    axios.post(`/channel/invite`, { token, u_id, channel_id })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {});
  }
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Invite Member
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Invite User</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Enter a user id below to invite a user to this channel
            </DialogContentText>
            <Select style={{width:"100%"}} id="u_id" onChange={handleUserSelect} value={selectedUser}>
              {users.map((d, idx) => {
                return <MenuItem value={d.u_id}>{d.name_first} {d.name_last}</MenuItem>
              })}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} type="submit" color="primary">
              Invite
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default AddMemberDialog;
