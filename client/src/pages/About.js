import React from 'react'
import './About.css'

const About = () =>  {

  const sneaker = 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9f5d3ab4-98b4-44fe-9823-3b409603b520/dunk-low-retro-mens-shoes-M0t9Sv.png';

  return (
    <div className="About">
    <div className="flex-container">
      <div className="left-side">
        <h2>👋 Welcome to <br /> Sneaker World!</h2>
        <p className="About-paragraph">Sneaker World is  where sneaker culture and innovation come together. <br />
          We're not just an online store:  
          we're your gateway to exclusive collaborations, curated collections, and a thriving sneaker community.</p>
      </div>
      <div className="right-side" style={{ backgroundImage: `url(${sneaker})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      </div>
    </div>
  </div>
  );
};

export default About;
