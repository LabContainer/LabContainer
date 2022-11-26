import { Button, Box, TextField, Grid } from "@mui/material";
import "./home.css";
import Logo from '../../static/Cube.png';
import HomeColumn from "../../components/HomeColumn/HomeColumn";

function Home() {
    return (
        <HomeColumn>
            {/* <Grid container spacing={2}>
                <Grid item xs={3}>
                    <img className="forgot-logo" src={Logo}/>
                </Grid>
                <Grid item xs={9}>
                    <div className="forgot-title">
                        Lab Container
                    </div>
                </Grid>
            </Grid> */}
            <div className="home-form-title">
                Sign In
            </div>
            <div className="home-textfield">
                <TextField id="outlined-basic" label="Username" variant="outlined" fullWidth={true} />
            </div>
            <div className="home-textfield">
                <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth={true} />
            </div>
            <div className="home-form-button">
                <Button variant="contained" color="inherit" fullWidth={true} sx={{ fontSize: '1rem', backgroundColor: '#243E6B', borderRadius: '10px', "&:hover": {background: "#243E6B"}}} size="large">Sign In</Button>
            </div>
            <div className="home-form-button create-account">
                <Button variant="contained" color="inherit" fullWidth={true} sx={{fontSize: '1rem', backgroundColor: '#243E6B', borderRadius: '10px', "&:hover": {background: "#243E6B"}}} size="large">Create Account</Button>
            </div>
        </HomeColumn>
    );
}

export default Home;