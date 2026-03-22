import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Navbar from './components/Navbar'
import { LessonsContextProvider } from './context/LessonContext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Navbar />
        <div id="content">
          <LessonsContextProvider>
            <App />
          </LessonsContextProvider>
        </div>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
