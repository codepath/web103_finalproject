// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import DiscussionBoard from './pages/DiscussionBoard';
import ResourceList from './pages/ResourceList';
import CreatePost from './pages/CreatePost';
import CreateResource from './pages/CreateResource';
import AboutUs from './pages/AboutUs'; // Import the new AboutUs component
import Events from './pages/Events';
import './App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import { AuthProvider } from './contexts/AuthContext';
import PostDetail from './components/PostDetail';

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<ProtectedRoute><DiscussionBoard /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><ResourceList /></ProtectedRoute>} />
          <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/add-resource" element={<ProtectedRoute><CreateResource /></ProtectedRoute>} />
          <Route path="/posts/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;