// frontend/src/components/TeamBuilder.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import API_URL from '../config';

function TeamBuilder({ sport, teams, onTeamsUpdate }) {
  const [availableStudents, setAvailableStudents] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    fetchAvailableStudents();
    
    // Auto-refresh every 5 seconds
    refreshIntervalRef.current = setInterval(() => {
      fetchAvailableStudents();
    }, 5000);
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [sport, teams]);

  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students/by-sport/${sport}`);
      setAvailableStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }

    try {
      await axios.post(`${API_URL}/teams`, {
        team_name: teamName,
        sport: sport,
        members: selectedStudents
      });

      setSuccess('Team created successfully!');
      setTeamName('');
      setSelectedStudents([]);
      onTeamsUpdate();
      fetchAvailableStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create team');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await axios.delete(`${API_URL}/teams/${teamId}`);
        onTeamsUpdate();
        fetchAvailableStudents();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  return (
    <div className="team-builder">
      <div className="builder-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <h2>Create New Team</h2>
           <button 
            className="btn btn-sm btn-secondary"
             onClick={() => fetchAvailableStudents()}
             type="button"
        >
        🔄 Refresh
        </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="team-form">
          <div className="form-group">
            <label>Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Select Team Members 
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
            (Auto-refreshes every 5 seconds)
              </span>
            </label>
            <div className="students-selection">
              {availableStudents.length === 0 ? (
                <p className="no-students">No available students for this sport</p>
              ) : (
                availableStudents.map(student => (
                  <label key={student.id} className="student-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                    />
                    <span>{student.name} ({student.roll_number})</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={availableStudents.length === 0}
          >
            + Create Team
          </button>
        </form>
      </div>

      <div className="teams-section">
        <h2>Existing Teams</h2>
        {teams.length === 0 ? (
          <p className="no-teams">No teams created yet</p>
        ) : (
          <div className="teams-list">
            {teams.map(team => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <h3>{team.team_name}</h3>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="team-members">
                  <strong>Members:</strong>
                  <ul>
                    {team.members.map(member => (
                      <li key={member.id}>{member.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamBuilder;
