import { useState } from "react";
import { Button, TextField } from "@mui/material";
import "./ForgotPassword.css";
import Logo from '../../static/Cube.png';
import HomeColumn from "../../components/HomeColumn/HomeColumn";
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailString = String(email);
    const usernameString = String(username);
    console.log(emailString, usernameString);
    
    try {
      const response = await axios.post('http://localhost:5000/webapp/passReset', { username: usernameString, email: emailString });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <HomeColumn>
      <div style={{ marginTop: "110px" }} className="forgot-form-title">
        Forgot Password
      </div>
      <div className="forgot-form-description">
        Please enter the email and username associated with this account, you will receive a link to reset your password.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="forgot-form-textfield">
          <TextField id="outlined-basic-email" label="Email Address" variant="outlined" fullWidth={true} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="forgot-form-textfield">
          <TextField id="outlined-basic-username" label="Username" variant="outlined" fullWidth={true} value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="forgot-form-button">
          <Button type="submit" variant="contained" color="inherit" fullWidth={true} sx={{ fontSize: '1rem', backgroundColor: '#243E6B', borderRadius: '10px', "&:hover": {background: "#243E6B"}}} size="large">Submit</Button>
        </div>
      </form>
      <div className="forgot-form-button create-account">
        <Button variant="contained" color="inherit" fullWidth={true} sx={{fontSize: '1rem', backgroundColor: '#243E6B', borderRadius: '10px', "&:hover": {background: "#243E6B"}}} size="large">Create Account</Button>
      </div>
    </HomeColumn>
  );
}

export default ForgotPassword;
