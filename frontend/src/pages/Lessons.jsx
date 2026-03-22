import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLessonsContext } from '../hooks/useLessonsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// components
import LessonCard from '../components/LessonCard'

const Lessons = () => {
  const { lessons, dispatch, loading, error } = useLessonsContext()
  const { token } = useAuthContext()
  const navigate = useNavigate()

  const handleViewExercises = (lesson) => {
    navigate(`/lessons/${lesson._id}`)
  }

  useEffect(() => {
    const fetchLessons = async () => {
      dispatch({ type: 'SET_LOADING' })
      try {
        const response = await fetch('/api/lessons', {
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

  if (loading) return <div className="status-message">Loading lessons...</div>
  if (error) return <div className="status-message error-message">Error: {error}</div>

  return (
    <div className="home">
      <h1>Korean Learning Platform</h1>
      <p className="home-subtitle">Choose a lesson to start practicing exercises!</p>
      <div className="lessons">
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} onViewExercises={handleViewExercises} />
          ))
        ) : (
          <p className="status-message">No lessons available yet.</p>
        )}
      </div>
    </div>
  )
}

export default Lessons
