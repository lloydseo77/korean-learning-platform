import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, loading } = useAuthContext()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
    if (!error) {
      navigate('/lessons')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Log In</h1>
        <p className="auth-subtitle">Welcome back to KorLearn</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
