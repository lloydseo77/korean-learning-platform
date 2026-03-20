import { createContext, useReducer } from 'react'

export const LessonContext = createContext()

const initialState = {
  lessons: [],
  loading: false,
  error: null
}

const lessonReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LESSONS':
      return { ...state, lessons: action.payload, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: true, error: null }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

export const LessonsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(lessonReducer, initialState)

  return (
    <LessonContext.Provider value={{ ...state, dispatch }}>
      {children}
    </LessonContext.Provider>
  )
}
