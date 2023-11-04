import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here, you can add code to handle the sign-in logic, e.g., making an API request.

    // After successful sign-in, you can navigate to the user's dashboard or another page.
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <img
        src="/logo.PNG"
        alt="Logo"
        className="logo"
      />
      <h2 className="login-title">Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="input-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="input-field"
          />
        </div>
        <div className="input-container">
          <label className="input-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="input-field"
          />
        </div>
        <div className="input-container">
          <button type="submit" className="login-button">
            Log In
          </button>
        </div>
        <p className="login-link">
          Don't have an account?{' '}
          <a href="/signup" className="login-link">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
