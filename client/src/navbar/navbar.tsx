import React from "react";
import './navbar.css'

function NavBar(){
    return <>
        <h1 className="nav-header">Lab Capture</h1>
        <ul className="nav">
        <li className="nav-item">Home</li>
        <li className="nav-item">Labs</li>
        <li className="nav-item">About</li>
        </ul>
    </>
}

export default NavBar;