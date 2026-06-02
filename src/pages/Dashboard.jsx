import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useCareers from '../hooks/useCareers'

function Dashboard() {
  const { careers, loading } = useCareers()
  const [comparator, setComparator] = useState([])

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('vocai_comparator') || '[]')
    setComparator(c)
  }, [])

  const totalCareers = useMemo(() => careers.length, [careers])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-white rounded shadow" />
          <div className="h-28 bg-white rounded shadow" />
          <div className="h-28 bg-white rounded shadow" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">VocAI</div>
            <h1 className="text-3xl font-semibold tracking-tight mt-2">
              Panel VocAI - Tecnologia Digital
            </h1>
            <p className="text-sm text-gray-600 mt-2 max-w-2xl">
              Sistema enfocado en las carreras del Departamento de Tecnologia Digital de TECSUP - Sede Santa Anita
              (Lima). Explora el catalogo, compara perfiles y conversa con el asistente por voz.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/assistant" className="v-btn px-4 py-2 rounded">Asistente por voz</Link>
            <Link
              to="/catalog"
              className="btn-secondary px-4 py-2 rounded inline-flex items-center justify-center"
              style={{ width: 'auto', textDecoration: 'none' }}
            >
              Ir al catalogo
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-premium">
          <div className="text-sm text-gray-500">Carreras disponibles</div>
          <div className="text-3xl font-semibold mt-2">{totalCareers}</div>
          <div className="text-xs text-gray-500 mt-1">Tecnologia Digital - Santa Anita</div>
        </div>

        <div className="card-premium">
          <div className="text-sm text-gray-500">Comparador</div>
          <div className="text-3xl font-semibold mt-2">{comparator.length} / 3</div>
          <div className="text-xs text-gray-500 mt-1">Selecciona hasta 3 carreras</div>
          <div className="mt-3">
            <Link
              to="/comparator"
              className="btn-secondary px-3 py-1 rounded inline-flex items-center justify-center"
              style={{ width: 'auto', textDecoration: 'none' }}
            >
              Abrir comparador
            </Link>
          </div>
        </div>

        <div className="card-premium">
          <div className="text-sm text-gray-500">Asistente VocAI</div>
          <div className="text-xl font-semibold mt-2">Conversacion por voz</div>
          <div className="text-xs text-gray-500 mt-1">Recomendaciones con datos reales</div>
          <div className="mt-3">
            <Link
              to="/assistant"
              className="btn-secondary px-3 py-1 rounded inline-flex items-center justify-center"
              style={{ width: 'auto', textDecoration: 'none' }}
            >
              Iniciar chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
