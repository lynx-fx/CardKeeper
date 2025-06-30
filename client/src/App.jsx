import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import Landing from "./component/landing.jsx";
import WarrantyDashboard from "./component/dashboard.jsx";
import "./styles/app.css";
import Login from "./component/login.jsx";
import Signup from "./component/signup.jsx";
import ForgotPassword from "./component/forgotPass.jsx";
import ResetPassword from "./component/resetPassword.jsx";
import ChangePassword from "./component/changePassword.jsx";
import NotFound from "./component/notFound.jsx";

function App() {
  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(!!getCookie("auth"));

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Landing />
            }
          />
          {/* <Route
            path="/dashboard"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" replace />
              ) : (
                <WarrantyDashboard />
              )
            }`
          /> */}
          {/* <Route path="/" element={<Landing />} /> */}
          <Route path="/dashboard" element={<WarrantyDashboard />} />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
