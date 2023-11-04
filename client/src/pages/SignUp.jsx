import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUP.css'; 

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here, you can add code to handle form submission (e.g., making an API request to sign up the user).

    // After successful sign-up, you can navigate to a welcome or dashboard page:
    navigate('/signup');
  };

  return (
    <div className="signup-container">
      <img
        src="/logo.PNG"
        alt="Logo"
        className="logo"
      />
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit">Sign Up</button>
        </div>
        <p className="login-link">
          Already have an account?{' '}
          <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
