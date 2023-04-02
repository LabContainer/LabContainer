import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container, CircularProgress } from "@mui/material";
import useAPI from '../../api';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();
  const location  =  useLocation();
  const searchParams = new URLSearchParams(location.search)
  const resetToken = searchParams.get('token')

  const  {WebappApi} = useAPI()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      if(resetToken === null)
        throw new Error("Invalid token");
      const storerToken = WebappApi.httpRequest.config.TOKEN
      WebappApi.httpRequest.config.TOKEN = (resetToken)
      await WebappApi.webappReset({
        username: username,
        newPassword: password,
      }).then(() => {
        setLoading(false);
        setComplete(true);
      });
      WebappApi.httpRequest.config.TOKEN = storerToken;
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(String(error));
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>Reset Password</Typography>
        {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
        {complete ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography color="success">Password changed successfully!</Typography>
            <CircularProgress sx={{ marginTop: 2 }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>

            <TextField
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="New Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              variant="outlined"
              margin="normal"
              type="password"
              required
              fullWidth
            />
            <TextField
              label="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              variant="outlined"
              margin="normal"
              type="password"
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
};

export default ResetPassword;
