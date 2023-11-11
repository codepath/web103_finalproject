import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import DiscussionBoard from './pages/DiscussionBoard';
import ResourceList from './pages/ResourceList';
import CreatePost from './pages/CreatePost';
import CreateResource from './pages/CreateResource';

import './App.css';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<DiscussionBoard />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/add-resource" element={<CreateResource />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
