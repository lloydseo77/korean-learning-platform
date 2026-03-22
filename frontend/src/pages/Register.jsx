import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { register, error, loading } = useAuthContext()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await register(email, password, name)
    if (!error) {
      navigate('/lessons')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join KorLearn and start learning</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
