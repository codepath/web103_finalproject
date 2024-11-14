import React from 'react';
import { Link } from 'react-router-dom';  // You can still use react-router-dom for navigation if needed

const Card = (props) => {
  return (
    <div
      className="card text-white shadow-lg"
      style={{ 
        width: '18rem', 
        height: '18rem', 
        backgroundColor: 'rgba(22, 11, 0, 0.507)' // Apply custom background color here
      }}
    >
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{props.name}</h5>
        <p className="card-text text-justify" style={{ height: '145px' }}>
          {props.description}
        </p>
        <button className="btn btn-outline-light">{'Created by ' + props.created_by}</button>
      </div>
    </div>
  );
};

export default Card;
