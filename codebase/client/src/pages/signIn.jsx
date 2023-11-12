// LoginForm.js
import React from 'react';
import '../styles/signIn.css';

const SignIn = () => {
  return (
    <div className="bodyLogIn">
        <div class="containerLogIn">
      <div class="wrapper">
        <div class="title"><span>Login</span></div>
        <form action="#">
          <div class="row">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="Email or Phone" required/>
          </div>
          <div class="row">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="Password" required/>
          </div>
          <div class="pass"><a href="#">Forgot password?</a></div>
          <div class="btnLogIn">
            <input type="submit" value="Login"/>
          </div>
          <div class="signup-link">Not a member? <a href="#">Signup now</a></div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SignIn;
