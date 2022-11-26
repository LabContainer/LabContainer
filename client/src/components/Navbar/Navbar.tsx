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
          <Grid className="nav-sign-in" item xs={4}>
            <Button variant="outlined" sx={{backgroundColor: 'white', borderRadius: '10px', "&:hover": {background: "white"}}} size="medium">Sign In</Button>
          </Grid>
        </Grid>
      </h1>
      <ul className="nav">
        {!!token ? (
          <>
            <li
              className="nav-item"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </li>
            <IconButton
              color="error"
              className="notifications"
              style={{ margin: "8px", float: "right" }}
            >
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              color="error"
              className="notifications"
              style={{ margin: "8px", float: "right" }}
            >
              <Settings />
            </IconButton>
            <li
              className="nav-item"
              onClick={() => {
                if (token) {
                  logoutUser(refresh_token);
                  setToken("");
                  setRefreshToken("");
                  navigate("/dashboard");
                }
              }}
            >
              Logout
            </li>
          </>
        ) : null}
      </ul>
    </div>
  );
}

export default Navbar;
