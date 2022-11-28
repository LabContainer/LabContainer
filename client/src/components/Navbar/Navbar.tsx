import React, { useContext } from "react";
import "./Navbar.css";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App/AuthContext";
import { Settings } from "@mui/icons-material";
import Logo from '../../static/Cube.png';

const api_url = "http://localhost:5000";

async function logoutUser(refresh_token: string) {
  const response = await fetch(`${api_url}/webapp/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refresh_token}`,
    },
  });
  if (response.ok) {
    return true;
  }
  return false;
}

function Navbar() {
  const navigate = useNavigate();
  const { token, refresh_token, setToken, setRefreshToken } =
    useContext(AuthContext);
  return (
    <div>
      <h1 className="nav-header">
        <Grid container spacing={3}>
          <Grid className="nav-logo" item xs={5}>
            <img className="nav-logo-size" src={Logo} />
          </Grid>
          <Grid item xs={3}>
            <div className="nav-title">
              Lab Container
            </div>
          </Grid>
          <Grid item xs={4}>
            {!!token ? (
              <Grid container spacing={1}>
                <Grid className="dashboard-navbar" item xs={10}>
                    <Button variant="outlined" onClick={() => {
                      navigate("/dashboard");
                    }} sx={{backgroundColor: 'white', borderRadius: '10px', "&:hover": {background: "white"}}} size="medium">Dashboard</Button>
                </Grid>
                <Grid item xs={2}>
                  <Button variant="outlined" onClick={() => {
                        logoutUser(refresh_token);
                        setToken("");
                        setRefreshToken("");
                        navigate("/dashboard");
                      }} sx={{backgroundColor: 'white', borderRadius: '10px', "&:hover": {background: "white"}}} size="medium">Logout</Button>
                </Grid>
              </Grid>
            ) :
              ( <div className="nav-sign-in">
                  <Button variant="outlined" onClick={() => {
                    navigate("/login");
                  }} sx={{backgroundColor: 'white', borderRadius: '10px', "&:hover": {background: "white"}}} size="medium">Sign In</Button>
                </div>
              )}
          </Grid>
        </Grid>
      </h1>
    </div>
  );
}
// TODO: Make Dashboard Button
export default Navbar;
