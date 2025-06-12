import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CollaborativeEditor from './components/CollaborativeEditor';
import EditDocument from './components/EditDocument';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const LoginWrapper = () => {
    const navigate = useNavigate();
    return <Login onLogin={() => { setIsLoggedIn(true); navigate('/dashboard'); }} />;
  };
  const SignupWrapper = () => {
    const navigate = useNavigate();
    return <Signup onSignup={() => { setIsLoggedIn(true); navigate('/dashboard'); }} />;
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
      <Routes>
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignupWrapper />} />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
   <Route path="/editor/:documentId" element={<EditDocument />} />
        <Route
          path="/editor"
          element={
            isLoggedIn ? (
              <CollaborativeEditor />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;