import React, { useMemo, useState } from 'react'
import useCareers from '../hooks/useCareers'
import CareerCard from '../components/CareerCard'

function filterCareers(list, q, careerFilter) {
  return list.filter((c) => {
    if (q && !c.title.toLowerCase().includes(q.toLowerCase())) return false
    if (careerFilter && c.title !== careerFilter) return false
    return true
  })
}

export default function Catalog() {
  const { careers: CAREERS, loading, error } = useCareers()
  const [q, setQ] = useState('')
  const [careerFilter, setCareerFilter] = useState('')
  const [page, setPage] = useState(1)
  const per = 6

  const filtered = useMemo(() => filterCareers(CAREERS, q, careerFilter), [CAREERS, q, careerFilter])
  const total = filtered.length
  const pages = Math.ceil(total / per)
  const items = filtered.slice((page - 1) * per, page * per)
  const careersList = [...new Set(CAREERS.map((c) => c.title))]

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Catalogo de carreras</h1>
            <p className="text-sm text-gray-600 mt-2">
              Solo carreras del Departamento de Tecnologia Digital de TECSUP - Sede Santa Anita (Lima).
            </p>
          </div>
          <div className="text-xs text-gray-500">{total} carreras disponibles</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar carrera"
            className="search-input max-w-md"
          />
          <select
            value={careerFilter}
            onChange={(e) => setCareerFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Todas las carreras</option>
            {careersList.map((career) => (
              <option key={career} value={career}>{career}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-600">Cargando carreras...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((c) => (
              <CareerCard
                key={c._id || c.id || c.codigo}
                career={c}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div>Mostrando {items.length} de {total} resultados</div>
            <div className="space-x-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="btn-secondary px-3 py-1 rounded">Anterior</button>
              <span>{page}/{pages || 1}</span>
              <button onClick={() => setPage((p) => Math.min(pages || 1, p + 1))} className="btn-secondary px-3 py-1 rounded">Siguiente</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
