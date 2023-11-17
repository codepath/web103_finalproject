import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Card from './Card'; // Adjust the path as necessary
import Modal from './Modal'; // Adjust the path as necessary
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../css/Carousel.css';

const MovieCarousel = ({ movies, setMovies }) => {
    const [selectedMovie, setSelectedMovie] = useState(null); // Initialize selectedMovie state to in order to hide the modal by default

    const openModal = (movie) => {
        setSelectedMovie(movie);
    };

    const closeModal = () => {
        setSelectedMovie(null);
    };

    return (
        <div className='ViewMovies'>
            {selectedMovie && <Modal setMovies={setMovies} movies={movies} movie={selectedMovie} onClose={closeModal} isWishList={true}/>}
            <div className='cards-container'>
                {
                    movies && movies.length > 0
                        ?
                        movies.map((movie, index) => (
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
    );
}

export default MovieCarousel;
