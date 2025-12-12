import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

// Configurar axios global
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ?
              <Navigate to="/dashboard" /> :
              <LoginPage onLogin={handleLogin} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ?
              <DashboardPage user={user} handleLogout={handleLogout} /> :
              <Navigate to="/" />
          }
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

