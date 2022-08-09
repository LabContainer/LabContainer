import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Login.css'

const api_url = 'http://localhost:5000'

async function loginUser(username: string, password: string){
  const response = await fetch(`${api_url}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  if(response.ok){
    const json = await response.json()
    return json.access_token
  } else {
    return undefined
  }
}

export default function Login({ setToken } : { setToken : (token: string) => void}){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [failedAttempt, setFailedAttempt] = useState(false)

    const handleSubmit : React.FormEventHandler<HTMLFormElement> = async e => {
      e.preventDefault();
      const token = await loginUser(username, password);
      if(token !== undefined)
        setToken(token)
      else {
        setFailedAttempt(true)
      }
    }
    let failedMsg;
    if(failedAttempt){ 
      failedMsg = <p>Incorrect username/password , please try again</p>
    }
    return <>
      <div className="login-container">
        <h1>Please Log in</h1>
          { failedMsg }
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <p>Username</p>
            <input type="text" onChange={ e => setUsername(e.target.value)}/>
          </label>
          <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
          </label>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
        <label>
          <p>New User? </p>
          <button type="button" onClick={ () => { navigate('/signup')}}>Create Account</button>
        </label>
      </div>
    </>
}