import "./LabCard.css";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

// If time left = 0 put it in past labs
interface User {
    name: string
}

export interface DashBoardData {
    LabName: string;
    Description: string;
    Course: string;
    Progress: number;
    Instructor: string;
    TimeLeft: string;
    Team?: string;
    Team_Users?: User[];
    id: string;
  }

function LabCard({ data, key }: {data: DashBoardData, key: number}) {
    return (
        <div className="lab-card">
            <Card sx={{ height: 70 }} variant="outlined">
                <CardContent>
                    <Grid container spacing={0} className="lab-card-content">
                        <Grid item xs={1}>
                            <UploadFileIcon className="file-image" color="primary"></UploadFileIcon>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography className="lab-title">
                                {data.LabName}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default LabCard;