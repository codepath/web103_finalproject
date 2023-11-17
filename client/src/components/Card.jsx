import React from 'react';
import '../css/Card.css';

const Card = ({ title, img_url, trailer_url }) => {
    return (
        <div className='card'>
            <div className='card-image' style={{ backgroundImage: `url(${img_url})` }}>
                <div className='card-overlay'>
                    <div className='card-content'>
                        <h2 className='card-title'>{title}</h2>
                        <a href={trailer_url} className='card-trailer' target='_blank'>Watch Trailer</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
