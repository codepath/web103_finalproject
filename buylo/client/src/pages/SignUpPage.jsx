import React, { useState , useContext } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import '../styles/SignUpPage.css'; 
import { AuthContext } from '../context/AuthContext'; 
import UsersAPI from '../services/UsersAPI'; 

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name:'',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const { login } = useContext(AuthContext);  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try{
        const result = await UsersAPI.createUser({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword
        });
        

        if (result && result.token) {
        // Save the token so the user stays logged in
        localStorage.setItem("token", result.token);
        localStorage.setItem('token', result.token);
        const user = await UsersAPI.getUserProfile();        
        login(user, result.token); 
        alert("Registration successful! Welcome to BuyLo.");
        
        // Go straight to the home/products page instead of login
        navigate("/"); 
    }
    }catch( error){
        console.error("Error creating account:", error);
    }

    
  };

  return (
    <main className="container signup-container">
      <article>
        <header className="signup-header">
          <h2>CREATE YOUR ACCOUNT</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">
            First Name:
            <input
              type="text"
              id="firstName"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="last_Name">
            Last Name:
            <input
              type="text"
              id="lastName"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="email">
            Email Address:
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="password">
            Create Password:
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="confirmPassword">
            Confirm Password:
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          <fieldset>
            <label htmlFor="agreeToTerms">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              By creating an account, you agree to our 
              <Link to="/terms"> Terms & Conditions</Link>
            </label>
          </fieldset>

          <button type="submit" className="btn-signup">
            [ CREATE ACCOUNT ]
          </button>
        </form>

        <footer className="signup-footer">
          <p>
            [Already have an account? <Link to="/login">Sign In</Link>]
          </p>
        </footer>
      </article>
    </main>
  );
};

export default SignUpPage;