import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/signIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location = '/'
    } catch (error) {
      setError("Incorrect email or password. Please try again.");
    }
  };

  const closeError = () => {
    setError(null);
  };

  return (
    <div className="bodyLogIn" onClick={closeError}>
      <div className="containerLogIn">
        <div className="wrapper">
          <div className="title"><span>Login</span></div>
          <form onSubmit={handleSignIn}>
            <div className="row">
              <i className="fas fa-user"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="row">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="pass">
              <a href="#">Forgot password?</a>
            </div>
            <div className="btnLogIn">
              <input type="submit" value="Login" />
            </div>
            <div className="signup-link">
              Not a member? <a href="#">Signup now</a>
            </div>
          </form>
        </div>
      </div>
      {error && (
        <div className="error-popup">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SignIn;
