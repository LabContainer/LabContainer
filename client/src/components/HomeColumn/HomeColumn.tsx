import { Button, Box, TextField, Grid } from "@mui/material";
import "./HomeColumn.css";
import Team from '../../static/Engineer_Team.png';
import Elipse from '../../static/Engineer_Team_Elipse.png';

function HomeColumn({children} : { children: any}) {
    return (
        <Grid container spacing={0}>
            <Grid item xs={6} container className="home-column-left" justifyContent="flex-end">
                <Box sx={{
                    width: 706,
                    height: 843,
                    backgroundColor: 'white',
                }}>
                    {children}
                </Box>
            </Grid>
            <Grid item xs={6} className="home-column-image">
                <Box sx={{
                    width: 706,
                    height: 843,
                    backgroundColor: '#243E6B'
                }}>
                    <div className="image_container">
                        <img className="engineer-elipse" src={Elipse}/>
                        <img className="engineer-image" src={Team}/>
                    </div>
                </Box>
            </Grid>
        </Grid>
    );
}

export default HomeColumn;