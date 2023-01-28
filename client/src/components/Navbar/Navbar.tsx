import { useContext } from "react";
import "./Navbar.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App/AuthContext";
import Logo from "../../static/Cube.png";

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
    // <div style={{ height: "100%" }}>
    <div className="nav-header">
      <div className="nav-logo">
        <img className="nav-logo-size" src={Logo} />
      </div>
      <div className="nav-title">Lab Container</div>
      {!!token ? (
        <>
          <div className="dashboard-navbar">
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/dashboard");
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                "&:hover": { background: "white" },
              }}
              size="medium"
            >
              Dashboard
            </Button>
          </div>
          <div className="logout-navbar">
            <Button
              variant="outlined"
              onClick={() => {
                logoutUser(refresh_token);
                setToken("");
                setRefreshToken("");
                navigate("/dashboard");
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                "&:hover": { background: "white" },
              }}
              size="medium"
            >
              Logout
            </Button>
          </div>
        </>
      ) : (
        <div className="nav-sign-in">
          <Button
            variant="outlined"
            onClick={() => {
              navigate("/login");
            }}
            sx={{
              backgroundColor: "white",
              borderRadius: "10px",
              "&:hover": { background: "white" },
            }}
            size="medium"
          >
            Sign In
          </Button>
        </div>
      )}
      {/* </div> */}
      {/* </div> */}
    </div>
  );
}
// TODO: Make Dashboard Button
export default Navbar;
