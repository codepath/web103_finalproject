import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, apiUrl }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true, // Add a loading state
  });

  useEffect(() => {
    axios.get(`${apiUrl}/auth/login/success`, { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setAuthState({ isAuthenticated: true, user: response.data.user, loading: false });
        } else {
          setAuthState({ isAuthenticated: false, user: null, loading: false });
        }
      })
      .catch(error => {
        console.error('Authentication check failed', error);
        setAuthState({ isAuthenticated: false, user: null, loading: false });
      });
  }, []);

  const setAuthInfo = ({ isAuthenticated, user }) => {
    setAuthState({ isAuthenticated, user, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, setAuthInfo }}>
      {!authState.loading && children} {/* Render children only when not loading */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
