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
                    new Date(String(d.data.TimeLeft)) > new Date() &&
                    <div key={d.id} onClick={()=>handleClick(d.data)}>
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
                        data.map((d) => 
                        new Date(String(d.data.TimeLeft)) < new Date() &&
                        <LabCard
                            data={d.data}
                            key={d.id}
                        />
                    )
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
                        {dashboardData?.Description}
                    </DialogContentText>
                </DialogContent>
                {dashboardData?.Team ? (
                        <DialogActions>
                            <Button href={`/environment/${dashboardData?.Team}/${user.username}`}>Coding Environment</Button>
                        </DialogActions>
                    ) : (
                        <DialogActions>
                            <Button>Join a Team to Access Environment</Button>
                        </DialogActions>
                    )}
            </Dialog>
        </div>
    );
}

export default Labs;