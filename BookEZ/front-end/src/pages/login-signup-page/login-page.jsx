import '../../css/login-page.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginUser } from '../../services/authAPI'

const LoginPage = ({ setCurrentUserId, setJWT }) => {
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState("");
  const [user, setUser] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(user);
    try {
      const response = await loginUser(user);
      console.log('Login successful:', response)
      // alert('Login successful!')
      setUser((prev) => ({...prev})) //, user_id: response.user_id
      setCurrentUserId(response.user_id)
      setJWT(response.token);
      navigate("/");
    } catch (error) {
      setErrorLogin('Login failed. Please check your credentials and try again.')
      console.error('Error logging in:', error)
    } finally {
    }
  }

  return (
    <form className="login-box-frame" onSubmit={handleSubmit}>
      <div className="login-box">
        <h1>Log in to your account</h1>
        <div className="login-box-component">
          <label>
            Email
            <input
              className="login-input"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email here"
              required
            />
          </label>

          <label>
            Password
            <input
              className="login-input"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter your password here"
              required
            />
          </label>

          {errorLogin !== "" && <p>{errorLogin}</p>}
          
          <button type="submit" className="signin-button">
            Log In
          </button>

          <p
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate('/forgot-password')
            }}
            className='forgot-password-and-sign-up'
          >
            <i>Forgot Password?</i>
          </p>
          <p
            onClick={(e) => {
              e.preventDefault()
              navigate('/signup')
            }}
            className='forgot-password-and-sign-up'
          >
            <i>Didn't have an account? Create one now!</i>
          </p>
        </div>
      </div>
    </form>
  )
}

export default LoginPage
