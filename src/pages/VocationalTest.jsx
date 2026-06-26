import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getQuestions, submitTest } from '../services/testService'
import { useAuth } from '../hooks/useAuth'

/* ─── colores por categoría ─── */
const CAT_COLOR = {
  'tecnología':    { bg: 'bg-blue-100',   text: 'text-blue-700',   bar: 'bg-blue-500' },
  'diseño':        { bg: 'bg-pink-100',   text: 'text-pink-700',   bar: 'bg-pink-500' },
  'análisis':      { bg: 'bg-amber-100',  text: 'text-amber-700',  bar: 'bg-amber-500' },
  'innovación':    { bg: 'bg-violet-100', text: 'text-violet-700', bar: 'bg-violet-500' },
  'comunicación':  { bg: 'bg-teal-100',   text: 'text-teal-700',   bar: 'bg-teal-500' },
  'administración':{ bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' },
  'seguridad':     { bg: 'bg-red-100',    text: 'text-red-700',    bar: 'bg-red-500' },
}
const defaultColor = { bg: 'bg-gray-100', text: 'text-gray-700', bar: 'bg-gray-400' }
const catColor = (cat) => CAT_COLOR[String(cat).toLowerCase()] ?? defaultColor

/* ─── pantallas ─── */
const SCREEN = { INTRO: 'intro', TEST: 'test', LOADING: 'loading', RESULT: 'result', ERROR: 'error' }

/* ─── componente barra de progreso ─── */
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Pregunta {current} de {total}</span>
        <span>{pct}% completado</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ─── pantalla de resultado ─── */
function ResultScreen({ result, onRetry, onHistory }) {
  const catScores = result.categoryScores instanceof Map
    ? Object.fromEntries(result.categoryScores)
    : result.categoryScores ?? {}

  const maxScore = Math.max(...Object.values(catScores), 1)

  const sortedCats = Object.entries(catScores)
    .sort(([, a], [, b]) => b - a)

  const careers = result.recommendedCareers ?? []

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      {/* Header resultado */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl px-8 py-8 text-white overflow-hidden text-center">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-bold">¡Test completado!</h2>
        <p className="text-blue-200 text-sm mt-1">Aquí están tus resultados vocacionales</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2 text-sm font-semibold">
          Puntaje total: <span className="text-white text-base font-bold">{result.totalScore}</span>
        </div>
      </div>

      {/* Puntajes por categoría */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> Tus áreas de interés
        </h3>
        <div className="space-y-3">
          {sortedCats.map(([cat, score]) => {
            const c = catColor(cat)
            const pct = Math.round((score / maxScore) * 100)
            return (
              <div key={cat}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${c.bg} ${c.text}`}>
                    {cat}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{score} pts</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Carreras recomendadas */}
      {careers.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span>🎓</span> Carreras recomendadas para ti
          </h3>
          {careers.map((career, i) => (
            <div key={career.careerId ?? i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0
                    ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-indigo-500' : 'bg-violet-500'}`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{career.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {i === 0 ? '🥇 Mejor coincidencia' : i === 1 ? '🥈 Segunda opción' : '🥉 Tercera opción'}
                    </p>
                  </div>
                </div>
                {/* Círculo de afinidad */}
                <div className="flex-shrink-0 text-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm
                    ${career.affinity >= 70 ? 'bg-green-100 text-green-700' :
                      career.affinity >= 40 ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'}`}>
                    {career.affinity}%
                  </div>
                  <p className="text-xs text-gray-400 mt-1">afinidad</p>
                </div>
              </div>

              {/* Barra de afinidad */}
              <div className="mt-3">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      career.affinity >= 70 ? 'bg-green-500' :
                      career.affinity >= 40 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${career.affinity}%` }}
                  />
                </div>
              </div>

              {/* Por qué se recomienda */}
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                {career.affinity >= 70
                  ? `Tus respuestas muestran una alta afinidad con ${career.title}. Tu perfil encaja muy bien con las habilidades y áreas de esta carrera.`
                  : career.affinity >= 40
                  ? `Tienes una afinidad moderada con ${career.title}. Algunos de tus intereses coinciden con esta carrera.`
                  : `Esta carrera tiene coincidencias básicas con tu perfil. Puede ser interesante explorarla.`}
              </p>

              {career.careerId && (
                <Link
                  to={`/career/${career.careerId}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Ver detalle de la carrera →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRetry}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
        >
          🔄 Repetir test
        </button>
        <Link
          to="/test-historial"
          className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
        >
          📋 Ver historial
        </Link>
        <Link
          to="/assistant"
          className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
        >
          🤖 Hablar con IA
        </Link>
      </div>
    </div>
  )
}

/* ─── componente principal ─── */
export default function VocationalTest() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [screen,    setScreen]    = useState(SCREEN.INTRO)
  const [questions, setQuestions] = useState([])
  const [current,   setCurrent]   = useState(0)       // índice de pregunta activa
  const [answers,   setAnswers]   = useState({})       // { questionId: optionIndex }
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState(null)
  const [loadingQ,  setLoadingQ]  = useState(false)

  /* Cargar preguntas al montar */
  useEffect(() => {
    async function load() {
      setLoadingQ(true)
      try {
        const data = await getQuestions()
        setQuestions(data)
      } catch {
        setError('No se pudieron cargar las preguntas. Intenta más tarde.')
        setScreen(SCREEN.ERROR)
      } finally { setLoadingQ(false) }
    }
    load()
  }, [])

  const q = questions[current]
  const totalQ = questions.length
  const answeredCount = Object.keys(answers).length
  const allAnswered = totalQ > 0 && answeredCount === totalQ

  function selectOption(questionId, optionIndex) {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  function goNext() { if (current < totalQ - 1) setCurrent(c => c + 1) }
  function goPrev() { if (current > 0) setCurrent(c => c - 1) }

  async function handleSubmit() {
    if (!allAnswered) return
    setScreen(SCREEN.LOADING)
    try {
      const payload = Object.entries(answers).map(([questionId, optionIndex]) => ({
        questionId,
        optionIndex,
      }))
      const res = await submitTest(payload)
      setResult(res)
      setScreen(SCREEN.RESULT)
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al enviar el test. Intenta de nuevo.')
      setScreen(SCREEN.ERROR)
    }
  }

  function handleRetry() {
    setAnswers({})
    setCurrent(0)
    setResult(null)
    setError(null)
    setScreen(SCREEN.TEST)
  }

  /* Sin autenticación */
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <span className="text-5xl">🔒</span>
        <h2 className="text-xl font-bold text-gray-700">Debes iniciar sesión</h2>
        <p className="text-gray-400 text-sm">El test vocacional requiere una cuenta.</p>
        <Link to="/login" className="bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
          Iniciar sesión
        </Link>
      </div>
    )
  }

  /* Error */
  if (screen === SCREEN.ERROR) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center max-w-md mx-auto">
        <span className="text-5xl">⚠️</span>
        <h2 className="text-xl font-bold text-gray-700">Algo salió mal</h2>
        <p className="text-gray-500 text-sm">{error}</p>
        <div className="flex gap-3">
          <button onClick={() => { setError(null); setScreen(SCREEN.INTRO) }}
            className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
            Intentar de nuevo
          </button>
          <Link to="/" className="bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  /* Enviando */
  if (screen === SCREEN.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5">
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
        <div className="text-center">
          <p className="font-bold text-gray-900">Analizando tus respuestas...</p>
          <p className="text-gray-500 text-sm mt-1">La IA está calculando tu perfil vocacional</p>
        </div>
      </div>
    )
  }

  /* Resultado */
  if (screen === SCREEN.RESULT && result) {
    return <ResultScreen result={result} onRetry={handleRetry} />
  }

  /* Intro */
  if (screen === SCREEN.INTRO) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="relative bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl px-8 py-10 text-white overflow-hidden text-center">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-2xl md:text-3xl font-bold">Test Vocacional VocAI</h1>
          <p className="text-violet-200 text-sm mt-2 max-w-sm mx-auto">
            Responde {loadingQ ? '...' : totalQ} preguntas y descubre qué carrera de Tecnología Digital se adapta mejor a ti.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900">¿Cómo funciona?</h3>
          {[
            { icon: '📋', text: `Responde ${totalQ} preguntas sobre tus intereses y preferencias` },
            { icon: '🤖', text: 'La IA analiza tu perfil y lo compara con todas las carreras' },
            { icon: '🎯', text: 'Recibes las 3 carreras más afines con porcentaje de compatibilidad' },
            { icon: '🔗', text: 'Puedes ver el detalle de cada carrera y hablar con el asistente' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <span className="text-xl">{icon}</span>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setScreen(SCREEN.TEST)}
          disabled={loadingQ || totalQ === 0}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-base py-4 rounded-2xl transition-colors"
        >
          {loadingQ ? 'Cargando preguntas...' : `Comenzar test (${totalQ} preguntas)`}
        </button>

        <div className="text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">← Volver al inicio</Link>
        </div>
      </div>
    )
  }

  /* Test — una pregunta a la vez */
  if (screen === SCREEN.TEST && q) {
    const selectedIdx = answers[q._id]
    const isAnswered  = selectedIdx !== undefined

    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">

        {/* Progress */}
        <ProgressBar current={current + 1} total={totalQ} />

        {/* Categoría */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${catColor(q.category).bg} ${catColor(q.category).text}`}>
            {q.category}
          </span>
          <span className="text-xs text-gray-400">{answeredCount} de {totalQ} respondidas</span>
        </div>

        {/* Pregunta */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-lg font-bold text-gray-900 leading-snug">{q.text}</p>
        </div>

        {/* Opciones */}
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const sel = selectedIdx === idx
            return (
              <button
                key={idx}
                onClick={() => selectOption(q._id, idx)}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-sm font-medium transition-all ${
                  sel
                    ? 'border-violet-500 bg-violet-50 text-violet-800 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/50 text-gray-700'
                }`}
              >
                <span className={`inline-flex w-6 h-6 rounded-full mr-3 items-center justify-center text-xs font-bold flex-shrink-0
                  ${sel ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Navegación */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl transition-colors"
          >
            ← Anterior
          </button>

          {current < totalQ - 1 ? (
            <button
              onClick={goNext}
              disabled={!isAnswered}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl transition-colors"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl transition-colors ${
                allAnswered
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {allAnswered ? '✓ Enviar test' : `Faltan ${totalQ - answeredCount} respuestas`}
            </button>
          )}
        </div>

        {/* Mini-mapa de preguntas */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                i === current
                  ? 'bg-violet-600 text-white'
                  : answers[questions[i]._id] !== undefined
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}
