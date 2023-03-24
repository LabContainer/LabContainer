import "./Teams.css";
import * as React from 'react';
import TeamCard from "./TeamCard";
import { DashBoardData } from "./LabCard";
import { AuthContext } from "../../components/App/AuthContext";
import { Button, Select } from "@mui/material";
import FormDialogAddTeam from "../../components/FormDialogAddTeam/FormDialogAddTeam";
import FormDialogJoinTeam from "../../components/FormDialogJoinTeam/FormDialogJoinTeam";
import useApi from "../../api";
import { ApiError } from "../../clients/AnalyticsClient";
import { errorMessage } from "../../components/App/message";

interface DataInterface {
    data: DashBoardData;
    id: number;
};

interface DataInterfaceItems extends Array<DataInterface>{};

function Teams({data, labNames, refreshData}: { data: DataInterfaceItems, labNames : string[] ,refreshData: () => void }) {
    const { user } = React.useContext(AuthContext);
    const [createTeamOpen, setCreateTeamOpen] = React.useState(false);
    const [joinTeamOpen, setJoinTeamOpen] = React.useState(false);
    const { TeamsApi } = useApi();

    if (!user) return <>No Auth Context</>;
    return (
        <div className="teams">
            <div>
                <Button
                    onClick={() => setJoinTeamOpen(true)}
                >
                    Join Team
                </Button>
                <Button
                    onClick={() => setCreateTeamOpen(true)}
                >
                    Create Team
                </Button>
                <FormDialogAddTeam
                    labNames={labNames}
                    open={createTeamOpen}
                    handleClose={() => setCreateTeamOpen(false)}
                    handleSubmit={(event) => {
                    event.preventDefault();
                    const form_data = new FormData(event.currentTarget);
                    const team = form_data.get("team_name");
                    const lab = form_data.get("labSelect");
                    let id_lab = null;
                    
                    for (let lab_instance of data) {
                        if (String(lab_instance.data.LabName).trim() === String(lab).trim()) {
                            id_lab = lab_instance.data.LabId;
                        }
                    }
                    
                    if (team && id_lab) {
                        TeamsApi.teamsCreateNewTeam({
                        lab_id: id_lab,
                        name: team as string,
                        }).then(refreshData).catch((err : ApiError) => {
                            if(err.status === 409)
                                errorMessage("Team name already exists")
                            else{
                                console.log("Error creating team: ")
                                console.log(err)
                            }
                        });
                    } else {
                        console.log("Incorrect Lab Name.")
                    }
                    }}
                />
                <FormDialogJoinTeam
                    open={joinTeamOpen}
                    handleClose={() => setJoinTeamOpen(false)}
                    handleSubmit={(event) => {
                    event.preventDefault();
                    const form_data = new FormData(event.currentTarget);
                    const team = String(form_data.get("teamSelect"));

                    if (team) {
                        TeamsApi.teamsJoinTeam(team, user?.username || "").then(refreshData);
                    } else {
                        console.log("Incorrect Team Name.")
                    }
                    }}
                />
            </div>
            <div>
                {data.length ? (
                        data.map((d) => (
                        d.data.Team ? 
                            <TeamCard
                                data={d.data}
                                key={d.id}
                                refreshData={refreshData}
                            />
                        : <div key={d.id}></div>
                        ))
                    ) : (
                        <p> No Teams Available for user</p>
                    )}
            </div>
        </div>
    );
}

export default Teams;