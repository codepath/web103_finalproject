import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log('Is Authenticated:', isAuthenticated);

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
