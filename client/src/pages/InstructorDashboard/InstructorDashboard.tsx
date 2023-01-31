import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import useAPI from "../../api";
import { Lab } from "../../clients/AnalyticsClient";
import { AuthContext, IUser } from "../../components/App/AuthContext";
import DataTable, { IHeadCell } from "../../components/DataTable/DataTable";
import FormDialogAddLab from "../../components/FormDialogAddLab/FormDialogAddLab";
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
    disablePadding: true,
    label: "Email",
  },
  {
    id: "lab",
    numeric: true,
    disablePadding: false,
    label: "Labs",
  },
  {
    id: "info",
    numeric: true,
    disablePadding: false,
    label: "More Info",
  },
];
const headCellsLabs: IHeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "course",
    numeric: false,
    disablePadding: true,
    label: "Course",
  },
  {
    id: "instructor",
    numeric: true,
    disablePadding: false,
    label: "Instructor",
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "Description",
  },
];

function InstructorDashboard() {
  const { token, refresh_token, setToken } = React.useContext(AuthContext);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [labs, setLabs] = React.useState<Lab[]>([]);
  const [labsCreateOpen, setLabsCreateOpen] = React.useState(false);
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
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          Instructor Dashboard
        </Typography>
        <Container
          sx={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "center",
            overflow: "visible"
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
          <Box sx={{ margin: "20px" }}>
            <DataTable
              title="Labs"
              rows={
                labs
                  ? labs.map((user, i) => ({
                      values: user as any,
                      key: i,
                    }))
                  : []
              }
              headCells={headCellsLabs}
              selectionEnable={false}
            />
            <Button
              variant="contained"
              onClick={() => {
                setLabsCreateOpen(true);
              }}
            >
              {" "}
              Create Lab{" "}
            </Button>
            <FormDialogAddLab
              handleClose={() => {
                setLabsCreateOpen(false);
              }}
              open={labsCreateOpen}
              handleSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const name = data.get("name") as string;
                const course = data.get("course") as string;
                const instructor = data.get("instructor") as string;
                const description = data.get("description") as string;
                const deadline = data.get("deadline") as string;
                const environment_init_script = data.get(
                  "environment_init_script"
                ) as string;
                try {
                  LabsApi.labsCreateLab({
                    name,
                    course,
                    instructor,
                    description,
                    deadline,
                    environment_init_script,
                  });
                  successMessage("Lab created!");
                } catch (error) {
                  errorMessage("Unable to create lab!");
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
