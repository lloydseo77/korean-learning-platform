import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const Profile = () => {
  const { user, token } = useAuthContext()
  const navigate = useNavigate()
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/api/progress/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()

        if (response.ok) {
          setUserProgress(data)
        }
      } catch (error) {
        console.error('Error fetching user progress:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchUserProgress()
    }
  }, [token])

  if (loading) return <div className="status-message">Loading profile...</div>
  if (!user) return <div className="status-message error-message">Not logged in</div>

  // Calculate level and XP progress
  const totalXp = userProgress?.totalXp || 0
  const XP_PER_LEVEL = 500
  const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpInCurrentLevel = totalXp % XP_PER_LEVEL
  const xpToNextLevel = XP_PER_LEVEL
  const xpProgressPercent = (xpInCurrentLevel / xpToNextLevel) * 100

  // Calculate completion stats
  const allProgress = userProgress?.progress || []
  const totalLessons = allProgress.reduce((sum, unit) => {
    return sum + (unit.lessonProgress?.length || 0)
  }, 0)
  const completedLessons = allProgress.reduce((sum, unit) => {
    return sum + (unit.lessonProgress?.filter(lp => lp.isCompleted)?.length || 0)
  }, 0)
  const completionPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1>Your Profile</h1>
          <div className="user-info">
            <h2>{user?.name || 'User'}</h2>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Level and XP */}
          <div className="stat-card">
            <div className="stat-label">Level</div>
            <div className="stat-value">{currentLevel}</div>
            <div className="xp-info">
              <span>{totalXp.toLocaleString()} Total XP</span>
            </div>
          </div>

          {/* Completion */}
          <div className="stat-card">
            <div className="stat-label">Lessons Completed</div>
            <div className="stat-value">{completedLessons}/{totalLessons}</div>
            <div className="completion-percent">{completionPercent}%</div>
          </div>

          {/* Unlocked Units */}
          <div className="stat-card">
            <div className="stat-label">Units Unlocked</div>
            <div className="stat-value">
              {allProgress.filter(u => u.isUnlocked).length}/{allProgress.length}
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="xp-progress-section">
          <div className="progress-header">
            <span>Level {currentLevel}</span>
            <span>{xpInCurrentLevel}/{xpToNextLevel} XP</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${xpProgressPercent}%` }} />
          </div>
          <p className="progress-text">
            {xpToNextLevel - xpInCurrentLevel} XP until next level
          </p>
        </div>

        {/* Units Breakdown */}
        <div className="units-breakdown">
          <h3>Unit Progress</h3>
          <div className="units-list">
            {allProgress.map((unitData) => {
              const unitCompletedLessons = unitData.lessonProgress?.filter(lp => lp.isCompleted).length || 0
              const unitTotalLessons = unitData.lessonProgress?.length || 0
              const unitPercent = unitTotalLessons > 0 ? Math.round((unitCompletedLessons / unitTotalLessons) * 100) : 0
              
              return (
                <div key={unitData.unitId} className="unit-item">
                  <div className="unit-header">
                    <div>
                      <h4>Unit {unitData.unitNumber}</h4>
                      <p className="unit-lessons">
                        {unitCompletedLessons}/{unitTotalLessons} lessons
                      </p>
                    </div>
                    <div className="unit-xp">+{unitData.totalXpEarned} XP</div>
                  </div>
                  <div className="unit-progress-bar">
                    <div 
                      className="unit-progress-fill"
                      style={{ width: `${unitPercent}%` }}
                    />
                  </div>
                  <div className="unit-status">
                    {unitData.isUnlocked ? (
                      <span className="status-unlocked">✓ Unlocked</span>
                    ) : (
                      <span className="status-locked">🔒 Locked</span>
                    )}
                    <span className="unit-percent">{unitPercent}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="profile-actions">
          <button 
            className="primary-button"
            onClick={() => navigate('/lessons')}
          >
            Continue Learning →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
