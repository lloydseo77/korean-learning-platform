import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LessonsContextProvider } from './context/LessonContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LessonsContextProvider>
      <App />
    </LessonsContextProvider>
  </StrictMode>,
)
