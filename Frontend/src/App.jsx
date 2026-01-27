import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Form from './Form';
import View from './View';
import Navbar from './Navbar';
import Features from './Features.jsx';
import HowItWorks from './HowItWorks.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Index from './Dashboard/pages/Index.jsx';
import StudentDashboard from './Dashboard/pages/StudentDashboard.jsx';
import Admin from './Admin.jsx';
import AdminFaculty from './AdminFaculty.jsx';
import AdminStudent from './AdminStudent.jsx';
const App=()=>{
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/form" element={<ProtectedRoute role="faculty"><Form /></ProtectedRoute>} />
        <Route path="/view" element={<ProtectedRoute role="faculty"><View /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute role="faculty"><Index /></ProtectedRoute>} />
        <Route path="/dashboard/student/:studentId" element={<ProtectedRoute role="faculty"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
        <Route path="/admin/faculty" element={<ProtectedRoute role="admin"><AdminFaculty /></ProtectedRoute>} />
        <Route path="/admin/student" element={<ProtectedRoute role="admin"><AdminStudent /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App