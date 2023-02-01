import "./InstructorDashboard.css";
import DashboardPage from "../../components/DashboardPage/DashboardPage";
import { Grid, Typography, Tabs, Tab, Box } from "@mui/material";
import { DashBoardData } from "./DashboardCard";
import { AuthContext } from "../../components/App/AuthContext";
import useAPI from "../../api";
import React, { useEffect, useState } from "react";
import Labs from "./Assignments";
import Teams, { ILabUsers } from "./Students";
import Notifications from "./Notifications";
import { MessageContainer } from "../../components/App/message";
import { Assignment } from "@mui/icons-material";
import Assignments from "./Assignments";
import Students from "./Students";
import { Lab } from "../../clients/AnalyticsClient";
import { UserInfo } from "../../clients/AuthClient";



function InstructorDashboard() {
    const { user } = React.useContext(AuthContext);
    const [section, setSection ] = useState<number>(0);
    const handleChange = (event: React.SyntheticEvent, newSection: number) => {
        setSection(newSection);
    };

    const [labUsers, setLabUsers] = React.useState<ILabUsers>({});
    const [labs, setLabs] = React.useState<Lab[]>([]);
    const { UserApi, LabsApi } = useAPI();

    const [userInfoMap, setUserInfoMap] = React.useState<{ [key : string] : UserInfo}>({})

    React.useEffect(() => {
      const lab_promise = LabsApi.labsGetLabs();

      lab_promise.then((labs) => {
        setLabs(labs);
        return labs
      }
      ).then( labs => 
        Promise.all(
          labs
            .map( lab => lab.id)
            .map( lab_id => 
              LabsApi.labsGetLabUsers(lab_id).then( 
                users => users.map( user => {
                  if(userInfoMap[user.name])
                    return Promise.resolve(userInfoMap[user.name]);
                  else{
                    // fetch user info from server
                    return UserApi.usersGetUserInfo(user.name).then((user_info) => {
                      setUserInfoMap({...userInfoMap, [user_info.username] : user_info});
                      return user_info;
                    })
                  }
                })
              ).then(us => Promise.all(us)).then(user_infos => ({ [lab_id] : user_infos}))
            )
          )
        ).then((lab_users) => {
        const lab_users_dict = lab_users.reduce((acc, lab_user) => ({...acc, ...lab_user}), {});
        setLabUsers(lab_users_dict);
      }).catch((err) => {
        console.log(err);
      });

  
      return () => {
        lab_promise.cancel();
      };
    }, []);

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
            <MessageContainer />
            <div>
                <Typography className="student-dashboard-title">Hello {user?.username}</Typography>
                <Grid container spacing={0}>
                    <Grid item xs={3}>
                        <Tabs orientation="vertical" value={section} onChange={handleChange} centered sx={{ borderRight: 1, borderColor: 'divider' }}>
                            <Tab label="Assignments" />
                            <Tab label="Students" />
                            <Tab label="Notifications" />
                        </Tabs>
                    </Grid>
                    <Grid item xs={9}>
                        <TabPanel value={section} index={0}>
                            <Assignment/>
                            <Assignments
                                labs={labs}
                            />
                        </TabPanel>
                        <TabPanel value={section} index={1}>
                            <Students
                                labs={labs}
                                labUsers={labUsers}
                            />
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

export default InstructorDashboard;