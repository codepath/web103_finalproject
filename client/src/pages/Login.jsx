import { useState } from 'react'
import { useNavigate } from 'react-router'
import './Login.css'

const Login = ({ setLoggedInUser }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.user.id)
      setLoggedInUser(data.user)
      navigate('/')
    } else {
      setError(data.error)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="form-input login-input"
                required
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="form-input login-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="form-input login-input"
              required
            />
          </div>
          <button type="submit" className="btn-primary login-btn">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="btn-outline login-toggle-btn"
        >
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  )
}

export default Login