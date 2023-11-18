// src/contexts/ApiContext.js
import React, { createContext, useContext } from 'react';

// Create a Context for the API URL
const ApiUrlContext = createContext('');

// const API_URL = process.env.NODE_ENV === 'production' ? 'https://codefm-server-production.up.railway.app' : 'http://localhost:3001';

// Create a Provider component
export const ApiUrlProvider = ({ children }) => {
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://codefm-server-production.up.railway.app'
    : 'http://localhost:3001';

  return (
    <ApiUrlContext.Provider value={apiUrl}>
      {children}
    </ApiUrlContext.Provider>
  );
};

// Create a hook to use the API URL context
export const useApiUrl = () => useContext(ApiUrlContext);
