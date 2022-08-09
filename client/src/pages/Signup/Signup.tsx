import React, { useState } from "react";

import './Signup.css'

const api_url = 'http://localhost:5000'

async function createUser(username: string, password: string, email: string, is_student: boolean){
  const response = await fetch(`${api_url}/create-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
      email,
      is_student
    })
  })
  return response.ok
}

export default function Signup(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isStudent, setIsStudent] = useState(false)
    
    const [failedAttempt, setFailedAttempt] = useState(false)

    const handleSubmit : React.FormEventHandler<HTMLFormElement> = async e => {
      e.preventDefault();
      const success = await createUser(username, password, email, isStudent)
      setFailedAttempt(!success)
    }
    let failMsg ;
    if(failedAttempt){
      failMsg = <p>Invalid data</p>
    }
    return <>
      <div className="signup-container">
        <h1>Create an account</h1>
          {failMsg}
        <form className="signup-form" onSubmit={handleSubmit}>
          <label>
            <p>Username</p>
            <input type="text" onChange={ e => setUsername(e.target.value)}/>
          </label>
          <label>
            <p>Email</p>
            <input type="email" onChange={ e => setEmail(e.target.value)}/>
          </label>
          <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)} checked/>
          </label>
          <div >
            <p style={ { float: "left", marginTop: "8%", marginBottom: "8%"} }>Student ? </p>
            <input style={ { marginLeft: "50%", marginTop: "11%", marginBottom: "11%"} } type="checkbox" onChange={e => setIsStudent(e.target.checked)}/>
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </>
}