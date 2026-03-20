import { useContext } from 'react'
import { LessonContext } from '../context/LessonContext.jsx'

export const useLessonsContext = () => {
  const context = useContext(LessonContext)
  
  if (!context) {
    throw new Error('useLessonsContext must be used within a LessonsContextProvider')
  }
  
  return context
}
