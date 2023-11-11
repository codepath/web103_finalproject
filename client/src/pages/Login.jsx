import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css';
import { useAuth } from '../contexts/AuthContext';


const Login = () => {
  const navigate = useNavigate();
  const { setAuthInfo } = useAuth();
  const AUTH_URL = `${window.API_URL}/auth/github`;

  useEffect(() => {
    axios.get(`${window.API_URL}/auth/login/success`, { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setAuthInfo({ isAuthenticated: true, user: response.data.user });
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Login check failed', error);
      });
  }, [navigate, setAuthInfo]);

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
