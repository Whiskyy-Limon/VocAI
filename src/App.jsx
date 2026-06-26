import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import CareerDetail from './pages/CareerDetail'
import Comparator from './pages/Comparator'
import Assistant from './pages/Assistant'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCareers from './pages/admin/AdminCareers'
import VocationalTest from './pages/VocationalTest'
import TestHistory from './pages/TestHistory'
import Navbar from './components/layout/Navbar'
import { useAuth } from './hooks/useAuth'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Cargando...</div>
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Cargando...</div>
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/" />
  return children
}

const AUTH_PATHS = ['/login', '/register', '/forgot']

export default function App() {
  const { pathname } = useLocation()
  const isAuth = AUTH_PATHS.some(p => pathname.startsWith(p))

  if (isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
          <Route path="/career/:id" element={<PrivateRoute><CareerDetail /></PrivateRoute>} />
          <Route path="/comparator" element={<PrivateRoute><Comparator /></PrivateRoute>} />
          <Route path="/assistant" element={<PrivateRoute><Assistant /></PrivateRoute>} />
          <Route path="/test-vocacional" element={<PrivateRoute><VocationalTest /></PrivateRoute>} />
          <Route path="/test-historial"  element={<PrivateRoute><TestHistory /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/careers" element={<AdminRoute><AdminCareers /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
