import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WishList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('/api/wishlist')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleRemoveMovie = (movieId) => {
    axios.delete(`/api/wishlist/${movieId}`)
      .then(response => {
        setMovies(movies.filter(movie => movie._id !== movieId));
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Wishlist</h1>
      {movies.map(movie => (
        <div key={movie._id}>
          <h2>{movie.title}</h2>
          <img src={movie.poster} alt={movie.title} />
          <p>{movie.description}</p>
          <button onClick={() => handleRemoveMovie(movie._id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default WishList;
