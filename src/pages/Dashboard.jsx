import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCareers from '../hooks/useCareers'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

function Dashboard() {
  const nav = useNavigate()
  const { careers, loading: careersLoading } = useCareers()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [comparator, setComparator] = useState([])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const p = JSON.parse(localStorage.getItem('vocai_profile') || 'null')
      const h = JSON.parse(localStorage.getItem('vocai_history') || '[]')
      const c = JSON.parse(localStorage.getItem('vocai_comparator') || '[]')
      setProfile(p)
      setHistory(h)
      setComparator(c)
      setLoading(false)
    }, 250)
  }, [])

  const progressPercent = useMemo(() => {
    if (!profile) return 0
    const vals = Object.values(profile.scores || {})
    if (vals.length === 0) return 0
    const maxPer = 3 * (Object.keys(profile.scores).length)
    const total = vals.reduce((a, b) => a + b, 0)
    return Math.round((total / maxPer) * 100)
  }, [profile])

  const topRecommendations = useMemo(() => {
    if (!profile) return []
    return profile.top3.map((t) => ({ ...t, detail: careers.find((c) => c.id === t.id) }))
  }, [profile, careers])

  const areaLabels = useMemo(() => {
    if (!profile) return []
    return Object.keys(profile.scores)
  }, [profile])

  const areaData = useMemo(() => {
    if (!profile) return {}
    return {
      labels: areaLabels,
      datasets: [
        {
          label: 'Afinidad',
          data: areaLabels.map((l) => profile.scores[l] || 0),
          backgroundColor: 'rgba(34,197,94,0.6)'
        }
      ]
    }
  }, [profile, areaLabels])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-white rounded shadow" />
          <div className="h-28 bg-white rounded shadow" />
          <div className="h-28 bg-white rounded shadow" />
        </div>
        <div className="h-64 bg-white rounded shadow" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Bienvenido al Panel Estudiante</h1>
          <p className="text-sm text-gray-600">
            Revisa tu perfil vocacional y explora las carreras del Departamento de Tecnología Digital de TECSUP – Sede
            Lima. Completa el cuestionario para obtener recomendaciones personalizadas.
          </p>
        </div>
          <div className="flex gap-2">
            <button onClick={() => nav('/questionnaire')} className="v-btn px-4 py-2 rounded">
              Comenzar cuestionario
            </button>
            <Link
              to="/catalog"
              className="btn-secondary px-4 py-2 rounded inline-flex items-center justify-center"
              style={{ width: 'auto', textDecoration: 'none' }}
            >
              Ir al catálogo
            </Link>
          </div>
      </div>

      {/* Cards principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progreso */}
        <div className="card-premium flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Progreso vocacional</div>
              <div className="text-xl font-semibold">{progressPercent}%</div>
            </div>
            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full">
              <div className="text-lg font-bold">{progressPercent}%</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 h-2 rounded overflow-hidden">
              <div style={{ width: `${progressPercent}%` }} className="h-2 bg-green-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Basado en tu último perfil</div>
          </div>
        </div>

        {/* Comparador */}
        <div className="card-premium">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Comparador</div>
              <div className="text-xl font-semibold">{comparator.length} / 3</div>
            </div>
            <div>
              <Link
                to="/comparator"
                className="btn-secondary px-3 py-1 rounded inline-flex items-center justify-center"
                style={{ width: 'auto', textDecoration: 'none' }}
              >
                Abrir
              </Link>
            </div>
          </div>
          <ul className="mt-2 list-disc ml-5 text-sm">
            {comparator.slice(0, 3).map((c) => (
              <li key={c.id}>{c.title}</li>
            ))}
            {comparator.length === 0 && <li className="text-gray-400">Sin elementos</li>}
          </ul>
        </div>

        {/* Últimas recomendaciones */}
        <div className="card-premium">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-500">Últimas recomendaciones</div>
              <div className="text-xl font-semibold">{profile ? 'Generado' : 'Sin perfil'}</div>
            </div>
            <div>
              <Link
                to="/profile"
                className="btn-secondary px-3 py-1 rounded inline-flex items-center justify-center"
                style={{ width: 'auto', textDecoration: 'none' }}
              >
                Ver perfil
              </Link>
            </div>
          </div>

          {profile ? (
            <ol className="list-decimal ml-5 text-sm">
              {topRecommendations.map((t) => (
                <li key={t.id} className="mb-2">
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-xs text-gray-500">Afinidad: {t.score}</div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-sm text-gray-400">
              Aún no has generado un perfil. Completa el cuestionario.
            </div>
          )}
        </div>
      </div>

      {/* Resumen por áreas + actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 card-premium">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Resumen por áreas</h2>
            <div className="text-sm text-gray-500">Afinidad detectada</div>
          </div>
          <div className="mt-4">
            {profile ? (
              <Bar data={areaData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            ) : (
              <div className="text-sm text-gray-500">
                No hay datos. Realiza el cuestionario para ver tus áreas.
              </div>
            )}
          </div>
        </div>

        <div className="card-premium">
          <h2 className="text-xl font-semibold">Actividad reciente</h2>
          <div className="mt-3 space-y-3">
            {history.length === 0 ? (
              <div className="text-sm text-gray-400">Sin actividad reciente</div>
            ) : (
              history.slice(0, 5).map((h, idx) => (
                <div key={idx} className="p-2 border rounded">
                  <div className="text-sm font-medium">{new Date(h.date).toLocaleString()}</div>
                  <div className="text-xs text-gray-600">
                    Top: {h.top3.map((t) => t.title).join(', ')}
                  </div>
                  <div className="mt-2">
                    <Link to="/profile" className="btn-secondary text-sm">
                      Ver perfil
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Botones inferiores */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Link
          to="/catalog"
          className="btn-secondary px-4 py-2 rounded inline-flex items-center justify-center"
          style={{ width: 'auto', textDecoration: 'none' }}
        >
          Explorar catálogo
        </Link>

        <Link
          to="/questionnaire"
          className="btn-secondary px-4 py-2 rounded inline-flex items-center justify-center"
          style={{ width: 'auto', textDecoration: 'none' }}
        >
          Hacer cuestionario
        </Link>

        <Link
          to="/comparator"
          className="btn-secondary px-4 py-2 rounded inline-flex items-center justify-center"
          style={{ width: 'auto', textDecoration: 'none' }}
        >
          Ir al comparador
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
