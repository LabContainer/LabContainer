import "./Teams.css";
import * as React from 'react';
import TeamCard from "./TeamCard";
import { DashBoardData } from "./LabCard";
import { AuthContext } from "../../components/App/AuthContext";

interface DataInterface {
    data: DashBoardData;
    id: number;
};

interface DataInterfaceItems extends Array<DataInterface>{};

function Teams({data}: { data: DataInterfaceItems }) {
    const { user } = React.useContext(AuthContext);

    if (!user) return <>No Auth Context</>;
    return (
        <div className="teams">
            <div>
                {data.length ? (
                        data.map((d) => (
                        <TeamCard
                            data={d.data}
                            key={d.id}
                        />
                        ))
                    ) : (
                        <p> No Labs Available for user</p>
                    )}
            </div>
        </div>
    );
}

export default Teams;