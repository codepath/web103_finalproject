import React, { useState } from 'react';
import '../css/Modal.css';
import { AiOutlineCloseCircle, AiFillYoutube } from 'react-icons/ai'; // Importing icons from react-icons
import { FaRegCalendarAlt, FaRegUser, FaUsers, FaEdit, FaTag } from 'react-icons/fa'; // Additional icons for details
import { AiOutlinePlus, AiOutlineCheck, AiFillDelete, AiOutlineMinus } from 'react-icons/ai';

const Modal = ({ setMovies, movies, movie, onClose, isWishList }) => {
  if (!movie) return null;
  const userId = 1

  // Keep track of whether the movie has been added to the wishlist
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  // Assuming the `trailer_url` is a YouTube link, we extract the video ID for embedding
  const youtubeVideoId = movie.trailer_url.split('v=')[1];

  /**
   * Function to add a movie to the wishlist
   * @param {*} movieId 
   */
  const addToWishlist = async (movieId) => {
    try {
      const response = await fetch(`/api/wishlist/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, movie_id: movieId }),
      });

      // If the response is not OK, throw an error
      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
      }

      const data = await response.json();
      setAddedToWishlist(true);
      alert('Movie added to wishlist');
    } catch (error) {
      alert('Error:', error);
    }
  };

  /**
   * Function to delete a movie from the wishlist
   * @param {*} movieId 
   */
  const deleteFromWishlist = async (movieId) => {
    try {
      const response = await fetch(`/api/wishlist/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, movie_id: movieId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie from wishlist');
      }

      // Remove the movie from the state
      setMovies(movies.filter(movie => movie.movie_id !== movieId));
      onClose();
      alert('Movie deleted from wishlist');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">

        <button className="modal-close-btn" onClick={onClose}>
          <AiOutlineCloseCircle size={28} />
        </button>

        <div className="modal-header">
          <h2 className="modal-title">{movie.title}</h2>
          {/* <img src={movie.img_url} alt={movie.title} className="modal-image"/> */}
        </div>

        <div className="modal-body">
          <p className="modal-description">{movie.description}</p>

          <div className="modal-info">
            <FaTag className="icon" />
            <span>Genre: {movie.tag}</span>
          </div>
          <div className="modal-info">
            <FaRegUser className="icon" />
            <span>Director: {movie.director}</span>
          </div>
          <div className="modal-info">
            <FaUsers className="icon" />
            <span>Actors: {movie.actors}</span>
          </div>

          <div className="modal-info">
            <FaRegCalendarAlt className="icon" />
            <span>Release Date: {movie.publish_date}</span>
          </div>

        </div>
        <div className="modal-footer">
          <div className="youtube-container">
            <AiFillYoutube className="youtube-icon" />
            <iframe
              className="youtube-iframe"
              src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Movie Trailer"
            ></iframe>
          </div>

          <div className="modal-edit-link">
            <a href={`/edit/${movie.movie_id}`} className="edit-link">
              <FaEdit className="icon edit-icon" />
              Edit
            </a>
          </div>

          {
            isWishList ? (
              // <button onClick={() => onButtonClick(movie.movie_id)}>Delete from wishlist</button>
              <div className="modal-delete-from-wishlist">
                <AiFillDelete className="wishlist-icon deleted" onClick={() => deleteFromWishlist(movie.movie_id)} title="Delete from wishlist" />
              </div>
            ) : (
              <div className="modal-add-to-wishlist">
                {addedToWishlist ? (
                  <AiOutlineCheck className="wishlist-icon added" title="Movie added to wishlist" />
                ) : (
                  <AiOutlinePlus className="wishlist-icon not-added" onClick={() => addToWishlist(movie.movie_id)} title="Add to wishlist" />
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
