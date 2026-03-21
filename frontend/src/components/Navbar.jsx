import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-start">
        <Link to="/" className="navbar-brand">
          KorLearn
        </Link>
        <div className="navbar-links">
          <Link to="/lessons" className="nav-link">
            Lessons
          </Link>
          <Link to="/friends" className="nav-link">
            Friends
          </Link>
        </div>
      </div>
      <div className="navbar-end">
        <Link to="/profile" className="profile-button">
          👤
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
