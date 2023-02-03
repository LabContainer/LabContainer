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
import { Assignment, NotificationsOutlined, PeopleAltRounded } from "@mui/icons-material";
import { MessageContainer } from "../../components/App/message";

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
    const [labNames, setLabNames] = useState<string[]>([]);
    // create a state to trigger re fetching of data
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
      if (user) {
        const teams_promise = TeamsApi.teamsGetUserTeams(user.username);
        const labs_promise = LabsApi.labsGetLabs(user.username);
        const data_list: DashBoardData[] = [];
        labs_promise.then((labs) => {
          setLabNames(labs.map((lab) => lab.name));
          teams_promise.then((teams) => {
            let promise_list = [];
            for (let lab of labs) {
                const team = teams.filter((team: any) => team.lab_id === lab.id);
                promise_list.push(team[0] ? TeamsApi.teamsGetTeam(team[0].name).then((user_team) => {
                  return data_list.push({
                    Course: lab.course,
                    Description: lab.description,
                    Instructor: lab.instructor,
                    LabName: lab.name,
                    LabId: lab.id,
                    Progress: 30,
                    Team: user_team.name,
                    TimeLeft: lab.deadline,
                    Team_Users: user_team.users,
                    id: lab.id,
                  });
                }) :
                  ( data_list.push({
                      Course: lab.course,
                      Description: lab.description,
                      Instructor: lab.instructor,
                      LabName: lab.name,
                      LabId: lab.id,
                      Progress: 30,
                      Team: "",
                      TimeLeft: lab.deadline,
                      Team_Users: [],
                      id: lab.id,
                  })
                  )
                )
            }
            Promise.all(promise_list).then(() =>
              setData(
                data_list.map((d, i) => ({
                  data: d,
                  id: i,
                }))
              )
            )
          });
        });
        return () => {
          teams_promise.cancel();
          labs_promise.cancel();
        };
      }
    }, [user ? user.username : "", refresh]);

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
            style={{height: "100%"}}
          >
            {value === index && (
                <div style={{ height: "100%"}}>
                    {children}
                </div>
            )}
          </div>
        );
      }
      
    return (
        <DashboardPage>
          <MessageContainer/>      
                <Typography className="student-dashboard-title" sx={{ height: "10%" , boxSizing: "border-box", margin: "auto", padding: "0"}}>Hello {user?.username}</Typography>
                <Grid container spacing={0} sx={{ height: "90%"}}>
                    <Grid item xs={3}  sx={{ height: "90%"}}>
                        <Tabs orientation="vertical" value={section} onChange={handleChange} centered sx={{ borderRight: 1, borderColor: 'divider' }}>
                            <Tab label="Labs" 
                                icon={<Assignment/>}
                                iconPosition="start"
                            />
                            <Tab label="Teams" 
                                icon={<PeopleAltRounded/>}
                                iconPosition="start"
                            />
                            <Tab label="Notifications" 
                                icon={< NotificationsOutlined />}
                                iconPosition="start"
                            />
                        </Tabs>
                    </Grid>
                    <Grid item xs={9}  sx={{ height: "90%"}}>
                        <TabPanel value={section} index={0}>
                            <Labs data={data}></Labs>
                        </TabPanel>
                        <TabPanel value={section} index={1}>
                            <Teams data={data} refreshData={()=>setRefresh(r => !r)} labNames={labNames}></Teams>
                        </TabPanel>
                        <TabPanel value={section} index={2}>
                            <Notifications></Notifications>
                        </TabPanel>
                    </Grid>
                </Grid>
            
        </DashboardPage>
    );
}

export default StudentDashboardNew;