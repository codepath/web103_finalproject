import React, { useState, useContext } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import UsersAPI from '../services/UsersAPI'; 
import '../styles/LogInPage.css';

const LogInPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();  
 
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await UsersAPI.loginUser({
        email: credentials.email,
        password: credentials.password
      });

      if (result.token) {
        localStorage.setItem('token', result.token);
        const user = await UsersAPI.getUserProfile();     
        login(user, result.token); 
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <main className="container login-container">
      <article>
        <header className="login-header">
          <h2>SIGN IN TO YOUR ACCOUNT</h2>
        </header>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            Email Address:
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="password">
            Password:
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </label>

          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>

          <button type="submit" className="btn-signin">
            [ SIGN IN ]
          </button>
        </form>

        <footer className="login-footer">
          <p>
            Don't have an account? 
            <Link to="/signup" className="create-account-link"> [Create One]</Link>
          </p>
        </footer>
      </article>
    </main>
  );
};

export default LogInPage;