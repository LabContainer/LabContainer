import "./NotificationCard.css";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import File from '../../static/File.png';

function NotificationCard() {
    return (
        <div className="notification-card">
            <Card sx={{ height: 70 }} variant="outlined">
                <CardContent>
                    <Grid container spacing={0} className="notification-card-content">
                        <Grid item xs={1}>
                            <img className="notification-file-image" src={File}></img>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography className="notification-title">
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