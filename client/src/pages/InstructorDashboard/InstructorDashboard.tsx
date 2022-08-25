import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { AuthContext, IUser } from "../../components/App/AuthContext";
import fetchData from "../../components/App/fetch";
import DataTable, { IHeadCell } from "../../components/DataTable/DataTable";
import FormDialogAddLab from "../../components/FormDialogAddLab/FormDialogAddLab";
import FormDialogUsersAdd from "../../components/FormDialogUsersAdd/FormDialogUsersAdd";
import { AnalyticsServiceAPI, AuthServiceAPI } from "../../constants";
import { ILab } from "../StudentDashboard/StudentDashboard";

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
  const [labs, setLabs] = React.useState<ILab[]>([]);
  const [labsCreateOpen, setLabsCreateOpen] = React.useState(false);
  const [usersAddOpen, setUserAddOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<readonly string[]>(
    []
  );

  React.useEffect(() => {
    const abortController = new AbortController();
    // Fetch all data
    fetchData(AuthServiceAPI, "/users", token, refresh_token, setToken, {
      method: "GET",
      signal: abortController.signal,
    }).then(setUsers);
    fetchData(AnalyticsServiceAPI, "/labs", token, refresh_token, setToken, {
      method: "GET",
      signal: abortController.signal,
    }).then(setLabs);
    return () => {
      abortController.abort();
    };
  }, [token, refresh_token, setToken, setUsers]);
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
                  fetchData(
                    AnalyticsServiceAPI,
                    `/labs/${labid}/users?username=${
                      users[parseInt(user_index)].username
                    }`,
                    token,
                    refresh_token,
                    setToken,
                    {
                      method: "POST",
                    }
                  );
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
                fetchData(
                  AnalyticsServiceAPI,
                  "/labs/create",
                  token,
                  refresh_token,
                  setToken,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      id: labid,
                      course: course,
                      instructor: instructor,
                    }),
                  }
                );
              }}
            />
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}

export default InstructorDashboard;
