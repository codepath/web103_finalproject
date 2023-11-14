import React from 'react'
import './SneakersCard.css'
import { Link } from 'react-router-dom'


const SneakersCard = (props) =>  {

  return (
      <div className="SneakersCard" style={{ backgroundImage:`url(${props.image_url})`}} >
        <div className="SneakersCard-info">
          <h3 className="brand_name">{props.brand_name}</h3>
          {/* <p className="description">{props.description}</p>  */}
           {/* <p className="sizes">{props.sizes}</p> */}
        
        <div className="container">
          <p className="price">{props.price}</p>
          <Link to={'sneaker/get/'+ props.id}><button className="detailsBtn">Details</button></Link>
        </div>

        </div>
      </div>
  );
};

export default SneakersCard;