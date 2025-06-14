import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./component/landing.jsx";
import WarrantyDashboard from "./component/dashboard.jsx";
import "./styles/app.css";
import Login from "./component/login.jsx";
import Signup from "./component/signup.jsx";
import ForgotPassword from "./component/forgotPass.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<WarrantyDashboard />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
