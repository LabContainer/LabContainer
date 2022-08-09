import React from "react";
import './Navbar.css'
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from "react-router-dom";
import useToken from "../App/useToken";


function Navbar(){
    const navigate = useNavigate()
    const {setToken} = useToken()
    return <>
        <h1 className="nav-header">Lab Capture</h1>
        <ul className="nav">
        <li className="nav-item" onClick={() => { navigate('/dashboard')} }>Dashboard</li>
        <li className="nav-item" onClick={() => { navigate('/environment')} }>Current Lab</li>
        <IconButton color="error" className="notifications"  style={ { margin: "8px", float: "right"}}>
            <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
            </Badge>
        </IconButton>
        <li className="nav-item" onClick={ () => { 
            setToken("")
            navigate("/dashboard")
            window.location.reload()
        }}>Logout</li>
        </ul>
    </>
}

export default Navbar;