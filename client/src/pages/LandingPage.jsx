import React, { useState } from 'react';

export default function LandingPage() {
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formValues); // Handle form submission
  }

  return (
    <div className="container-fluid vh-100 d-flex">
      {/* Left Side Image */}
      <div className="col-md-9 p-0">
        <img 
          src="/homepage.jpg" 
          alt="Silhouette of people raising their hands together."
          className="img-fluid h-100 w-100"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Right Side Form */}
      <main className="col-md-3 d-flex flex-column justify-content-center align-items-center bg-white p-4">
        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '300px' }}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              name="username" 
              value={formValues.username} 
              onChange={handleChange} 
              placeholder="Username" 
              className="form-control"
            />
          </div>
          
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formValues.password} 
              onChange={handleChange} 
              placeholder="Password" 
              className="form-control"
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100">
            Sign in
          </button>
        </form>
        
        <p className="text-center mt-4">
          Don't have an account? <a href="/auth/signup" className="text-primary">Sign up here</a>
        </p>
      </main>
    </div>
  );
}
