import { Routes, Route } from 'react-router-dom'
import './App.css'
import Lessons from './pages/Lessons'
import Dashboard from './pages/Dashboard'
import LessonDetails from './pages/LessonDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/lessons/:id" element={<LessonDetails />} />
    </Routes>
  )
}

export default App
