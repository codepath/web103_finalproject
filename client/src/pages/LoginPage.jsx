import React, { useState } from "react";

export default function LoginPage(props) {
  const AUTH_URL = `${props.api_url}/auth/github`;

  return (
    <div className="container-fluid vh-100 d-flex">
      {/* Left Side Image */}
      <div className="col-md-9 p-0">
        <img
          src="/homepage.jpg"
          alt="Silhouette of people raising their hands together."
          className="img-fluid h-100 w-100"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Right Side Form */}
      <main className="col-md-3 d-flex flex-column justify-content-center align-items-center bg-white p-4">
        <h1>Learn More 2gether</h1>
        <center>
          <a href={AUTH_URL}>
            <button className="headerBtn"> 🔒 Login via Github </button>
          </a>
        </center>
      </main>
    </div>
  );
}
