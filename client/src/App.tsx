import React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Environment from "./pages/Environment/Environment";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/home";

import { Navigate, Route, Routes } from "react-router-dom";
import useToken from "./components/App/useToken";
import { AuthContext } from "./components/App/AuthContext";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import CreateAccount from "./pages/CreateAccount/CreateAccount";

function App() {
  const { token, refresh_token, setToken, setRefreshToken, user } = useToken();
  return (
    <AuthContext.Provider
      value={{ token, refresh_token, setToken, setRefreshToken, user }}
    >
      <div className="App">
        <Navbar />
        {!!token ? (
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/environment/:team/:user" element={<Environment />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/signup" element={<CreateAccount />} />
            <Route path="Home" element={<Home />} />
            <Route path="/*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
