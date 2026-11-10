import React from "react";

const LoginPage = (props) => {
  const AUTH_URL = `${props.api_url}/auth/github`;
  return (
    <div className="Login">
      <h1>BookBuddy</h1>
      <center>
        <a href={AUTH_URL}>
          <button className="header-button">Login via Github</button>
        </a>
      </center>
    </div>
  );
};

export default LoginPage;