import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  // Check authentication status on component mount
  useEffect(() => {
    axios.get(`${window.API_URL}/auth/login/success`, { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setAuthState({ isAuthenticated: true, user: response.data.user });
        }
      })
      .catch(error => {
        console.error('Authentication check failed', error);
      });
  }, []);

  const setAuthInfo = ({ isAuthenticated, user }) => {
    setAuthState({ isAuthenticated, user });
  };

  return (
    <AuthContext.Provider value={{ ...authState, setAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
