import React from 'react';
import '../css/Card.css';

const Card = ({ movie }) => {
    return (
        <div className='card'>
            <div className='card-image' style={{ backgroundImage: `url(${movie.img_url})`, cursor: 'pointer'}}>
                <div className='card-overlay'>
                    <div className='card-content'>
                        <h2 className='card-title'>{movie.title}</h2>
                        <a href={movie.trailer_url} className='card-trailer' target='_blank'>Watch Trailer</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
