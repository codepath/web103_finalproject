import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useApiUrl } from '../contexts/ApiContext';
import "../css/Login.css";

const Login = () => {
  const apiUrl = useApiUrl();
  const navigate = useNavigate();
  const { setAuthInfo } = useAuth();
  const AUTH_URL = `${apiUrl}/auth/github`;

  useEffect(() => {
    axios.get(`${apiUrl}/auth/login/success`, { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          console.log('Login Success:', response.data); // Add this line
          setAuthInfo({ isAuthenticated: true, user: response.data.user });
          navigate('/');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          console.log('User is not logged in');
        } else {
          console.error('Login check failed', error);
        }
      });
  }, [apiUrl, navigate, setAuthInfo]);

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
