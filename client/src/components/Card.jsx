import React from 'react'
import { Link } from 'react-router-dom'


const Card = (props) =>  {

  return (
      <div className="Card" style={{ backgroundImage:`url(${props.img_url})`}} >
        <div className="card-info">
          <Link to={'edit/'+ props.id}>more...</Link>
          <h2 className="title">{props.rating}</h2>
          <p className="description">{props.review}</p>

        </div>
      </div>
  );
};

export default Card;