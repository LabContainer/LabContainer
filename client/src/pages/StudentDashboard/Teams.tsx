import "./Teams.css";
import TeamCard from "./TeamCard";
import { DashBoardData } from "./LabCard";

function Teams() {
    return (
        <div className="teams">
            <div>
                <TeamCard></TeamCard>  
            </div>
            <div>
                <TeamCard></TeamCard>  
            </div>
        </div>
    );
}

export default Teams;