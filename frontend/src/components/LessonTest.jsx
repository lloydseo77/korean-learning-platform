import { useEffect, useState } from 'react'

export default function LessonTest() {
  const [lessons, setLessons] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('http://localhost:5000/lessons')
        const data = await response.json()
        setLessons(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchLessons()
  }, [])

  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h1>Lessons ({lessons.length})</h1>
      {lessons.map(lesson => (
        <div key={lesson._id}>
          <h3>{lesson.title}</h3>
          <p>{lesson.description}</p>
        </div>
      ))}
    </div>
  )
}