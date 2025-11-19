import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation, useRoutes } from "react-router-dom";
import Navigation from './components/Navigation';

import Home from './pages/Home';
import AllJournals from './pages/AllJournals';
import CreateJournal from './pages/CreateJournal';
import EditJournal from './pages/EditJournal';
import AllPages from './pages/AllPages';
import PageDetails from './pages/PageDetails';
import AddPage from './pages/AddPage';
import PreviewPage from './pages/PreviewPage';

import './App.css';

const App = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/auth/me', { credentials: 'include' })  // Change this
      .then(res => res.json())
      .then(data => {
        console.log('👤 User data received:', data); // Add this debug log
        setUser(data);
      })
      .catch(err => console.log('Error fetching user:', err));
  }, []);

  const handleLogout = () => {
    window.location.href = 'http://localhost:3000/auth/logout';
  };

  const element = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/journals', element: <AllJournals /> },
    { path: '/journals/create', element: <CreateJournal /> },
    { path: '/journals/:journalId/edit', element: <EditJournal /> },
    { path: '/journals/:journalId', element: <AllPages /> },
    { path: '/journals/:journalId/pages/add', element: <AddPage /> },
    { path: '/journals/:journalId/pages/:pageId', element: <PageDetails /> },
    { path: '/journals/:journalId/pages/:pageId/preview', element: <PreviewPage /> },
  ]);

  return (
    <div className="app">
      {location.pathname !== '/' && (
        <Navigation
          userName={user?.displayName}
          onLogout={handleLogout}
        />
      )}
      {element}
    </div>
  );
};

export default App;
