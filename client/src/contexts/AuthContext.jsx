import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  // Set user login status
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
