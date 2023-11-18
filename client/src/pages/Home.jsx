import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faUsers, faCalendar, faTrophy } from '@fortawesome/free-solid-svg-icons';
import '../css/Home.css';

const Home = () => {
  return (
    <div>
      <div className="image-container">
        <img src="/home.jpeg" alt="Image" className="image" />
        <Link to="/join" className="join-us-button">Join Us</Link>
      </div>
      <div className="resource-bar">
        <div className="text-container">
          <FontAwesomeIcon icon={faGraduationCap} className="icon" />
          <span>Resource</span>
        </div>
        <div className="text-container">
          <FontAwesomeIcon icon={faUsers} className="icon" />
          <span>Community</span>
        </div>
        <div className="text-container">
          <FontAwesomeIcon icon={faCalendar} className="icon" />
          <span>Events</span>
        </div>
        <div className="text-container">
          <FontAwesomeIcon icon={faTrophy} className="icon" />
          <span>Skills</span>
        </div>
      </div>
      <div className="bar2">
        <span className="bar2-text">Unlock Your Learning Potential With CodeFM!</span>
        <Link to="/join" className="join-us-button-mobile">Join Us</Link>
      </div>
      <div className="footer">
        &copy; {new Date().getFullYear()} CodeFM. All rights reserved.
      </div>
    </div>
  );
};

export default Home;
