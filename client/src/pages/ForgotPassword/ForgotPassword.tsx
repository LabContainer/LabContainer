import { Button, Box, TextField, Grid } from "@mui/material";
import "./ForgotPassword.css";
import Logo from '../../static/Cube.png';
import HomeColumn from "../../components/HomeColumn/HomeColumn";

function ForgotPassword() {
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
            <div style={{ marginTop: "110px" }} className="forgot-form-title">
                Forgot Password
            </div>
            <div className="forgot-form-description">
                Please enter the email associated with this account, you will receive a link to reset your password.
            </div>
            <div className="forgot-form-textfield">
                <TextField id="outlined-basic" label="Email Address" variant="outlined" fullWidth={true} />
            </div>
            <div className="forgot-form-button">
                <Button variant="contained" color="inherit" fullWidth={true} sx={{ fontSize: '1rem', backgroundColor: '#243E6B', borderRadius: '10px', "&:hover": {background: "#243E6B"}}} size="large">Submit</Button>
            </div>
            <div className="forgot-form-button create-account">
                <Button variant="contained" color="inherit" fullWidth={true} sx={{fontSize: '1rem', backgroundColor: '#243E6B', borderRadius: '10px', "&:hover": {background: "#243E6B"}}} size="large">Create Account</Button>
            </div>
        </HomeColumn>
    );
}

export default ForgotPassword;