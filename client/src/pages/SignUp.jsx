import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./SignUp.css";
import { supabase } from "../supabaseClient";

function SignUp() {
  const [currentTab, setCurrentTab] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    activities: [],
    borough: "",
    year: "",
  });
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const activities = [
    "Visit a museum",
    "Try new food",
    "Explore Central Park",
    "Coffee shops",
    "Live music",
    "Art galleries",
    "Sports events",
    "Theater shows",
    "Night clubs",
    "Hiking trails",
  ];

  const boroughs = [
    "Bronx",
    "Brooklyn",
    "Manhattan",
    "Queens",
    "Staten Island",
  ];
  const years = ["Freshman", "Sophomore", "Junior", "Senior"];

  // Handle keyboard swipes
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (currentTab === 2 && currentActivityIndex < activities.length) {
        if (e.key === "ArrowLeft") {
          handleSwipe("left");
        } else if (e.key === "ArrowRight") {
          handleSwipe("right");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentTab, currentActivityIndex, activities.length]);

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);

    // If swiped right, add to selected activities
    if (direction === "right") {
      const activity = activities[currentActivityIndex];
      if (!formData.activities.includes(activity)) {
        setFormData({
          ...formData,
          activities: [...formData.activities, activity],
        });
      }
    }

    // Move to next card after animation
    setTimeout(() => {
      setCurrentActivityIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentTab < 3) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create user in the unified 'user' table
        // Convert activities array to object format for interests
        const interestsObject = {};
        formData.activities.forEach(activity => {
          interestsObject[activity] = true;
        });

        const { error: userError } = await supabase
          .from("user")
          .insert([{
            id: authData.user.id, // Use Supabase auth UUID
            username: formData.username,
            display_name: formData.displayName,
            pfp: null,
            bio: null,
            borough: formData.borough,
            year: formData.year,
            interests: interestsObject,
            follows_ids: {},
            post_ids: null,
            group_ids: null,
            message_ids: null,
          }]);
        
        if (userError) throw userError;

        alert(
          "Sign up successful! Please check your email to confirm your account."
        );
        navigate("/login");
      }

    } catch (error) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Join Lexington Links</h1>
        <p className="subtitle">
          Connect with students who share your interests
        </p>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`step ${currentTab >= 1 ? "active" : ""}`}>1</div>
          <div className="progress-line"></div>
          <div className={`step ${currentTab >= 2 ? "active" : ""}`}>2</div>
          <div className="progress-line"></div>
          <div className={`step ${currentTab >= 3 ? "active" : ""}`}>3</div>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* TAB 1: Basic Info */}
          {currentTab === 1 && (
            <div className="tab-content fade-in">
              <h2>Basic Information</h2>
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

              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="How should we call you?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Choose a secure password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a unique @username"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: Activity Cards */}
          {currentTab === 2 && (
            <div className="tab-content fade-in">
              <h2>Pick Your Interests</h2>
              <p className="instruction">
                Use ← → arrow keys to swipe cards
                <br />
                <span className="hint-text">← Skip | Like →</span>
              </p>

              <div className="card-container">
                {currentActivityIndex < activities.length ? (
                  <div
                    className={`activity-card ${
                      swipeDirection ? `swipe-${swipeDirection}` : ""
                    }`}
                  >
                    <div className="card-content">
                      <h3>{activities[currentActivityIndex]}</h3>
                      <p className="card-number">
                        {currentActivityIndex + 1} / {activities.length}
                      </p>
                    </div>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="swipe-button skip"
                        onClick={() => handleSwipe("left")}
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        className="swipe-button like"
                        onClick={() => handleSwipe("right")}
                      >
                        ♥
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="completion-message fade-in">
                    <h3>Great choices! ✨</h3>
                    <p>You selected {formData.activities.length} activities</p>
                    <div className="selected-activities">
                      {formData.activities.map((activity, idx) => (
                        <span key={idx} className="activity-tag">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Location & Year */}
          {currentTab === 3 && (
            <div className="tab-content fade-in">
              <h2>Almost Done!</h2>

              <div className="form-group">
                <label>Select Your Borough</label>
                <p className="map-hint">
                  Click on the map to select your borough
                </p>

                <svg
                  className="nyc-map"
                  viewBox="0 0 600 700"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Bronx - Top */}
                  <path
                    d="M 320 100 L 380 85 L 440 92 L 480 115 L 510 150 L 525 190 L 518 225 L 490 245 L 450 252 L 405 245 L 365 225 L 335 195 L 315 160 L 308 125 Z"
                    className={`borough ${
                      formData.borough === "Bronx" ? "selected" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, borough: "Bronx" })
                    }
                  />
                  <text x="410" y="180" className="borough-label">
                    Bronx
                  </text>

                  {/* Manhattan - Center left, vertical */}
                  <path
                    d="M 250 230 L 265 205 L 280 185 L 295 172 L 310 165 L 325 178 L 332 205 L 340 245 L 348 300 L 355 365 L 358 430 L 355 470 L 348 500 L 332 515 L 310 508 L 295 485 L 285 445 L 275 390 L 268 325 L 262 270 Z"
                    className={`borough ${
                      formData.borough === "Manhattan" ? "selected" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, borough: "Manhattan" })
                    }
                  />
                  <text x="310" y="350" className="borough-label">
                    Manhattan
                  </text>

                  {/* Queens - Right side */}
                  <path
                    d="M 365 260 L 405 245 L 455 252 L 510 275 L 555 310 L 580 350 L 592 395 L 585 442 L 565 475 L 530 495 L 485 502 L 440 495 L 400 475 L 372 447 L 360 415 L 355 370 L 360 315 Z"
                    className={`borough ${
                      formData.borough === "Queens" ? "selected" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, borough: "Queens" })
                    }
                  />
                  <text x="470" y="385" className="borough-label">
                    Queens
                  </text>

                  {/* Brooklyn - Bottom right */}
                  <path
                    d="M 335 525 L 375 517 L 425 525 L 475 542 L 515 565 L 540 595 L 547 630 L 533 662 L 505 682 L 462 690 L 415 682 L 375 660 L 345 630 L 325 595 L 318 560 Z"
                    className={`borough ${
                      formData.borough === "Brooklyn" ? "selected" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, borough: "Brooklyn" })
                    }
                  />
                  <text x="435" y="615" className="borough-label">
                    Brooklyn
                  </text>

                  {/* Staten Island - Bottom left, separated */}
                  <path
                    d="M 80 575 L 135 560 L 185 567 L 220 590 L 240 625 L 248 665 L 235 705 L 208 732 L 165 745 L 115 738 L 75 715 L 48 680 L 40 640 L 55 600 Z"
                    className={`borough ${
                      formData.borough === "Staten Island" ? "selected" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, borough: "Staten Island" })
                    }
                  />
                  <text x="145" y="660" className="borough-label">
                    Staten Island
                  </text>
                </svg>

                {formData.borough && (
                  <p className="selected-borough">
                    ✓ Selected: <strong>{formData.borough}</strong>
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your year</option>
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Add an error message display */}
          {error && (
            <div className="tab-content">
              <p className="error-message" style={{ color: "red" }}>
                Error: {error}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="nav-buttons">
            {currentTab > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="nav-btn"
                disabled={loading}
              >
                ← Previous
              </button>
            )}
            {currentTab < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="nav-btn next"
              >
                Next →
              </button>
            ) : (
              <button type="submit" className="nav-btn submit" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            )}
          </div>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
