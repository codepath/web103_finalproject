import React from 'react'
import './About.css'
// import { Link } from 'react-router-dom'

const About = () =>  {

  const sneaker = 'https://static.nike.com/a/images/t_default/c2643901-9e8c-41b5-b17d-36802f3102e9/dunk-low-retro-mens-shoes-M0t9Sv.png';

  return (
      <div>

        <div className="float-right">
            <div className="image-container">
            <img src={ sneaker } alt="sneaker" style={{ width: "100%", height: "auto" }} /> 
            </div>
        </div>

     <div className="About">
        <div className="AboutText">
          <p>We are beyond e-commerce: we are a labor of love.</p>
          <h2>Welcome to Sneaker World!</h2>
          <p>Sneaker World is  where sneaker culture and innovation come together. <br />
          We're not just an online store;  <br />
          we're your gateway to exclusive collaborations, curated collections, and a thriving sneaker community.</p>
        </div>
    </div>  

    </div>
  );
};

export default About;