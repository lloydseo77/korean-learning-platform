import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { user, logout, loading } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-start">
        <Link to="/" className="navbar-brand">
          KorLearn
        </Link>
        {user && (
          <div className="navbar-links">
            <Link to="/lessons" className="nav-link">
              Lessons
            </Link>
            <Link to="/friends" className="nav-link">
              Friends
            </Link>
          </div>
        )}
      </div>
      <div className="navbar-end">
        {user ? (
          <>
            <span className="user-greeting">Hi, {user.name}</span>
            <Link to="/profile" className="profile-button">
              👤
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Log Out
            </button>
          </>
        ) : !loading ? (
          <>
            <Link to="/login" className="nav-link">
              Log In
            </Link>
            <Link to="/register" className="register-button">
              Sign Up
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  )
}

export default Navbar
