import "./TeamCard.css";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import { DashBoardData } from "./LabCard";

function TeamCard() {
    return (
        <div className="team-card">
            <Card sx={{ height: 70 }} variant="outlined">
                <CardContent>
                    <Grid container spacing={0} className="team-card-content">
                        <Grid item xs={1}>
                            <GroupIcon className="group-image" color="primary"></GroupIcon>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography className="team-title">
                                Team A
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography className="team-title">
                                Sam
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography className="team-title">
                                Sowrov
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography className="team-title">
                                Ani
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default TeamCard;