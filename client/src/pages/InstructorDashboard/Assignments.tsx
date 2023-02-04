import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import useAPI from "../../api";
import { Lab, MilestoneCreate } from "../../clients/AnalyticsClient";
import { AuthContext, IUser } from "../../components/App/AuthContext";
import DataTable, { IHeadCell } from "../../components/DataTable/DataTable";
import FormDialogAddLab from "../../components/FormDialogAddLab/FormDialogAddLab";
import FormDialogUsersAdd from "../../components/FormDialogUsersAdd/FormDialogUsersAdd";
import {
  errorMessage,
  successMessage,
  MessageContainer,
} from "../../components/App/message";
import LabStudentDetailDialog from "./LabStudentDetailDialog";
import { ILabUsers } from "./Students";

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

function Assignments({ labs, labUsers, refreshData }: { labs: Lab[], labUsers : ILabUsers ,refreshData: () => void}) {
  const [labsCreateOpen, setLabsCreateOpen] = React.useState(false);
  const { LabsApi , MilestonesApi} = useAPI();

  // deatils dialog
  const [labStudentDetailOpen, setLabStudentDetailOpen] = React.useState(false);
  const [ labStudent, setLabStudent ] = React.useState<Lab | null>(null);
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
          {
            // make content scrollable
          }
          <Box sx={{
             margin: "20px", 
             width: "100%",
              overflow: "auto"
          }}>
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
              onRowClick={(row_index) => {
                setLabStudent(labs[row_index]);
                setLabStudentDetailOpen(true);
              }}
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
                const milestoneCount = data.get("milestoneCount") as string;
                const n = parseInt(milestoneCount);
                const milestones : { deadline : string, description : string, test_script : string}[] = [];
                for (let i = 0; i < n; i++) {
                  const milestoneDescription = data.get(
                    "MilestoneDescription" + i
                  ) as string;
                  const milestoneDeadline = data.get(
                    "MilestoneDeadline" + i
                  ) as string;
                  const MilestoneTestScript = data.get(
                    "MilestoneTestScript" + i
                  ) as string;
                  milestones.push({
                    description: milestoneDescription,
                    deadline: milestoneDeadline,
                    test_script: MilestoneTestScript,
                  });
                }
                try {
                  LabsApi.labsCreateLab({
                    name,
                    course,
                    instructor,
                    description,
                    deadline,
                    environment_init_script,
                  }).then(res => {
                    const m_promises : Promise<any>[] = [];
                    for(const milestone of milestones){
                      m_promises.push(MilestonesApi.milestonesCreateMilestone({
                        lab_id : res.response,
                        deadline : milestone.deadline,
                        description : milestone.description,
                        test_script : milestone.test_script,
                      }).then().catch(error => {
                        errorMessage("Unable to create milestone!");
                      }))
                    }
                    return Promise.all(m_promises)
                  }).then(() => {
                    successMessage("Lab created!");
                    refreshData();
                  }).catch(error => {
                    errorMessage("Unable to create lab!");
                    refreshData();
                  })
                } catch (error) {
                  errorMessage("Unable to create lab! See Console for details.");
                  console.error(error);
                }
              }}
            />
          </Box>
        </Container>
      </Stack>

      {
        // Dialog for student info
      }
      <LabStudentDetailDialog
        open={labStudentDetailOpen}
        handleClose={() => {
          setLabStudentDetailOpen(false);
        }}
        lab={labStudent ? labStudent : null}
        lusers={labStudent?.id ? labUsers[labStudent.id] : []}
      />
    </Box>
  );
}

export default Assignments;