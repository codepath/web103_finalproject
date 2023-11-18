import React, { useState, useEffect } from 'react';
import Card from '../components/Card.jsx';
import Modal from '../components/Modal.jsx';
import Timeline from '../components/Timeline.jsx';

import '../App.css';
import '../css/ViewMovies.css';

const ViewMovies = ({ title }) => {
  const [movies, setMovies] = useState([]); // Initialize movies state to an empty array
  const [selectedMovie, setSelectedMovie] = useState(null); // Initialize selectedMovie state to in order to hide the modal by default
  const [searchTerm, setSearchTerm] = useState(''); // Initialize search term state to an empty string
  const [viewType, setViewType] = useState('cards'); // "cards" or "timeline"

  /**
   * Function to toggle between "cards" and "timeline" view
   */
  const toggleViewType = () => {
    setViewType(viewType === 'cards' ? 'timeline' : 'cards');
  };

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

  /**
   * Function to open the modal
   */
  const openModal = (movie) => {
    setSelectedMovie(movie);
  };

  /**
   * Function to close the modal
   */
  const closeModal = () => {
    setSelectedMovie(null);
  };

  /**
   * Function to handle search input
   */
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Filter movies based on the search term
   */
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.actors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='ViewMovies'>
      {selectedMovie && <Modal movie={selectedMovie} onClose={closeModal} />}

      <button className="toggle-view" onClick={toggleViewType} style={{
        backgroundColor: '#FFAAB0', /* Green */
        color: 'white',
        cursor: 'pointer',
        borderRadius: '12px'
      }}>
        Switch to {viewType === 'cards' ? 'Timeline' : 'Card'} View
      </button>

      {viewType === 'cards' ? (
        <div className='view-movies-container'>
          <div className='search-bar-container'>
            <input className="search-bar" type="text" placeholder="Search movie, director, or actor here..." value={searchTerm} onChange={handleSearch} />
          </div>

          <div className='cards-container'>
            {
              filteredMovies && filteredMovies.length > 0
                ?
                filteredMovies.map((movie, index) => (
                  <div onClick={() => openModal(movie)} key={movie.movie_id}>
                    <Card
                      movie={movie}
                    />
                  </div>
                ))
                : <h2>{"No movies found 🥲"}</h2>
            }
          </div>
        </div>
      ) : (
        <Timeline movies={movies} onMovieSelect={openModal} />
      )}

    </div>
  );
}

export default ViewMovies;