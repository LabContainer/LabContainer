import "./StudentDashboardNew.css";
import DashboardPage from "../../components/DashboardPage/DashboardPage";
import { Grid, Typography, Tabs, Tab, Box } from "@mui/material";
import { AuthContext } from "../../components/App/AuthContext";
import useAPI from "../../api";
import React, { useEffect, useState } from "react";
import Labs from "./Labs";
import Teams from "./Teams";
import Notifications from "./Notifications";
import { DashBoardData } from "./LabCard";

function StudentDashboardNew() {
    const { user } = React.useContext(AuthContext);
    const [section, setSection ] = useState<number>(0);
    const handleChange = (event: React.SyntheticEvent, newSection: number) => {
        setSection(newSection);
    };
    const { LabsApi, TeamsApi } = useAPI();
    const [data, setData] = useState<
      {
        data: DashBoardData;
        id: number;
      }[]
    >([]);
    useEffect(() => {
      if (user) {
        const teams_promise = TeamsApi.teamsGetUserTeams(user.username);
        const labs_promise = LabsApi.labsGetLabs(user.username);
        const data_list: DashBoardData[] = [];
        labs_promise.then((labs) => {
          teams_promise.then((teams) => {
            for (let lab of labs) {
              const team = teams.filter((team) => team.lab_id === lab.id);
              data_list.push({
                Course: lab.course,
                Instructor: lab.instructor,
                LabName: lab.name,
                Progress: 30,
                Team: team[0]?.name,
                TimeLeft: "10",
                id: lab.id,
              });
            }
            setData(
              data_list.map((d, i) => ({
                data: d,
                id: i,
              }))
            );
          });
        });
        return () => {
          teams_promise.cancel();
          labs_promise.cancel();
        };
      }
    }, [user]);

    interface TabPanelProps {
        children?: React.ReactNode;
        value: number;
        index: number;
    }
    function TabPanel(props: TabPanelProps) {
        const { value, index, children } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
          >
            {value === index && (
                <div>
                    {children}
                </div>
            )}
          </div>
        );
      }

    return (
        <DashboardPage>
            <div>
                <Typography className="student-dashboard-title">Hello {user?.username}</Typography>
                <Grid container spacing={0}>
                    <Grid item xs={3}>
                        <Tabs orientation="vertical" value={section} onChange={handleChange} centered sx={{ borderRight: 1, borderColor: 'divider' }}>
                            <Tab label="Labs" />
                            <Tab label="Teams" />
                            <Tab label="Notifications" />
                        </Tabs>
                    </Grid>
                    <Grid item xs={9}>
                        <TabPanel value={section} index={0}>
                            <Labs data={data}></Labs>
                        </TabPanel>
                        <TabPanel value={section} index={1}>
                            <Teams></Teams>
                        </TabPanel>
                        <TabPanel value={section} index={2}>
                            <Notifications></Notifications>
                        </TabPanel>
                    </Grid>
                </Grid>
            </div>
        </DashboardPage>
    );
}

export default StudentDashboardNew;