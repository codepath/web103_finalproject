import { useState } from "react";
import { useNavigate } from "react-router";
import "../Pages_css/AuthPage.css";

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      localStorage.setItem("flowerhuntToken", data.token);
      localStorage.setItem("flowerhuntUser", JSON.stringify(data.user));

      window.dispatchEvent(new Event("authChanged"));

      setMessage(data.message || "Success");
      setLoading(false);

      navigate("/");
    } catch (error) {
      console.error("Auth error:", error);
      setMessage("Could not connect to the server");
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>{isLogin ? "Login" : "Create Account"}</h1>

        <p className="auth-subtitle">
          {isLogin
            ? "Log in to your FlowerHunt account."
            : "Create a FlowerHunt account."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <button
          className="auth-toggle"
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin
            ? "Need an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </section>
    </main>
  );
};

export default AuthPage;