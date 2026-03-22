import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const Dashboard = () => {
  const { user } = useAuthContext()

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {user ? (
          <>
            <h1>Welcome back, {user.name}! 👋</h1>
            <p className="dashboard-subtitle">Continue your Korean learning journey</p>
            <Link to="/lessons" className="dashboard-button">
              Continue Learning →
            </Link>
          </>
        ) : (
          <>
            <h1>Welcome to KorLearn</h1>
            <p className="dashboard-subtitle">Master Korean through context-aware learning</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/register" className="dashboard-button">
                Sign Up
              </Link>
              <Link to="/login" className="dashboard-button" style={{ background: '#f2f7ff', border: '1px solid #c9dcff', color: '#2563eb' }}>
                Log In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
