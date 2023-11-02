import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from "./components/Navigation";
import Home from './pages/Home';
import DiscussionBoard from './pages/DiscussionBoard';
import ResourceList from './pages/ResourceList';
import CreatePost from './pages/CreatePost';
import CreateResource from './pages/CreateResource';

import './App.css';

const App = () => {
  return (
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<DiscussionBoard />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/add-resource" element={<CreateResource />} />
        </Routes>
      </div>
  );
}

export default App;
