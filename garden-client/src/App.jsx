import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Onboarding from './components/Onboarding'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Garden from './components/Garden'
import Settings from './components/Settings'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/settings" element={<Settings />} />

        {/* Add more routes here later */}

      </Routes>
    </Router>
  )
}

export default App
