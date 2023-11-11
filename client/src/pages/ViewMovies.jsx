
import React, { useState, useEffect } from 'react';
import Card from '../components/Card.jsx';

import '../App.css';

const ViewMovies = ({ title }) => {
  const [movies, setMovies] = useState([]);

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

  return (
    <div className='ViewMovies'>
      <div className='cards-container'>
        {
          movies && movies.length > 0
          ?
          movies.map((movie, index) => (
            <Card
              key = {movie.movie_id} 
              title = {movie.title}
              description = {movie.description}
              actors = {movie.actors}
              director = {movie.director}
              publish_date = {movie.publish_date}
              img_url = {movie.img_url}
              trailer_url = {movie.trailer_url}
            />
          ))
          : <h2>{"No movies found 🥲"}</h2>
        }
      </div>
    </div>
  );
}

export default ViewMovies;
