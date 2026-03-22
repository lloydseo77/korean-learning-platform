import { Routes, Route } from 'react-router-dom'
import './App.css'
import Lessons from './pages/Lessons'
import Dashboard from './pages/Dashboard'
import LessonDetails from './pages/LessonDetails'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/lessons/:id" element={<LessonDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
