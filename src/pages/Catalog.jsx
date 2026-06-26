import React, { useMemo, useState } from 'react'
import useCareers from '../hooks/useCareers'
import CareerCard from '../components/CareerCard'

const PER_PAGE = 6

function filterCareers(list, q) {
  if (!q.trim()) return list
  const lower = q.toLowerCase()
  return list.filter(
    c =>
      c.title.toLowerCase().includes(lower) ||
      c.field?.toLowerCase().includes(lower) ||
      c.description?.toLowerCase().includes(lower) ||
      c.skills?.some(s => s.toLowerCase().includes(lower))
  )
}

export default function Catalog() {
  const { careers, loading, error } = useCareers()
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    setPage(1)
    return filterCareers(careers, q)
  }, [careers, q])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-6 py-4">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Tecsup — Tecnología Digital</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Catálogo de Carreras</h1>
            <p className="text-gray-500 text-sm mt-1">Sede Santa Anita, Lima — {careers.length} carreras disponibles</p>
          </div>
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar por nombre, habilidad..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >×</button>
            )}
          </div>
        </div>
      </div>

      {/* Estados */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-64" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {!loading && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">🔎</div>
              <p className="font-medium">Sin resultados para "<span className="text-gray-600">{q}</span>"</p>
              <button onClick={() => setQ('')} className="mt-3 text-sm text-blue-600 hover:underline">Limpiar búsqueda</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map(c => (
                  <CareerCard key={c._id || c.id || c.codigo} career={c} />
                ))}
              </div>

              {/* Paginación */}
              {pages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-gray-500">
                    Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Anterior
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                          n === page
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
