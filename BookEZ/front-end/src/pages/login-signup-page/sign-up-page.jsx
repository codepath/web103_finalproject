import "../../css/signup-page.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../services/authAPI";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone_number: "",
    confirmPassword: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const [criteria1, setCriteria1] = useState(false);
  const [criteria2, setCriteria2] = useState(false);
  const [criteria3, setCriteria3] = useState(false);
  const [criteria4, setCriteria4] = useState(false);
  const [signupFailed, setSignUpFailed] = useState(true);

  const handlePasswordChange = (event) => {
    const inputted = event.target.value;
    console.log(inputted);

    const lowerCaseLetters = /[a-z]/; // Use a regex without the 'g' flag for test()
    const upperCaseLetters = /[A-Z]/; // Use a regex without the 'g' flag for test()
    if (lowerCaseLetters.test(inputted) && upperCaseLetters.test(inputted)) {
      setCriteria1(true);
    } else {
      setCriteria1(false);
    }

    const numberContaining = /[0-9]/; // Use a regex without the 'g' flag for test()
    if (numberContaining.test(inputted)) {
      setCriteria2(true);
    } else {
      setCriteria2(false);
    }

    const specialCharacter = /[!@#$%^&*]/; // Use a regex without the 'g' flag for test()
    if (specialCharacter.test(inputted)) {
      setCriteria3(true);
    } else {
      setCriteria3(false);
    }

    if (inputted.length >= 14) {
      setCriteria4(true);
    } else {
      setCriteria4(false);
    }

    if (criteria1 && criteria2 && criteria3 && criteria4) setSignUpFailed(false)

    setUser({ ...user, [event.target.name]: inputted });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const data = await registerUser({
        username: user.username,
        password: user.password,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
      });
      alert("Registration successful! Welcome to our community.");
      console.log("Registration successful", data);
      navigate("/login");
    } catch (error) {
      // alert("Failed to register. Please try again.");
      setSignUpFailed(false)
    }
  };

  return (
    <form className="signup-box-frame" onSubmit={handleSignUp}>
      <div className="signup-box">
        <h1>Create a new account</h1>

        <div className="signup-box-component">
          <label>
            Full Name
            <input
              name="full_name"
              className="signup-input"
              type="text"
              placeholder="Enter your full name"
              value={user.full_name}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Username
            <input
              name="username"
              className="signup-input"
              type="text"
              placeholder="Choose a username"
              value={user.username}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Email
            <input
              name="email"
              className="signup-input"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Phone
            <input
              name="phone_number"
              className="signup-input"
              type="tel"
              placeholder="Enter your phone number"
              value={user.phone_number}
              onChange={handleInputChange}
              required
            />
          </label>

          <div>
            <label>
              Password
              <input
                name="password"
                className="signup-input"
                type="password"
                placeholder="Create a password"
                value={user.password}
                onChange={handlePasswordChange}
                required
              />
            </label>

            <label>
              Confirm Password
              <input
                name="confirmPassword"
                className="signup-input"
                type="password"
                placeholder="Confirm your password"
                value={user.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </label>

            {signupFailed && (
              <p className="validation-criteria">
                Please satisfy all character for password!
              </p>
            )}

            <button 
              className="signin-button signup" 
              type="submit"
            >
              Register
            </button>

            <p
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className="already-have-account"
            >
              <b>
                <i>Already have an account? Log in</i>
              </b>
            </p>
          </div>

          <div className="password-validation">
            <p
              className={
                !criteria1
                  ? "validation-criteria"
                  : "validation-criteria-qualified"
              }
            >
              {criteria1 ? (
                <CheckCircleOutlineRoundedIcon sx={{ color: "limegreen" }} />
              ) : (
                <CancelRoundedIcon sx={{ color: "red" }} />
              )}
              Containing an uppercase and lowercase!
            </p>
            <p
              className={
                !criteria2
                  ? "validation-criteria"
                  : "validation-criteria-qualified"
              }
            >
              {criteria2 ? (
                <CheckCircleOutlineRoundedIcon sx={{ color: "limegreen" }} />
              ) : (
                <CancelRoundedIcon sx={{ color: "red" }} />
              )}
              Containing a number!
            </p>
            <p
              className={
                !criteria3
                  ? "validation-criteria"
                  : "validation-criteria-qualified"
              }
            >
              {criteria3 ? (
                <CheckCircleOutlineRoundedIcon sx={{ color: "limegreen" }} />
              ) : (
                <CancelRoundedIcon sx={{ color: "red" }} />
              )}
              Containing a special character (!@#$%^&*)!
            </p>
            <p
              className={
                !criteria4
                  ? "validation-criteria"
                  : "validation-criteria-qualified"
              }
            >
              {criteria4 ? (
                <CheckCircleOutlineRoundedIcon sx={{ color: "limegreen" }} />
              ) : (
                <CancelRoundedIcon sx={{ color: "red" }} />
              )}
              At least 14 characters!
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUpPage;
