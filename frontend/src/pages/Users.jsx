 
import React, { useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  const getUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/all', { withCredentials: true });
      setUsers(res.data.users);
      setMsg('Fetched users successfully');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to fetch users');
    }
  };

  return (
    <div>
      <h2>All Users</h2>
      <button onClick={getUsers}>Fetch Users</button>
      <p style={{ color: 'green' }}>{msg}</p>
      <ul>
        {users.map((u) => (
          <li key={u._id}>{u.name} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
