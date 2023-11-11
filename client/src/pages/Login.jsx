import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthInfo } = useAuth();
  const AUTH_URL = `${window.API_URL}/auth/github`;

  // This useEffect will check if the user is already logged in when the component mounts
  useEffect(() => {
    axios.get(`${window.API_URL}/auth/login/success`, { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setAuthInfo({ isAuthenticated: true, user: response.data.user });
          navigate('/'); // Redirect to home if already logged in
        }
      })
      .catch(error => {
        console.error('Login check failed', error);
      });
  }, [navigate, setAuthInfo]);

  // This function could be used for a direct login API call if you have one
  const handleLogin = () => {
    axios.post(`${window.API_URL}/auth/login`, { /* login data */ }, { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setAuthInfo({ isAuthenticated: true, user: response.data.user });
          navigate('/'); // Redirect to home after successful login
        }
      })
      .catch(error => {
        console.error('Login failed', error);
      });
  };

  return (
    <div className="login-container">
      <h1 className="login-title">CodeFM</h1>
      <center>
        <a href={AUTH_URL}>
          <button className="login-button"> 🔒 Login via Github </button>
        </a>
      </center>
      <p className="login-link">
        Don't have an account?{' '}
        <a href="https://github.com/join" className="signup-link">Sign up on GitHub</a>
      </p>
    </div>
  );
};

export default Login;
