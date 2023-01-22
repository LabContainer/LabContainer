import "./LabCard.css";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import File from '../../static/File.png';

function LabCard() {
    return (
        <div className="lab-card">
            <Card sx={{ height: 70 }} variant="outlined">
                <CardContent>
                    <Grid container spacing={0} className="lab-card-content">
                        <Grid item xs={1}>
                            <img className="file-image" src={File}></img>
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

export default LabCard;