import * as React from "react";
import { Button, TextField, Box, Checkbox, FormControlLabel } from "@mui/material";
import "./CreateAccount.css";
import HomeColumn from "../../components/HomeColumn/HomeColumn";
import { useNavigate } from "react-router-dom";
import useApi from "../../api";
import { MessageContainer, errorMessage } from "../../components/App/message";

function CreateAccount() {
    const [failedAttempt, setFailedAttempt] = React.useState(false);
    const navigate = useNavigate();
    const { UserApi } = useApi();
    let failMsg;
    if (failedAttempt) {
      failMsg = "Unable to create account. Please try again.";
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get("email") as string;
      const username = data.get("username") as string;
      const password = data.get("password") as string;
      const is_student = !!data.get("isStudent");
      try {
        if (username && password && email) {
            const success = await UserApi.usersCreateUser({
              email,
              username,
              password,
              is_student,
            });
            setFailedAttempt(false);
            navigate("/login");
          }
      } catch (error) {
        setFailedAttempt(true);
        errorMessage("Unable to create account. Please try again.");
      }
      
    };

    
    return (
        <HomeColumn>
            < MessageContainer />
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <div className="create-form-title">
                    Create Account
                </div>
                <div className="create-form-textfield">
                    <TextField required id="username" name="username" label="Username" variant="outlined" fullWidth={true} />
                </div>
                <div className="create-form-textfield child">
                    <TextField required id="email" name="email" label="Email Address" variant="outlined" fullWidth={true} />
                </div>
                <div className="create-form-textfield child">
                    <TextField required id="password" name="password" type="password" label="Password" variant="outlined" fullWidth={true} />
                </div>
                <div className="create-form-textfield child">
                    <TextField required id="outlined-basic" type="password" label="Confirm Password" variant="outlined" fullWidth={true} />
                </div>
                <div className="create-form-textfield child">
                    <FormControlLabel control={<Checkbox name="isStudent" color="primary" />} label="I am a Student" />
                </div>
                <div className="create-form-button">
                    <Button type="submit" variant="contained" color="inherit" fullWidth={true} sx={{ fontSize: '1rem', backgroundColor: '#243E6B', borderRadius: '10px', "&:hover": {background: "#243E6B"}}} size="large">Create Account</Button>
                </div>
                { failedAttempt ? <div className="create-form-error">{failMsg}</div> : null }
            </Box>
        </HomeColumn>
    );
}

export default CreateAccount;