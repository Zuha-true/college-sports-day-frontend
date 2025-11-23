// frontend/src/pages/SportManagement.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeamBuilder from '../components/TeamBuilder';
import TournamentBracket from '../components/TournamentBracket';

import API_URL from '../config';

const sportLabels = {
  cricket: 'Cricket',
  throwball: 'Throwball',
  kho_kho: 'Kho-Kho',
  badminton_doubles: 'Badminton Doubles',
  relay: 'Relay',
  tug_of_war: 'Tug of War'
};

function SportManagement({ onLogout }) {
  const { sportName } = useParams();
  const [activeTab, setActiveTab] = useState('teams');
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, [sportName]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_URL}/teams/${sportName}`);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <button onClick={() => navigate('/admin/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>{sportLabels[sportName]}</h1>
        <button onClick={onLogout} className="btn btn-outline">
          Logout
        </button>
      </nav>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Team Builder
        </button>
        <button
          className={`tab ${activeTab === 'bracket' ? 'active' : ''}`}
          onClick={() => setActiveTab('bracket')}
        >
          Tournament Bracket
        </button>
      </div>

      <div className="page-content">
        {activeTab === 'teams' ? (
          <TeamBuilder sport={sportName} teams={teams} onTeamsUpdate={fetchTeams} />
        ) : (
          <TournamentBracket sport={sportName} teams={teams} />
        )}
      </div>
    </div>
  );
}

export default SportManagement;