import React, { useState } from "react";

import './Login.css'

const api_url = 'http://localhost:5000'

async function loginUser(username: string, password: string){
  return fetch(`${api_url}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  }).then(data => data.json()).then(data => data.access_token)
}

export default function Login({ setToken } : { setToken : (token: string) => void}){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    
    const handleSubmit : React.FormEventHandler<HTMLFormElement> = async e => {
      e.preventDefault();
      const token = await loginUser(username, password);
      setToken(token)
    }
    
    return <>
      <div className="login-container">
        <h1>Please Log in</h1>
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
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
}