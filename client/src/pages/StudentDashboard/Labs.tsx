import * as React from 'react';
import "./Labs.css";
import LabCard from "./LabCard";
import { AuthContext } from "../../components/App/AuthContext";
import { DashBoardData } from "./LabCard";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from '@mui/material';

interface DataInterface {
    data: DashBoardData;
    id: number;
};

interface DataInterfaceItems extends Array<DataInterface>{};

function Labs({data}: { data: DataInterfaceItems }) {
    const { user } = React.useContext(AuthContext);
    const [open, setOpen] = React.useState(false);
    const [dashboardData, setDashboardData] = React.useState<DashBoardData | null>(null);

    const handleClick = (labData: DashBoardData) => {
        setDashboardData(labData);
        setOpen(true);
    }
    if (!user) return <>No Auth Context</>;
    return (
        <div className="labs">
            <div className="labs-title"> 
                Upcoming Labs
            </div>
            <div>
                {data.length ? (
                    data.map((d) => (
                    <div onClick={()=>handleClick(d.data)}>
                    <LabCard
                        data={d.data}
                        key={d.id}
                    />
                    </div>
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
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle className='popup-lab-title'>{dashboardData?.LabName}</DialogTitle>
                <DialogContent className='popup-lab-content' sx = {{
                    minWidth: 350,
                    maxWidth: 350,
                    maxHeight: 400,
                    minHeight: 400
                }}>
                    <DialogContentText>Course: {dashboardData?.Course}</DialogContentText>
                    <DialogContentText>Instructor: {dashboardData?.Instructor}</DialogContentText>
                    <DialogContentText className='popup-lab-description'>
                        Hello, this is a test. When I was a young boy I ran into the city to find the love of my life. When I was a young boy my father took me into the city to see a marching band. He said son when you grow up a fire lead me to the broken to see the marching band. He said son when you grow up a fire to lead me into the city to see a marching band. Son when you grow up a fire to lead e to the broken to see a marching band. I hate everything about you why do Iiiiiii love you.
                    </DialogContentText>
                    {dashboardData?.Team ? (
                        <DialogActions>
                            <Button href={`/environment/${dashboardData?.Team}/${user.username}`}>Coding Environment</Button>
                        </DialogActions>
                    ) : (
                        <DialogActions>
                            <Button>Join a Team to Access Environment</Button>
                        </DialogActions>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Labs;