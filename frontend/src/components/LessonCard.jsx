import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

const LessonCard = ({ lesson, onViewExercises, isCompleted }) => {
  const { missionGoal, title, order, xpReward } = lesson
  const { token } = useAuthContext()
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = async (e) => {
    e.stopPropagation() // Prevent navigating to lesson
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    
    setIsResetting(true)
    try {
      const response = await fetch(`${API_URL}/api/progress/lessons/${lesson._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        // Refresh to see updated completion status
        window.location.reload()
      } else {
        console.error('Failed to reset lesson:', response.status)
        setIsResetting(false)
      }
    } catch (error) {
      console.error('Error resetting lesson:', error)
      setIsResetting(false)
    }
  }

  return (
    <button
      type="button"
      className={`lesson-card ${isCompleted ? 'completed' : ''}`}
      onClick={() => onViewExercises?.(lesson)}
      aria-label={`Start lesson: ${title}`}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <div className="completion-badge">
          <span className="checkmark">✓</span>
          <span className="xp-earned">{xpReward} XP</span>
          
          {/* Reset Button */}
          <button
            className="reset-button"
            onClick={handleReset}
            disabled={isResetting}
            title="Reset lesson progress"
            aria-label="Reset lesson progress"
          >
            {isResetting ? '⟳' : '↺'}
          </button>
        </div>
      )}

      <h2 className="lesson-title">Lesson {order}: {title}</h2>
      
      {missionGoal && (
        <p className="lesson-description">{missionGoal}</p>
      )}
      
      <span className="lesson-card-cta">
        {isCompleted ? 'Replay Lesson' : 'Start Lesson'} →
      </span>
    </button>
  )
}

export default LessonCard
