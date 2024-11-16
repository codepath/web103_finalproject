import React from 'react';
import '../css/Trip.css'

const Trip = ({ name, onClick }) => {
    return (
        <div className="event" onClick={onClick}>
            <p>{name}</p>
        </div>
    );
};

export default Trip;
