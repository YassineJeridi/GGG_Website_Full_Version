import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('ggg-token');
        const adminData = localStorage.getItem('ggg-admin');

        if (token && adminData) {
          setIsAuthenticated(true);
          setAdmin(JSON.parse(adminData));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('ggg-token');
        localStorage.removeItem('ggg-admin');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ Login function that stores credentials and updates state
  const login = (token, adminData) => {
    localStorage.setItem('ggg-token', token);
    localStorage.setItem('ggg-admin', JSON.stringify(adminData));
    setIsAuthenticated(true);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('ggg-token');
    localStorage.removeItem('ggg-admin');
    setIsAuthenticated(false);
    setAdmin(null);
  };

  const value = {
    isAuthenticated,
    admin,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
