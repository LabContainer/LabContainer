import * as React from "react";
import { Button, Box, TextField, Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import "./home.css";
import HomeColumn from "../../components/HomeColumn/HomeColumn";
import { AuthContext } from "../../components/App/AuthContext";
import useApi from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageContainer, errorMessage } from "../../components/App/message";


function Home() {
    const [failedMsg, setFailedMsg] = React.useState("");
    const { setToken, setRefreshToken } = React.useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { WebappApi } = useApi();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const data = new FormData(event.currentTarget);
        const username = data.get("username") as string;
        const password = data.get("password") as string;
        if (username !== null && password !== null) {
            try {
                const tokens = await WebappApi.webappLogin({
                username,
                password,
                });

                if (tokens !== undefined) {
                const { access_token, refresh_token: new_refresh_token } = tokens;
                setToken(access_token as string);
                setRefreshToken(new_refresh_token as string);
                if (location.pathname === "/login") {
                    // Redirect user to hashboard from login on success
                    navigate("/dashboard");
                }
                } else {
                setFailedMsg("Incorrect username/password , please try again");
                }
            } catch (error) {
                console.log(error);
                errorMessage("Incorrect username/password , please try again");
            }
        }
    };

    return (
        <HomeColumn>
            < MessageContainer />
            <Typography>{failedMsg}</Typography>    
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <div className="home-form-title">
                    Sign In
                </div>
                <div className="home-textfield">
                    <TextField required id="username" name="username" label="Username" variant="outlined" fullWidth={true} />
                </div>
                <div className="home-textfield">
                    <TextField required name="password" label="Password" type="password" id="password" variant="outlined" fullWidth={true} />
                </div>
                <div className="home-form-button">
                    <Button type="submit" variant="contained" color="inherit" fullWidth={true} sx={{ fontSize: '1rem', backgroundColor: '#243E6B', borderRadius: '10px', "&:hover": {background: "#243E6B"}}} size="large">Sign In</Button>
                </div>
            </Box>
            <div className="home-form-button create-account">
                <Button href="/signup" variant="contained" color="inherit" fullWidth={true} sx={{fontSize: '1rem', backgroundColor: '#243E6B', borderRadius: '10px', "&:hover": {background: "#243E6B"}}} size="large">Create Account</Button>
            </div>
            <Link sx={{padding: "0% 0% 0% 14%"}} href="/forgotpassword" variant="body2">
                    {"Forgot password?"}
            </Link>
            { failedMsg }
        </HomeColumn>
    );
}

export default Home;