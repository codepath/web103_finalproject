import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./SignUp.css"; // Reuse your existing styles!

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Welcome Back!</h1>
        <p className="subtitle">
          Log in to connect with your community
        </p>

        <form className="signup-form" onSubmit={handleLogin}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Your secure password"
              required
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="tab-content">
              <p className="error-message" style={{ color: "red" }}>
                Error: {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="nav-buttons">
            <button type="submit" className="nav-btn submit" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>
        </form>

        <p className="login-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;