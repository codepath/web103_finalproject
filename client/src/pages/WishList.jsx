import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel.jsx';

const WishList = ({ title }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    document.title = title || '';
  }, [title]);

  useEffect(() => {
    const fetchWishList = async () => {
      const response = await fetch('/api/wishlist/');
      const data = await response.json();
      setMovies(data);
    };
    fetchWishList();
  }, []);

  return (
    <div>
      <h2>Wishlist</h2>
      <Carousel movies={movies} setMovies={setMovies} />
    </div>
  );
}

export default WishList;