import React from 'react';
import './App.css';


import Navbar from './components/Navbar/Navbar';

import Dashboard from './pages/Dashboard/Dashboard';
import Environment from './pages/Environment/Environment';
import Login from './pages/Login/Login';

import {BrowserRouter, Route, Routes} from 'react-router-dom'
import useToken from './components/App/useToken';
import Signup from './pages/Signup/Signup';


function App() {
  const {token, setToken} = useToken()

  if(!token || token === undefined){
    return <>
    <Navbar />
    <BrowserRouter>
        <Routes>
          <Route path='/signup' element={ <Signup />} />
          <Route  path='*' element={ <Login setToken={setToken}/>} />
        </Routes>
      </BrowserRouter>
    </>
  }
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={ <Dashboard />} />
          <Route path='/login' element={ <Login setToken={setToken}/>} />
          <Route path='/env' element={ <Environment />} />
          <Route path='/signup' element={ <Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
