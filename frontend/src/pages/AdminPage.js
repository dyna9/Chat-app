import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPage.css';

function AdminPage({ user, token }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMod = async (userId) => {
    try {
      await axios.post(`/api/admin/add-mod/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to add moderator');
      console.error(err);
    }
  };

  const handleRemoveMod = async (userId) => {
    try {
      await axios.post(`/api/admin/remove-mod/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to remove moderator');
      console.error(err);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Chat</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        <div className="section">
          <h2>User Management</h2>
          <div className="users-table">
            <div className="table-header">
              <div>Username</div>
              <div>Email</div>
              <div>Role</div>
              <div>Actions</div>
            </div>
            {users.map(u => (
              <div key={u._id} className="table-row">
                <div>{u.username} {u.isOwner ? '👑' : ''}</div>
                <div>{u.email}</div>
                <div className="role-badge">{u.role}</div>
                <div className="actions">
                  {!u.isOwner && (
                    u.isMod ? (
                      <button 
                        className="action-btn remove"
                        onClick={() => handleRemoveMod(u._id)}
                      >
                        Remove Mod
                      </button>
                    ) : (
                      <button 
                        className="action-btn add"
                        onClick={() => handleAddMod(u._id)}
                      >
                        Make Mod
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
