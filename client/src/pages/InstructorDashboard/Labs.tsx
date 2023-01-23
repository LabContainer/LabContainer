import "./Labs.css";
import LabCard from "./LabCard";

function Labs() {
    return (
        <div className="labs">
            <div className="labs-title"> 
                Upcoming Labs
            </div>
            <div>
                <LabCard></LabCard>  
            </div>
            <div className="labs-title past"> 
                Past Labs
            </div>
            <div>
                <LabCard></LabCard>  
            </div>
        </div>
    );
}

export default Labs;