import { Button, Box, TextField, Grid } from "@mui/material";
import "./ForgotPassword.css";
import Logo from '../../static/Cube.png';
import HomeColumn from "../../components/HomeColumn/HomeColumn";

function ForgotPassword() {
    return (
        <HomeColumn>
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