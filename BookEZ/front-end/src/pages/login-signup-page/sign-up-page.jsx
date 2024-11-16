import '../../css/signup-page.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { registerUser } from '../../services/authAPI'

const SignUpPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    phone_number: '',
    confirmPassword: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    if (user.password !== user.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const data = await registerUser({
        username: user.username,
        password: user.password,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
      })
      alert('Registration successful! Welcome to our community.')
      console.log('Registration successful', data)
      navigate('/login')
    } catch (error) {
      alert('Failed to register. Please try again.')
    }
  }

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

          <label>
            Password
            <input
              name="password"
              className="signup-input"
              type="password"
              placeholder="Create a password"
              value={user.password}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
            />
          </label>

          <button className="signin-button" type="submit">
            Register
          </button>
          <p
            onClick={(e) => {
              e.preventDefault()
              navigate('/login')
            }}
          >
            <i>Already have an account? Log in</i>
          </p>
        </div>
      </div>
    </form>
  )
}

export default SignUpPage
