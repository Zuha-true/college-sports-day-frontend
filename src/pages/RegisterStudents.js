// frontend/src/pages/RegisterStudents.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import API_URL from '../config';

const sports = [
  { name: 'cricket', label: 'Cricket' },
  { name: 'throwball', label: 'Throwball' },
  { name: 'kho_kho', label: 'Kho-Kho' },
  { name: 'badminton_doubles', label: 'Badminton Doubles' },
  { name: 'relay', label: 'Relay' },
  { name: 'tug_of_war', label: 'Tug of War' }
];

function RegisterStudents({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    email: '',
    phone: '',
    cricket: false,
    throwball: false,
    kho_kho: false,
    badminton_doubles: false,
    relay: false,
    tug_of_war: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/students`, formData);
      setSuccess('Student registered successfully!');
      setFormData({
        name: '',
        roll_number: '',
        email: '',
        phone: '',
        cricket: false,
        throwball: false,
        kho_kho: false,
        badminton_doubles: false,
        relay: false,
        tug_of_war: false
      });
      fetchStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API_URL}/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <button onClick={() => navigate('/admin/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Register Students</h1>
        <button onClick={onLogout} className="btn btn-outline">
          Logout
        </button>
      </nav>

      <div className="page-content">
        <div className="register-form-container">
          <h2>Add New Student</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Roll Number *</label>
                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Interested Sports *</label>
              <div className="checkbox-grid">
                {sports.map(sport => (
                  <label key={sport.name} className="checkbox-label">
                    <input
                      type="checkbox"
                      name={sport.name}
                      checked={formData[sport.name]}
                      onChange={handleInputChange}
                    />
                    {sport.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Register Student
            </button>
          </form>
        </div>

        <div className="students-list-container">
          <h2>Registered Students ({students.length})</h2>
          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Sports</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.roll_number}</td>
                    <td>
                      {sports
                        .filter(s => student[s.name])
                        .map(s => s.label)
                        .join(', ')}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterStudents;