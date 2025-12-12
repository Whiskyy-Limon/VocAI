import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  function handleLogout() {
    logout()
    nav('/login')
  }

  return (
    <header style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(148,163,184,0.25)', boxShadow: '0 4px 20px rgba(15,23,42,0.05)' }}>
      <div className="container mx-auto py-3.5 px-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">VocAI</Link>
        <nav className="navbar-links flex items-center gap-6">
          {user ? (
            <>
              <Link to="/" className="text-sm">Dashboard</Link>
              <Link to="/catalog" className="text-sm">Catálogo</Link>
              <Link to="/assistant" className="text-sm">Asistente</Link>
              <Link to="/questionnaire" className="text-sm">Cuestionario</Link>
              <Link to="/comparator" className="text-sm">Comparador</Link>
              <button onClick={handleLogout} className="text-sm text-red-500">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Entrar</Link>
              <Link to="/register" className="text-sm">Registro</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
