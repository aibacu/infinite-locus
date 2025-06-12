import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ isLoggedIn, onLogout }) => (
  <nav style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    background: '#fff',
    display: 'flex',
    gap: '10px',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    justifyContent: 'flex-end',
    zIndex: 1000
  }}>
    {!isLoggedIn ? (
      <>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/signup"><button>Signup</button></Link>
      </>
    ) : (
      <button onClick={onLogout}>Logout</button>
    )}
  </nav>
);

export default NavBar;