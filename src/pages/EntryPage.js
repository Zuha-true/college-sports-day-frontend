// frontend/src/pages/EntryPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function EntryPage() {
  const navigate = useNavigate();

  return (
    <div className="entry-page">
      <div className="hero-section">
        <h1>AITM Sports Day</h1>
        <h2 className="year">2025</h2>
        <p className="tagline">Compete. Conquer. Celebrate Victory.</p>
        
        <div className="entry-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/student')}
          >
            Continue as Student
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/login')}
          >
            Admin Sign In
          </button>
        </div>
      </div>

      <div className="sports-section">
        <h2>Featured Sports</h2>
        <div className="sports-grid">
          <div className="sport-card">
            <span className="sport-icon">🏏</span>
            <h3>Cricket</h3>
          </div>
          <div className="sport-card">
            <span className="sport-icon">⚡</span>
            <h3>Throwball</h3>
          </div>
          <div className="sport-card">
            <span className="sport-icon">🏃</span>
            <h3>Kho-Kho</h3>
          </div>
          <div className="sport-card">
            <span className="sport-icon">🏸</span>
            <h3>Badminton Doubles</h3>
          </div>
          <div className="sport-card">
            <span className="sport-icon">🏃‍♂️</span>
            <h3>Relay</h3>
          </div>
          <div className="sport-card">
            <span className="sport-icon">💪</span>
            <h3>Tug of War</h3>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Join the Competition?</h2>
        <p>Register for your favorite sports and be part of the action!</p>
      </div>
    </div>
  );
}

export default EntryPage;