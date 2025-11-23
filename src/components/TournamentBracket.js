// frontend/src/components/TournamentBracket.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import API_URL from '../config';

function TournamentBracket({ sport, teams }) {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBracket();
  }, [sport]);

  const fetchBracket = async () => {
    try {
      const response = await axios.get(`${API_URL}/brackets/${sport}`);
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching bracket:', error);
    }
  };

  const handleGenerateBracket = async () => {
    if (teams.length < 2) {
      setError('Need at least 2 teams to generate bracket');
      return;
    }

    try {
      await axios.post(`${API_URL}/brackets/generate/${sport}`);
      setSuccess('Bracket generated successfully!');
      fetchBracket();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate bracket');
    }
  };

  const handleSetWinner = async (matchId, winnerId) => {
    try {
      await axios.put(`${API_URL}/brackets/match/${matchId}`, {
        winner_id: winnerId
      });
      fetchBracket();
    } catch (error) {
      console.error('Error setting winner:', error);
    }
  };

  const handleResetBracket = async () => {
    if (window.confirm('Are you sure you want to reset the bracket?')) {
      try {
        await axios.delete(`${API_URL}/brackets/${sport}`);
        setMatches([]);
      } catch (error) {
        console.error('Error resetting bracket:', error);
      }
    }
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
    <div className="tournament-bracket">
      <div className="bracket-header">
        <h2>Tournament Bracket</h2>
        <div className="bracket-actions">
          {matches.length === 0 ? (
            <button
              className="btn btn-primary"
              onClick={handleGenerateBracket}
              disabled={teams.length < 2}
            >
              Generate Bracket
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={handleResetBracket}
            >
              Reset Bracket
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {matches.length === 0 ? (
        <div className="empty-bracket">
          <p>No teams created yet. Admin needs to create teams first.</p>
        </div>
      ) : (
        <div className="bracket-container">
          <div className="bracket-rounds">
            {rounds.map(round => (
              <div key={round} className="bracket-round">
                <h3>Round {round}</h3>
                <div className="round-matches">
                  {roundedMatches[round].map(match => (
                    <div key={match.id} className="match-card">
                      <div className="match-header">
                        Match {match.match_number}
                      </div>
                      
                      <div className={`team ${match.winner_id === match.team1_id ? 'winner' : match.is_completed ? 'loser' : ''}`}>
                        <span className="team-name">
                          {match.team1_name || 'TBD'}
                        </span>
                        {match.team1_id && !match.is_completed && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleSetWinner(match.id, match.team1_id)}
                          >
                            ✓
                          </button>
                        )}
                      </div>

                      <div className="vs-divider">vs</div>

                      <div className={`team ${match.winner_id === match.team2_id ? 'winner' : match.is_completed ? 'loser' : ''}`}>
                        <span className="team-name">
                          {match.team2_name || 'TBD'}
                        </span>
                        {match.team2_id && !match.is_completed && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleSetWinner(match.id, match.team2_id)}
                          >
                            ✓
                          </button>
                        )}
                      </div>

                      {match.is_completed && (
                        <div className="match-result">
                          Winner: {match.winner_name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {matches.some(m => m.is_completed && !matches.some(m2 => m2.round > m.round && !m2.is_completed)) && (
            <div className="winner-announcement">
              <h2>🏆 Tournament Winner 🏆</h2>
              <h3>{matches[matches.length - 1].winner_name}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TournamentBracket;