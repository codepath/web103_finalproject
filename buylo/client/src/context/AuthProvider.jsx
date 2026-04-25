import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import UsersAPI from '../services/UsersAPI';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      
      const token = localStorage.getItem('token');
 
      if (token) {
        try {
          const userData = await UsersAPI.getUserProfile();
          setUser(userData);
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {    
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};