import "./TeamCard.css";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import { DashBoardData } from "./LabCard";

function TeamCard({ data, key }: {data: DashBoardData, key: number}) {
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
                                {data.Team}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            {data.Team_Users?.map((d) => (   
                                <Typography className="team-title">
                                    {d.name}
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default TeamCard;