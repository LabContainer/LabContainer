import React from 'react';
import './App.css';


import Navbar from './components/Navbar/Navbar';

import Dashboard from './pages/Dashboard/Dashboard';
import Environment from './pages/Environment/Environment';
import Login from './pages/Login/Login';

import {Navigate, Route, Routes} from 'react-router-dom'
import useToken from './components/App/useToken';
import Signup from './pages/Signup/Signup';


function App() {
  const {token, setToken} = useToken()
  console.log(token)
  if(!token){
    return <>
    <Navbar />
      <Routes>
        <Route path='/signup' element={ <Signup />} />
        <Route  path='/*' element={ <Login setToken={setToken}/>} />
      </Routes>
    </>
  }
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/dashboard' element={ <Dashboard />} />
        <Route path='/login' element={ <Login setToken={setToken}/>} />
        <Route path='/environment' element={ <Environment />} />
        <Route path='/signup' element={ <Signup />} />
        <Route
          path="*"
          element={<Navigate to="/dashboard" />}
        />
      </Routes>
    </div>
  );
}

export default App;
