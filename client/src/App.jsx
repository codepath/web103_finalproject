// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import DiscussionBoard from './pages/DiscussionBoard';
import ResourceList from './pages/ResourceList';
import CreatePost from './pages/CreatePost';
import CreateResource from './pages/CreateResource';
import AboutUs from './pages/AboutUs'; 
import Events from './pages/Events';
import './App.css';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; 
import { AuthProvider } from './contexts/AuthContext';
import { ApiUrlProvider } from './contexts/ApiContext';
import PostDetail from './components/PostDetail';

// const API_URL = process.env.NODE_ENV === 'production' ? 'https://codefm-server-production.up.railway.app' : 'http://localhost:3001';

const App = () => {
  return (
    <ApiUrlProvider>
    <AuthProvider>
      <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/posts" element={<ProtectedRoute><DiscussionBoard /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><ResourceList /></ProtectedRoute>} />
          <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/add-resource" element={<ProtectedRoute><CreateResource /></ProtectedRoute>} />
          <Route path="/posts/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        </Routes>
      </div>
    </AuthProvider>
    </ApiUrlProvider>
  );
};

export default App;