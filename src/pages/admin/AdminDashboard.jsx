import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const CARDS = [
  {
    to: '/admin/careers',
    icon: '🎓',
    title: 'Gestión de Carreras',
    desc: 'Crear, editar y desactivar carreras del catálogo.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    to: '/admin/questions',
    icon: '📝',
    title: 'Preguntas del Test',
    desc: 'Administrar las preguntas del test vocacional.',
    color: 'from-violet-500 to-violet-700',
  },
]

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl px-8 py-7 text-white overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative z-10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Panel de Administración</span>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">Bienvenido, {user?.name || user?.email} 👋</h1>
          <p className="text-slate-400 text-sm mt-1">Gestiona el contenido de VocAI desde aquí.</p>
        </div>
      </div>

      {/* Accesos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {CARDS.map(c => (
          <Link
            key={c.to}
            to={c.to}
            className={`bg-gradient-to-br ${c.color} text-white rounded-2xl p-6 flex flex-col gap-3 hover:shadow-xl hover:-translate-y-0.5 transition-all`}
          >
            <span className="text-4xl">{c.icon}</span>
            <div>
              <p className="font-bold text-lg">{c.title}</p>
              <p className="text-white/70 text-sm mt-0.5">{c.desc}</p>
            </div>
            <span className="text-white/60 text-sm mt-auto">Gestionar →</span>
          </Link>
        ))}
      </div>

      {/* Back */}
      <div>
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">← Volver al inicio</Link>
      </div>
    </div>
  )
}
