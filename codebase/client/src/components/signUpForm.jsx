// src/components/SignUp.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import DisplayVerificationMessage from '../components/displayVerificationMessage';
import '../styles/signIn.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationMessage, setVerificationMessage] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification
      await sendEmailVerification(userCredential.user);
      setVerificationMessage('Thank you for signing up! An email verification link has been sent to your email address. Please check your email and click the link to verify your account.');
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div className="bodyLogIn">
      <div className="containerLogIn">
        <div className="wrapper">
          <div className="title"><span>Sign Up</span></div>
          {verificationMessage ? (
            <DisplayVerificationMessage/>
          ) : (
            <form onSubmit={handleSignUp}>
              <div className="row">
                <i className="fas fa-user"></i>
                <input type="email" placeholder="Email" value={email} onChange={(e) =>
                  setEmail(e.target.value)
                } required />
              </div>
              <div className="row">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="btnLogIn">
                <input type="submit" value="Sign Up" />
              </div>
              <div className="signup-link">Already a User? <a href="#">Login now</a></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
