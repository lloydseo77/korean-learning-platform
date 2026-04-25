import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLessonsContext } from '../hooks/useLessonsContext'
import { useAuthContext } from '../hooks/useAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// components
import LessonCard from '../components/LessonCard'

const Lessons = () => {
  const { lessons, dispatch, loading, error } = useLessonsContext()
  const { token } = useAuthContext()
  const navigate = useNavigate()
  const [userProgress, setUserProgress] = useState(null)
  const [progressLoading, setProgressLoading] = useState(true)

  const handleViewExercises = (lesson) => {
    navigate(`/lessons/${lesson._id}`)
  }

  useEffect(() => {
    const fetchLessons = async () => {
      dispatch({ type: 'SET_LOADING' })
      try {
        const response = await fetch(`${API_URL}/api/lessons`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const json = await response.json()

        if (response.ok) {
          dispatch({ type: 'SET_LESSONS', payload: json })
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch lessons' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
      }
    }

    if (token) {
      fetchLessons()
    }
  }, [dispatch, token])

  // Fetch user progress for lesson completion badges
  useEffect(() => {
    const fetchUserProgress = async () => {
      setProgressLoading(true)
      try {
        console.log('Fetching user progress from:', `${API_URL}/api/progress/me`)
        const response = await fetch(`${API_URL}/api/progress/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()

        if (response.ok) {
          console.log('User progress fetched:', data)
          setUserProgress(data)
        } else {
          console.error('Failed to fetch progress:', response.status, data)
        }
      } catch (error) {
        console.error('Error fetching user progress:', error)
      } finally {
        setProgressLoading(false)
      }
    }

    if (token) {
      fetchUserProgress()
    }
  }, [token])

  if (loading) return <div className="status-message">Loading lessons...</div>
  if (error) return <div className="status-message error-message">Error: {error}</div>

  // Create a map of lesson IDs to their completion info for quick lookup
  // If progress didn't load, just use empty map - lessons still show
  const lessonCompletionMap = {}
  if (userProgress?.progress) {
    userProgress.progress.forEach(unitData => {
      if (unitData.lessonProgress) {
        unitData.lessonProgress.forEach(lp => {
          lessonCompletionMap[lp.lessonId] = {
            isCompleted: lp.isCompleted,
            completedAt: lp.completedAt
          }
        })
      }
    })
  }

  return (
    <div className="home">
      <h1>Korean Learning Platform</h1>
      <p className="home-subtitle">Choose a lesson to start practicing exercises!</p>
      <div className="lessons">
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonCard 
              key={lesson._id} 
              lesson={lesson} 
              onViewExercises={handleViewExercises}
              isCompleted={lessonCompletionMap[lesson._id]?.isCompleted || false}
            />
          ))
        ) : (
          <p className="status-message">No lessons available yet.</p>
        )}
      </div>
    </div>
  )
}

export default Lessons
