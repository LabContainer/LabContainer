import React from 'react';
import './App.css';


import Navbar from './components/Navbar/Navbar';

import Dashboard from './pages/Dashboard/Dashboard';
import Environment from './pages/Environment/Environment';
import Login from './pages/Login/Login';

import {BrowserRouter, Route, Routes} from 'react-router-dom'
import useToken from './components/App/useToken';


function App() {
  const {token, setToken} = useToken()

  if(!token){
    return <>
    <Navbar />
    <Login setToken={setToken} />
    </>
  }
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Dashboard />} />
          <Route path='/login' element={ <Login setToken={setToken}/>} />
          <Route path='/env' element={ <Environment />} />
      
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
