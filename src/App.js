import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { LoginPage } from './pages/LoginPage';
import { EnhancedDashboard } from './pages/EnhancedDashboard';
import { LoadingScreen } from './components/BrandLogo';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
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

    setSessionReady(true);
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
      {!sessionReady ? <LoadingScreen /> : !isAuthenticated ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <EnhancedDashboard userData={userData} onLogout={handleLogout} />}
      <Analytics />
    </>
  );
}

export default App;