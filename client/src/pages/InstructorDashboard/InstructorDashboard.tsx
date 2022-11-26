import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import useAPI from "../../api";
import { LabCreate } from "../../clients/AnalyticsClient";
import { AuthContext, IUser } from "../../components/App/AuthContext";
import DataTable, { IHeadCell } from "../../components/DataTable/DataTable";
import FormDialogAddLab from "../../components/FormDialogAddLab/FormDialogAddLab";
import FormDialogUsersAdd from "../../components/FormDialogUsersAdd/FormDialogUsersAdd";

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
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Lab ID",
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
    id: "info",
    numeric: true,
    disablePadding: false,
    label: "More Info",
  },
];

function InstructorDashboard() {
  const { token, refresh_token, setToken } = React.useContext(AuthContext);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [labs, setLabs] = React.useState<LabCreate[]>([]);
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
      <Stack>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          Instructor Dashboard
        </Typography>
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
              title="Users"
              rows={
                users
                  ? users.map((user, i) => ({
                      values: user as any,
                      key: i,
                    }))
                  : []
              }
              headCells={headCellsUsers}
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
              handleSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const labid = data.get("id") as string;
                for (const user_index of selectedUsers) {
                  const user = users[parseInt(user_index)];
                  LabsApi.labsAddLabUser(labid, user.username);
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
                const labid = data.get("id") as string;
                const course = data.get("course") as string;
                const instructor = data.get("instructor") as string;
                LabsApi.labsCreateLab({
                  id: labid,
                  course: course,
                  instructor: instructor,
                });
              }}
            />
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}

export default InstructorDashboard;
