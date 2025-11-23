// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EntryPage from './pages/EntryPage';
import AdminLogin from './pages/AdminLogin';
import StudentView from './pages/StudentView';
import AdminDashboard from './pages/AdminDashboard';
import RegisterStudents from './pages/RegisterStudents';
import SportManagement from './pages/SportManagement';
import './styles/App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route 
            path="/admin/login" 
            element={
              isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleAdminLogin} />
            } 
          />
          <Route path="/student" element={<StudentView />} />
          <Route 
            path="/admin/dashboard" 
            element={
              isAdmin ? <AdminDashboard onLogout={handleAdminLogout} /> : <Navigate to="/admin/login" />
            } 
          />
          <Route 
            path="/admin/register" 
            element={
              isAdmin ? <RegisterStudents onLogout={handleAdminLogout} /> : <Navigate to="/admin/login" />
            } 
          />
          <Route 
            path="/admin/sport/:sportName" 
            element={
              isAdmin ? <SportManagement onLogout={handleAdminLogout} /> : <Navigate to="/admin/login" />
            } 
          />
          <Route 
            path="/student/sport/:sportName" 
            element={<StudentView />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;