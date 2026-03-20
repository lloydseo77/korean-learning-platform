import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Lessons from './pages/Lessons'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lessons" element={<Lessons />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
