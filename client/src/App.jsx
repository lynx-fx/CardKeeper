import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./component/landing.jsx";
import WarrantyDashboard from "./component/dashboard.jsx";
import "./styles/app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<WarrantyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
