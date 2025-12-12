import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import CareerDetail from './pages/CareerDetail'
import Comparator from './pages/Comparator'
import Questionnaire from './pages/Questionnaire'
import Profile from './pages/Profile'
import History from './pages/History'
import Assistant from './pages/Assistant'
import Navbar from './components/layout/Navbar'
import { useAuth } from './hooks/useAuth'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Cargando...</div>
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
          <Route path="/career/:id" element={<PrivateRoute><CareerDetail /></PrivateRoute>} />
          <Route path="/comparator" element={<PrivateRoute><Comparator /></PrivateRoute>} />
          <Route path="/assistant" element={<PrivateRoute><Assistant /></PrivateRoute>} />
          <Route path="/questionnaire" element={<PrivateRoute><Questionnaire /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
