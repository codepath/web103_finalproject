import React from "react";
import "../Pages_css/aboutPage.css";
import sunflowers from "../assets/sunflowers.jpeg";

const AboutPage = () => {
  return (
    <main className="about-main">
      <div className="about-container">
        <img className="about-image" src={sunflowers} alt="Sunflowers" />
        <div className="about-text">
            <h1>Welcome to FlowerHunt</h1>
          <p>
            At FlowerHunt, we make it easy to dive into the beautiful world of
            flowers. From wanting to start your own garden to creating and
            gifting a meaningful bouquet, we make it easy to start. We provide
            information on hundreds of flowers for users to explore.
          </p>
          <p>
            Check out the different features we provide to make the flowering
            experience fun and easy!
          </p>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
