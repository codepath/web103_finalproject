// LoginForm.js
import React from 'react';
import '../styles/signIn.css';

const SignUp = () => {
  return (
    <div className="bodyLogIn">
        <div class="containerLogIn">
      <div class="wrapper">
        <div class="title"><span>Sign Up</span></div>
        <form action="#">
          <div class="row">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="Email or Phone" required/>
          </div>
          <div class="row">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="Password" required/>
          </div>
          <div class="btnLogIn">
            <input type="submit" value="Sign Up"/>
          </div>
          <div class="signup-link">Already a User? <a href="#">Login now</a></div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SignUp;
