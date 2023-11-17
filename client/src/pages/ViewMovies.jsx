
import React, { useState, useEffect } from 'react';
import Card from '../components/Card.jsx';
import Modal from '../components/Modal.jsx';

import '../App.css';

const ViewMovies = ({ title }) => {
  const [movies, setMovies] = useState([]); // Initialize movies state to an empty array
  const [selectedMovie, setSelectedMovie] = useState(null); // Initialize selectedMovie state to in order to hide the modal by default

  // Set the document title using the browser API
  useEffect(() => {
    document.title = title || ''
  }, [title])

  // Fetch movies from the backend API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies/');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMovies();
  }, []);

  const openModal = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className='ViewMovies'>
      {selectedMovie && <Modal movie={selectedMovie} onClose={closeModal} />}
      <div className='cards-container'>
        {
          movies && movies.length > 0
          ?
          movies.map((movie, index) => (
            <div onClick={() => openModal(movie)} key={movie.movie_id}>
              <Card
                title={movie.title}
                img_url={movie.img_url}
                trailer_url={movie.trailer_url}
              />
            </div>
          ))
          : <h2>{"No movies found 🥲"}</h2>
        }
      </div>
    </div>
  );
}

export default ViewMovies;
