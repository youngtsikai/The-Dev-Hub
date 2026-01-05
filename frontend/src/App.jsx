// import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import Dashboard from "./Pages/Dashboard";
import MainLayout from "./Layouts/MainLayout";
import Analytics from "./Pages/Analytics";
import Leaderboard from "./Pages/Leaderboard";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* Routes without the main header */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Routes with the main header */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/performance" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/starred" element={<Dashboard />} />
          <Route path="/achievements" element={<Dashboard />} />
          <Route path="/settings/account" element={<Dashboard />} />
          <Route path="/settings/appearance" element={<Dashboard />} />
          <Route path="/settings/notifications" element={<Dashboard />} />
          <Route path="/settings/privacy" element={<Dashboard />} />
          <Route path="/support" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </div>
  );
}

export default App;
