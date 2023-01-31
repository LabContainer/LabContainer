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

function InstructorDashboard() {
  const { token, refresh_token, setToken } = React.useContext(AuthContext);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [labs, setLabs] = React.useState<Lab[]>([]);
  const [usersAddOpen, setUserAddOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<readonly string[]>(
    []
  );
  const { UserApi, LabsApi } = useAPI();
  React.useEffect(() => {
    const user_promise = UserApi.usersGetUsers();
    const lab_promise = LabsApi.labsGetLabs();

    user_promise.then(setUsers);
    lab_promise.then(setLabs);

    return () => {
      user_promise.cancel();
      lab_promise.cancel();
    };
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <MessageContainer />
      <Stack>
        <Container
          sx={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ margin: "20px" }}>
            <DataTable
              onSelect={setSelectedUsers}
              title="Students"
              rows={
                users
                  ? users
                      .filter((u) => u.is_student)
                      .map((user, i) => ({
                        values: user as any,
                        key: i,
                      }))
                  : []
              }
              headCells={headCellsUsers}
              selectionEnable={true}
            />
            <Button variant="contained" onClick={() => setUserAddOpen(true)}>
              {" "}
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
                  const user = users[parseInt(user_index)];
                  console.log(labid);
                  try {
                    await LabsApi.labsAddLabUser(labid, user.username);
                    successMessage("User added to lab!");
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

export default InstructorDashboard;