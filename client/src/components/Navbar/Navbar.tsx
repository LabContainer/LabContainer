import React, { useContext } from "react";
import "./Navbar.css";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App/AuthContext";
import { Settings } from "@mui/icons-material";

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
    <>
      <h1 className="nav-header">Lab Capture</h1>
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
    </>
  );
}

export default Navbar;
