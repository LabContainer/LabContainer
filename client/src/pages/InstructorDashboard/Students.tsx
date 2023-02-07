import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import useAPI from "../../api";
import { Lab } from "../../clients/AnalyticsClient";
import { AuthContext, IUser } from "../../components/App/AuthContext";
import DataTable, { IHeadCell } from "../../components/DataTable/DataTable";
import FormDialogUsersAdd from "../../components/FormDialogUsersAdd/FormDialogUsersAdd";
import {
  errorMessage,
  successMessage,
  MessageContainer,
} from "../../components/App/message";
import { UserInfo } from "../../clients/AuthClient";

const headCellsUsers: IHeadCell[] = [
  {
    id: "username",
    numeric: false,
    disablePadding: true,
    label: "Username",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "lab",
    numeric: false,
    disablePadding: false,
    label: "Labs",
  }
];

export interface ILabUsers { [lab_id : string] : UserInfo[]}

function Students({labUsers, labs, refreshData} : {labUsers: ILabUsers, labs: Lab[] , refreshData: () => void}) {
  const [usersAddOpen, setUserAddOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<readonly string[]>(
    []
  );
  const { UserApi, LabsApi } = useAPI();
  
  // labs for each user
  const [userLabs, setUserLabs] = React.useState<{[username : string] : { labs : string[] , info : UserInfo}}>({});
  
  React.useEffect(() => {
    // go through labUsers and create reverse mapping
    for (const lab_id of Object.keys(labUsers)) {
      for (const user of labUsers[lab_id]) {
        if (user.username in userLabs) {
          const uL = userLabs
          // only push if not already in labs
          if (!uL[user.username].labs.includes(lab_id)){
            uL[user.username].labs.push(lab_id)
            setUserLabs(uL)
          }
        } else {
          setUserLabs(userLabs => ({...userLabs, [user.username] : {labs: [lab_id], info: user}}))
        }
      }
    }

    // For users not in any labs
    // fetch all users and add to userLabs
    const userPromise = UserApi.usersGetUsers()
    userPromise.then((users) => {
      for (const user of users) {
        if (!(user.username in userLabs)) {
          setUserLabs(userLabs => ({...userLabs, [user.username] : {labs: [], info: user}}))
        }
      }
    });

    return () => {
      userPromise.cancel();
    }
    
  }, [labUsers, userLabs]);

  const [rows, setRows] = React.useState<
    { values: { [key: string]: string }; key: number }[]
  >([]);
  React.useEffect(() => {
    const transform = Object.values(userLabs)
    .filter(({labs, info}) => info.is_student)
    .map(({labs : currentUserLabs, info}, i) => { 
      const p = currentUserLabs.map(lab_id => labs.find(lab => lab.id === lab_id)?.name)//.filter(lab => lab !== undefined);
      return {
        values: {
          username: info.username,
          email: info.email,
          // get lab name from lab id using labs
          lab: p.join(", ")
        },
        key: i,
    }})
    // Accumulate all labs for each user
    setRows(transform);
  }, [userLabs, labs, labUsers]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        width: "100%",
      }}
    >
      <MessageContainer />
      <Stack sx={{
        width: "100%",
      }}>
        <Container
          sx={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box sx={{ 
            margin: "20px",
            width: "100%",
          }}>
            <DataTable
              onSelect={setSelectedUsers}
              title="Students"
              rows={ rows }
              headCells={headCellsUsers}
              selectionEnable={true}
            />
            <Button variant="contained" onClick={() => setUserAddOpen(true)}>
              Add to Lab{" "}
            </Button>
            <FormDialogUsersAdd
              handleClose={() => {
                setUserAddOpen(false);
              }}
              open={usersAddOpen}
              labs={labs}
              handleSubmit={async (event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const labid = data.get("labid") as string;
                for (const user_index of selectedUsers) {
                  console.log(user_index)
                  // filter out users that are not students
                  const users = Object.keys(userLabs).filter(username => userLabs[username].info.is_student)
                  const username = users[parseInt(user_index)];
                  console.log(username)
                  try {
                    await LabsApi.labsAddLabUser(labid, username);
                    successMessage("User added to lab!");
                    refreshData();
                  } catch (error) {
                    errorMessage("Unable to add user!");
                  }
                }
              }}
            />
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}

export default Students;