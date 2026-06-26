import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useCareers from '../hooks/useCareers'
import { useAuth } from '../hooks/useAuth'

function StatCard({ icon, label, value, sub, action }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      </div>
      {action && (
        <Link
          to={action.to}
          className="mt-auto inline-flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-1.5 transition-colors w-fit"
        >
          {action.label} →
        </Link>
      )}
    </div>
  )
}

function QuickAction({ icon, title, desc, to, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-700',
    indigo: 'from-indigo-500 to-indigo-700',
    violet: 'from-violet-500 to-violet-700',
    emerald: 'from-emerald-500 to-emerald-700',
  }
  return (
    <Link
      to={to}
      className={`bg-gradient-to-br ${colors[color]} text-white rounded-2xl p-5 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all`}
    >
      <span className="text-3xl">{icon}</span>
      <div className="font-semibold text-base">{title}</div>
      <div className="text-xs text-white/75 leading-relaxed">{desc}</div>
    </Link>
  )
}

function Dashboard() {
  const { careers, loading } = useCareers()
  const { user } = useAuth()
  const [comparator, setComparator] = useState([])

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('vocai_comparator') || '[]')
    setComparator(c)
  }, [])

  const totalCareers = useMemo(() => careers.length, [careers])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const firstName = user?.name?.split(' ')[0] || 'estudiante'

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-100 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-36 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">

      {/* Hero / bienvenida */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl px-8 py-7 text-white overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 right-24 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm mb-1">{greeting()}, <strong>{firstName}</strong> 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              Panel VocAI
            </h1>
            <p className="text-blue-100 text-sm mt-2 max-w-xl">
              Explora carreras de Tecnología Digital en TECSUP, compara opciones y consulta al asistente de IA para orientarte vocacionalmente.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/assistant"
              className="bg-white text-blue-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              🤖 Hablar con IA
            </Link>
            <Link
              to="/catalog"
              className="bg-white/20 hover:bg-white/30 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
            >
              📚 Ver catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon="🎓"
          label="Carreras disponibles"
          value={totalCareers}
          sub="Tecnología Digital — Santa Anita"
          action={{ to: '/catalog', label: 'Explorar catálogo' }}
        />
        <StatCard
          icon="⚖️"
          label="Comparador"
          value={`${comparator.length} / 3`}
          sub="Carreras en tu comparador"
          action={{ to: '/comparator', label: 'Abrir comparador' }}
        />
        <StatCard
          icon="🤖"
          label="Asistente IA"
          value="VocAI"
          sub="Orientación por voz y chat"
          action={{ to: '/assistant', label: 'Iniciar chat' }}
        />
      </div>

      {/* Acciones rápidas */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">¿Qué quieres hacer hoy?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            icon="📝"
            title="Test Vocacional"
            desc="Responde preguntas y descubre qué carrera se adapta a ti"
            to="/test-vocacional"
            color="violet"
          />
          <QuickAction
            icon="🤖"
            title="Asistente IA"
            desc="Conversa con nuestra IA sobre tus intereses y habilidades"
            to="/assistant"
            color="blue"
          />
          <QuickAction
            icon="📚"
            title="Catálogo"
            desc="Explora todas las carreras de Tecnología Digital"
            to="/catalog"
            color="indigo"
          />
          <QuickAction
            icon="⚖️"
            title="Comparar"
            desc="Compara hasta 3 carreras lado a lado"
            to="/comparator"
            color="emerald"
          />
        </div>
      </div>

      {/* Tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <span className="text-xl">💡</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">Consejo para empezar</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Prueba el <strong>Test Vocacional</strong> para que el asistente conozca tus intereses y pueda recomendarte la carrera más adecuada para ti.
          </p>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
