import React from "react";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import "./Login.css";

export default function Login() {
  const { setUserContext } = useContext(UserContext);
  const navigate = useNavigate();
  //setUserContext(null);

  const handleLogin = async () => {
    try {
      const url = `http://localhost:3000/user/${"githubId"}/${1}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setUserContext(data);
      navigate("/");
    } catch (error) {
      // Handle any network or API request errors
      alert("Login failed: " + error);
    }
  };

  return (
    <div className="login">
      <div className="divv">
        <h1>Tech Explorer Hub</h1>
        <h3>Welcome to tech explorer hub!</h3>
        <p className="text">
          The mission of Tech Explorer Hub is to empower and inspire computer
          science students on their educational journey
          <br></br> by providing a comprehensive online platform for exploration
          and discovery.
          <br></br>Our goal is to cultivate a dynamic and supportive community
          where students can delve into various facets of computer science,
          <br></br>from coding and algorithms to emerging technologies. Tech
          Explorer Hub aims to serve as a central hub for resources, tutorials,
          <br />
          and interactive learning experiences, fostering a collaborative
          environment for students to share knowledge and insights. By offering
          <br />a diverse range of educational content and real-world projects,
          we strive to bridge the gap between theoretical learning and practical
          application,
          <br /> preparing students for success in their academic pursuits and
          future careers in the ever-evolving field of computer science.
          <br />
          Ultimately, Tech Explorer Hub is dedicated to nurturing a passion for
          technology and equipping students with the skills and knowledge needed
          to excel in the digital landscape.
        </p>
        <button className="login-button">Login as admin</button>
        <br></br>
        <br />
        <br />
        <button className="login-button" onClick={handleLogin}>
          Login via github
        </button>
      </div>
    </div>
  );
}
