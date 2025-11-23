// frontend/src/pages/StudentView.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

function StudentView() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const navigate = useNavigate();
  const { sportName } = useParams();

  useEffect(() => {
    if (sportName) {
      setSelectedSport(sportName);
      fetchSportData(sportName);
    }
  }, [sportName]);

  const fetchSportData = async (sport) => {
    try {
      const [teamsRes, matchesRes] = await Promise.all([
        axios.get(`${API_URL}/teams/${sport}`),
        axios.get(`${API_URL}/brackets/${sport}`)
      ]);
      setTeams(teamsRes.data);
      setMatches(matchesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSportSelect = (sportName) => {
    setSelectedSport(sportName);
    fetchSportData(sportName);
  };

  const groupMatchesByRound = () => {
    const grouped = {};
    matches.forEach(match => {
      if (!grouped[match.round]) {
        grouped[match.round] = [];
      }
      grouped[match.round].push(match);
    });
    return grouped;
  };

  const roundedMatches = groupMatchesByRound();
  const rounds = Object.keys(roundedMatches).sort((a, b) => a - b);

  return (
    <div className="student-view">
      <nav className="student-navbar">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <h1>AITM Sports Day 2025</h1>
      </nav>

      <div className="student-content">
        {!selectedSport ? (
          <>
            <h2>Select a Sport to View</h2>
            <div className="sports-grid">
              {sports.map(sport => (
                <div
                  key={sport.name}
                  className="sport-card clickable"
                  onClick={() => handleSportSelect(sport.name)}
                >
                  <span className="sport-icon">{sport.icon}</span>
                  <h3>{sport.label}</h3>
                  <button className="btn btn-sm btn-primary">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="sport-header">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedSport(null)}
              >
                ← All Sports
              </button>
              <h2>{sports.find(s => s.name === selectedSport)?.label}</h2>
            </div>

            <div className="sport-details">
              <div className="teams-display">
                <h3>Teams</h3>
                {teams.length === 0 ? (
                  <p>No teams created yet</p>
                ) : (
                  <div className="teams-grid">
                    {teams.map(team => (
                      <div key={team.id} className="team-card-view">
                        <h4>{team.team_name}</h4>
                        <div className="team-members-list">
                          {team.members.map(member => (
                            <span key={member.id} className="member-badge">
                              {member.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bracket-display">
                <h3>Tournament Bracket</h3>
                {matches.length === 0 ? (
                  <p>Tournament bracket not generated yet</p>
                ) : (
                  <div className="bracket-container">
                    <div className="bracket-rounds">
                      {rounds.map(round => (
                        <div key={round} className="bracket-round">
                          <h4>Round {round}</h4>
                          <div className="round-matches">
                            {roundedMatches[round].map(match => (
                              <div key={match.id} className="match-card-view">
                                <div className={`team-display ${match.winner_id === match.team1_id ? 'winner' : match.is_completed ? 'loser' : ''}`}>
                                  {match.team1_name || 'TBD'}
                                </div>
                                <div className="vs-divider">vs</div>
                                <div className={`team-display ${match.winner_id === match.team2_id ? 'winner' : match.is_completed ? 'loser' : ''}`}>
                                  {match.team2_name || 'TBD'}
                                </div>
                                {match.is_completed && (
                                  <div className="match-winner">
                                    Winner: {match.winner_name}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {matches.length > 0 && matches[matches.length - 1].is_completed && (
                      <div className="winner-announcement">
                        <h2>🏆 Champion 🏆</h2>
                        <h3>{matches[matches.length - 1].winner_name}</h3>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentView;