import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHistory } from '../services/testService'

const CAT_COLOR = {
  'tecnología':    'bg-blue-100 text-blue-700',
  'diseño':        'bg-pink-100 text-pink-700',
  'análisis':      'bg-amber-100 text-amber-700',
  'innovación':    'bg-violet-100 text-violet-700',
  'comunicación':  'bg-teal-100 text-teal-700',
  'administración':'bg-orange-100 text-orange-700',
  'seguridad':     'bg-red-100 text-red-700',
}
const defaultCat = 'bg-gray-100 text-gray-600'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function AffinityBadge({ pct }) {
  const cls = pct >= 70 ? 'bg-green-100 text-green-700' :
              pct >= 40 ? 'bg-blue-100 text-blue-700'   : 'bg-gray-100 text-gray-500'
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>{pct}%</span>
  )
}

function ResultCard({ result, index }) {
  const [open, setOpen] = useState(index === 0)

  const catScores = result.categoryScores instanceof Map
    ? Object.fromEntries(result.categoryScores)
    : result.categoryScores ?? {}

  const topCat = Object.entries(catScores).sort(([,a],[,b]) => b - a)[0]
  const careers = result.recommendedCareers ?? []

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* cabecera clickeable */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold flex items-center justify-center">
            #{index + 1}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{formatDate(result.createdAt)}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Puntaje total: <strong>{result.totalScore}</strong>
              {topCat && <> · Área principal: <span className={`font-semibold px-1.5 py-0.5 rounded-md capitalize ${CAT_COLOR[topCat[0]] ?? defaultCat}`}>{topCat[0]}</span></>}
            </p>
          </div>
        </div>
        <span className="text-gray-400 text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-5 border-t border-gray-50">
          {/* Carreras */}
          {careers.length > 0 && (
            <div className="pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Carreras recomendadas</p>
              <div className="space-y-2">
                {careers.map((c, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-indigo-500' : 'bg-violet-400'}`}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{c.title}</span>
                    </div>
                    <AffinityBadge pct={c.affinity} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorías */}
          {Object.keys(catScores).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Puntajes por área</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(catScores)
                  .sort(([,a],[,b]) => b - a)
                  .map(([cat, score]) => (
                    <span key={cat} className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${CAT_COLOR[cat] ?? defaultCat}`}>
                      {cat}: {score}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TestHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(() => setError('No se pudo cargar el historial.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/test-vocacional" className="text-xs text-gray-400 hover:text-gray-600">← Volver al test</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Historial de tests</h1>
          <p className="text-gray-500 text-sm">{!loading && `${history.length} test${history.length !== 1 ? 's' : ''} realizados`}</p>
        </div>
        <Link
          to="/test-vocacional"
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          📝 Nuevo test
        </Link>
      </div>

      {/* Estados */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <span className="text-6xl opacity-30">📋</span>
          <h3 className="text-lg font-bold text-gray-700">Sin historial todavía</h3>
          <p className="text-gray-400 text-sm">Realiza tu primer test vocacional para ver los resultados aquí.</p>
          <Link to="/test-vocacional"
            className="bg-violet-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-violet-700 transition-colors">
            Hacer el test ahora
          </Link>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="space-y-4">
          {history.map((r, i) => (
            <ResultCard key={r._id ?? i} result={r} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
