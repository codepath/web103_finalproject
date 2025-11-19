import React from "react";
import "../css/Home.css";

const Home = () => {

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="home-container">
      <h1>
        Welcome to <br /> StickerStory
      </h1>
      <p>
        Your digital memory journal
      </p>
      <div className="home-buttons">
        <button className="btn-filled" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Home;
