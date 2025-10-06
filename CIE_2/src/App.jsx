import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const Dashboard = React.lazy(() => import("./pages/Dashboard.jsx"));
const Login = React.lazy(() => import("./pages/Login.jsx"));
const Signup = React.lazy(() => import("./pages/Signup.jsx"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<React.Suspense fallback={<div>Loading...</div>}><Signup /></React.Suspense>} />
        <Route path="/login" element={<React.Suspense fallback={<div>Loading...</div>}><Login /></React.Suspense>} />
        <Route path="/dashboard" element={<React.Suspense fallback={<div>Loading Dashboard...</div>}><Dashboard /></React.Suspense>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;