import "./Labs.css";
import LabCard from "./LabCard";
import { DashBoardData } from "./LabCard";

interface DataInterface {
    data: DashBoardData;
    id: number;
};

interface DataInterfaceItems extends Array<DataInterface>{};

function Labs({data}: { data: DataInterfaceItems }) {
    return (
        <div className="labs">
            <div className="labs-title"> 
                Upcoming Labs
            </div>
            <div>
                {data.length ? (
                    data.map((d) => (
                    <LabCard
                        data={d.data}
                        key={d.id}
                    />
                    ))
                ) : (
                    <p> No Labs Available for user</p>
                )}
            </div>
            <div className="labs-title past"> 
                Past Labs
            </div>
                {data.length ? (
                        data.map((d) => (
                        <LabCard
                            data={d.data}
                            key={d.id}
                        />
                        ))
                    ) : (
                        <p> No Labs Available for user</p>
                )}
        </div>
    );
}

export default Labs;