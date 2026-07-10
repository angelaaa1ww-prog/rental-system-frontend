import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { LoginPage } from './pages/LoginPage';
import { EnhancedDashboard } from './pages/EnhancedDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Load script for Google Sign-In
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Check for existing auth
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    if (token && storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const handleLoginSuccess = (authData) => {
    setUserData(authData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <>
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <EnhancedDashboard userData={userData} onLogout={handleLogout} />
      )}
      <Analytics />
    </>
  );
}

export default App;
