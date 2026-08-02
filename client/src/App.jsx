import React from 'react';
import { useRoutes } from 'react-router-dom';
import Profile from './pages/Profile.jsx';

// TODO: replace with real pages/components (Navigation, Home, Trips, TripDetails, etc.)
const App = () => {
  let element = useRoutes([
    { path: '/', element: <h1>Ramblr 🧳 — placeholder home page</h1> },
    { path: '/profile', element: <Profile /> },
  ]);

  return (
    <div className="app">
      {element}
    </div>
  );
};

export default App;