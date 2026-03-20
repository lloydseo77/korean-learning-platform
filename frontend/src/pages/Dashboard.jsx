import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Welcome to the Korean Learning Platform</h1>
        <p className="dashboard-subtitle">Master Korean through context-aware learning</p>
        <Link to="/lessons" className="dashboard-button">
          Start Learning →
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
