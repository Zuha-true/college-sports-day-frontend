// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import API_URL from '../config';

const sports = [
  { name: 'cricket', label: 'Cricket', icon: '🏏' },
  { name: 'throwball', label: 'Throwball', icon: '⚡' },
  { name: 'kho_kho', label: 'Kho-Kho', icon: '🏃' },
  { name: 'badminton_doubles', label: 'Badminton Doubles', icon: '🏸' },
  { name: 'relay', label: 'Relay', icon: '🏃‍♂️' },
  { name: 'tug_of_war', label: 'Tug of War', icon: '💪' }
];

function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    sportStats: {}
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      const students = response.data;
      
      const sportStats = {};
      sports.forEach(sport => {
        sportStats[sport.name] = students.filter(s => s[sport.name]).length;
      });

      setStats({
        totalStudents: students.length,
        sportStats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <h1>Admin Dashboard</h1>
        <div className="nav-buttons">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/register')}
          >
            Register Students
          </button>
          <button 
            className="btn btn-outline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-card">
          <h2>Total Students Registered</h2>
          <div className="stat-number">{stats.totalStudents}</div>
        </div>

        <div className="sports-management">
          <h2>Manage Sports</h2>
          <div className="sports-grid">
            {sports.map(sport => (
              <div 
                key={sport.name}
                className="sport-card clickable"
                onClick={() => navigate(`/admin/sport/${sport.name}`)}
              >
                <span className="sport-icon">{sport.icon}</span>
                <h3>{sport.label}</h3>
                <p className="participant-count">
                  {stats.sportStats[sport.name] || 0} participants
                </p>
                <button className="btn btn-sm btn-primary">
                  Manage →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;