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
    disablePadding: false,
    label: "Course",
  },
  {
    id: "instructor",
    numeric: false,
    disablePadding: false,
    label: "Instructor",
  }
];

function Assignments({ labs }: { labs: Lab[]}) {
  const [labsCreateOpen, setLabsCreateOpen] = React.useState(false);
  const { LabsApi } = useAPI();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        width: "100%",
      }}
    >
      
      <Stack sx={{ width : "100%"}}>
        <Container
          sx={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box sx={{ margin: "20px" , width: "100%"}}>
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

export default Assignments;