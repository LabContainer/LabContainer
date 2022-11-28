import { Grid } from "@mui/material";
import "./HomeColumn.css";
import Team from '../../static/Engineer_Team.png';
import Elipse from '../../static/Engineer_Team_Elipse.png';

function HomeColumn({children} : { children: any}) {
    return (
        <Grid container spacing={0}>
            <Grid item xs={6} container className="home-column" justifyContent="flex-end">
                <div className="home-box left">
                    {children}
                </div>
            </Grid>
            <Grid item xs={6} container className="home-column">
                <div className="home-box right">
                    <img className="engineer-elipse" src={Elipse}/>
                    <img className="engineer-image" src={Team}/>
                </div>
            </Grid>
        </Grid>
    );
}

export default HomeColumn;