import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllPosts, updatePost } from '../services/postService';
import Post from '../components/Post';
import EditPostModal from './EditPostModal';
import { useApiUrl } from '../contexts/ApiContext';

const DiscussionBoard = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const apiUrl = useApiUrl();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts(apiUrl);
        
        const filteredPosts = data.filter(post => !post.deleted);
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
  
    fetchPosts();
  }, [apiUrl]);
  
  const openEditModal = (postId) => {
    const postToEdit = posts.find(function (post) {
      return post.id === postId;
    });
    setEditingPost(postToEdit);
  };

  const closeEditModal = () => {
    setEditingPost(null);
  };

  const deletePost = function (postId) {
    axios
      .delete(`/api/posts/${postId}`)
      .then(function (response) {
        const updatedPosts = posts.filter(function (post) {
          return post.id !== postId;
        });
        setPosts(updatedPosts);
      })
      .catch(function (error) {
        console.error('Failed to delete post:', error);
      });
  };

  const saveEditedPost = async function (postId, editedContent) {
    try {
      await updatePost(postId, { content: editedContent });
      const updatedPosts = posts.map(function (post) {
        if (post.id === postId) {
          return { ...post, content: editedContent };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to save edited post:', error);
    }
    closeEditModal();
  };

  return (
    <div>
      <h2>Discussion Board</h2>
      <button>
        <a href="/create-post">Create Post</a>
      </button>
      {posts.map(function (post) {
        return (
          <Post
            key={post.id}
            post={post}
            onEdit={function () {
              openEditModal(post.id);
            }}
            onDelete={function () {
              deletePost(post.id);
            }}
          />
        );
      })}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={saveEditedPost}
          onRequestClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default DiscussionBoard;
