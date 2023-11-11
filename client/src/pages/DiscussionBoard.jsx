import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../services/postService';
import Post from '../components/Post';

const DiscussionBoard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Discussion Board</h2>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default DiscussionBoard;
