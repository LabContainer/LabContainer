import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Environment from './pages/Environment/Environment';
import Login from './pages/Login/Login';

import {Navigate, Route, Routes} from 'react-router-dom'
import useToken from './components/App/useToken';
import Signup from './pages/Signup/Signup';
import { AuthContext } from './components/App/AuthContext';


function App() {
  const {token, refresh_token, setToken, setRefreshToken} = useToken()
  return (
    <AuthContext.Provider value={{token, refresh_token,setToken, setRefreshToken}}>

    <div className="App">
      <Navbar />
      { !!token ? 
      <Routes>
        <Route path='/dashboard' element={ <Dashboard/>} />
        <Route path='/environment' element={ <Environment />} />
        <Route
          path="*"
          element={<Navigate to="/dashboard" />}
        />
      </Routes>
      :
      <Routes>
        <Route path='/login' element={ <Login/>} />
        <Route path='/signup' element={ <Signup />} />
        <Route  path='/*' element={ <Navigate to="/login" />} />
      </Routes>
      }
    </div>
    </AuthContext.Provider>
  );
}

export default App;
