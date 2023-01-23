import "./LabCard.css";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';

function NotificationCard() {
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
                                Assignment A
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default NotificationCard;