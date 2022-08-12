import React from "react";
import './Navbar.css'
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from "react-router-dom";
import useToken from "../App/useToken";

const api_url = 'http://localhost:5000'

async function logoutUser(token: string){
  const response = await fetch(`${api_url}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if(response.ok){
    console.log('Logout')
    return true
  }
  return false
}

function Navbar(){
    const navigate = useNavigate()
    const {token, setToken} = useToken()
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
            if(token){
                logoutUser(token)
                setToken("")
                navigate("/dashboard")
                window.location.reload()
            }
        }}>Logout</li>
        </ul>
    </>
}

export default Navbar;