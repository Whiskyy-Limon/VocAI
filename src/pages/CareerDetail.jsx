import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useCareers from '../hooks/useCareers'
import Toast from '../components/Toast'
import { addToComparator } from '../utils/comparatorStorage'
import { chooseCareer, getMyChoice } from '../services/careerChoiceService'

const CAREER_ICONS = {
  'Modelado y Animación Digital': '🎨',
  'Ciberseguridad y Auditoría Informática': '🔐',
  'Diseño y Desarrollo de Software': '💻',
  'Diseño y Desarrollo de Simuladores y Videojuegos': '🎮',
  'Administración de Redes y Comunicaciones': '🌐',
  'Big Data y Ciencia de Datos': '📊',
}

const CAREER_COLORS = {
  'Modelado y Animación Digital': 'from-pink-500 to-rose-600',
  'Ciberseguridad y Auditoría Informática': 'from-slate-600 to-slate-800',
  'Diseño y Desarrollo de Software': 'from-blue-500 to-blue-700',
  'Diseño y Desarrollo de Simuladores y Videojuegos': 'from-violet-500 to-purple-700',
  'Administración de Redes y Comunicaciones': 'from-cyan-500 to-teal-700',
  'Big Data y Ciencia de Datos': 'from-amber-500 to-orange-600',
}

const CAREER_OFFICIAL_URL = {
  'Modelado y Animación Digital': 'https://www.tecsup.edu.pe/carrera/modelado-y-animacion-digital/',
  'Ciberseguridad y Auditoría Informática': 'https://www.tecsup.edu.pe/carrera/ciberseguridad-y-auditoria-informatica/',
  'Diseño y Desarrollo de Software': 'https://www.tecsup.edu.pe/carrera/diseno-y-desarrollo-de-software-2/',
  'Diseño y Desarrollo de Simuladores y Videojuegos': 'https://www.tecsup.edu.pe/carrera/diseno-y-desarrollo-de-simuladores-y-videojuegos/',
  'Administración de Redes y Comunicaciones': 'https://www.tecsup.edu.pe/carrera/administracion-de-redes-y-comunicaciones/',
  'Big Data y Ciencia de Datos': 'https://www.tecsup.edu.pe/carrera/big-data-y-ciencia-de-datos/',
}

function InfoCard({ icon, label, value, highlight }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${highlight ?? 'text-gray-800'}`}>{value}</p>
      </div>
    </div>
  )
}

export default function CareerDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { careers, loading, error } = useCareers()
  const [toast, setToast] = useState(null)
  const [chosenCareerId, setChosenCareerId] = useState(null)
  const [choosing, setChoosing] = useState(false)

  const career = useMemo(
    () => careers.find(c => c._id === id || c.id === id || c.codigo === id),
    [careers, id]
  )

  useEffect(() => {
    getMyChoice()
      .then(data => setChosenCareerId(data?.chosenCareer?._id || data?.chosenCareer || null))
      .catch(() => {})
  }, [])

  const handleChoose = useCallback(async () => {
    if (!career) return
    setChoosing(true)
    try {
      await chooseCareer(career._id)
      setChosenCareerId(career._id)
      setToast({ message: `✓ Elegiste "${career.title}" como tu carrera`, type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo guardar tu elección, intenta nuevamente', type: 'error' })
    } finally {
      setChoosing(false)
    }
  }, [career])

  if (loading) {
    return (
      <div className="space-y-4 py-4 animate-pulse">
        <div className="h-52 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="h-40 bg-gray-100 rounded-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <span className="text-5xl">⚠️</span>
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => nav('/catalog')} className="text-sm text-blue-600 hover:underline">
          Volver al catálogo
        </button>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <span className="text-6xl opacity-40">🔍</span>
        <h2 className="text-xl font-bold text-gray-700">Carrera no encontrada</h2>
        <p className="text-gray-400 text-sm max-w-xs">
          No encontramos información para esta carrera. Vuelve al catálogo y elige otra opción.
        </p>
        <Link
          to="/catalog"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          Ir al catálogo
        </Link>
      </div>
    )
  }

  function handleAdd() {
    const result = addToComparator(career)
    if (!result.ok) {
      setToast({
        message: result.reason === 'exists'
          ? 'Esta carrera ya está en el comparador'
          : 'El comparador ya tiene 3 carreras',
        type: 'info',
      })
      return
    }
    setToast({ message: '✓ Agregado al comparador', type: 'success' })
  }

  const icon        = CAREER_ICONS[career.title]  ?? '🎓'
  const gradient    = CAREER_COLORS[career.title] ?? 'from-blue-500 to-blue-700'
  const salary      = career.salaryText || (career.salary ? `S/ ${career.salary}` : 'No especificado')
  const officialUrl = CAREER_OFFICIAL_URL[career.title] ?? null

  /* Normaliza pdfUrl: si es relativa la hace absoluta usando la base del backend */
  const pdfHref = career.pdfUrl
    ? career.pdfUrl.startsWith('http')
      ? career.pdfUrl
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:4000'}${career.pdfUrl}`
    : null

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">

      {/* Hero banner */}
      <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-8 text-white overflow-hidden`}>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl flex-shrink-0">
              {icon}
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                {career.departamento || 'Tecnología Digital'} · TECSUP
              </p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{career.title}</h1>
              <p className="text-white/70 text-sm mt-1">{career.sede || 'Sede Santa Anita, Lima'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => nav(-1)}
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              ← Volver
            </button>
            <button
              onClick={handleAdd}
              className="bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              ⚖️ Comparar
            </button>
            <Link
              to="/assistant"
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              🤖 Preguntar a IA
            </Link>
            {pdfHref && (
              <a
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1.5"
              >
                📄 Descargar PDF
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard icon="⏱️" label="Duración"           value={career.duration || '3 años'}      highlight="text-blue-700" />
        <InfoCard icon="💰" label="Sueldo referencial"  value={salary}                            highlight="text-green-700" />
        <InfoCard icon="📍" label="Sede"                value={career.sede || 'Santa Anita'}      />
        <InfoCard icon="🏛️" label="Departamento"        value={career.departamento || 'Tecnología Digital'} />
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Columna principal */}
        <div className="md:col-span-2 space-y-5">

          {/* Descripción */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>📋</span> Descripción general
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {career.longDescription || career.description}
            </p>
          </div>

          {/* Perfil del egresado */}
          {career.competencies?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🎓</span> Perfil del egresado
              </h2>
              <ul className="space-y-2">
                {career.competencies.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Habilidades */}
          {career.skills?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🛠️</span> Tecnologías y habilidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {career.skills.map(skill => (
                  <span
                    key={skill}
                    className="bg-blue-50 text-blue-700 border border-blue-100 text-sm px-3 py-1.5 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna lateral */}
        <div className="space-y-5">

          {/* Campo laboral */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>🎯</span> Enfoque profesional
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{career.field || '—'}</p>
          </div>

          {/* CTA — Elegir carrera */}
          <div className={`rounded-2xl p-5 border ${chosenCareerId === career._id ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="text-2xl mb-2">{chosenCareerId === career._id ? '✅' : '🎯'}</div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">
              {chosenCareerId === career._id ? 'Esta es tu carrera elegida' : '¿Ya decidiste?'}
            </h3>
            <p className="text-gray-500 text-xs mb-4 leading-relaxed">
              {chosenCareerId === career._id
                ? 'Marcaste esta carrera como tu elección. Puedes cambiarla cuando quieras.'
                : 'Marca esta carrera como tu elección. Ayuda a otros postulantes a ver qué carreras eligen más.'}
            </p>
            <button
              onClick={handleChoose}
              disabled={choosing || chosenCareerId === career._id}
              className={`w-full text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60 ${
                chosenCareerId === career._id
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              {choosing ? 'Guardando...' : chosenCareerId === career._id ? '✓ Carrera elegida' : 'Elegir esta carrera'}
            </button>
          </div>

          {/* CTA — Asistente */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-bold text-sm mb-1">¿Tienes dudas?</h3>
            <p className="text-blue-100 text-xs mb-4 leading-relaxed">
              Pregúntale a nuestro asistente de IA sobre esta carrera, campo laboral o salarios.
            </p>
            <Link
              to="/assistant"
              className="block text-center bg-white text-blue-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Hablar con IA →
            </Link>
          </div>

          {/* CTA — Comparador */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div className="text-2xl mb-2">⚖️</div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Compara esta carrera</h3>
            <p className="text-gray-500 text-xs mb-4 leading-relaxed">
              Agrégala al comparador para verla junto a otras opciones.
            </p>
            <button
              onClick={handleAdd}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              + Agregar al comparador
            </button>
          </div>

          {/* CTA — Información oficial */}
          <div className={`rounded-2xl p-5 border ${officialUrl ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
            <div className="text-2xl mb-2">🌐</div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Información oficial</h3>
            {officialUrl ? (
              <>
                <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                  Consulta la malla curricular, perfil del egresado y más detalles directamente en la página oficial de TECSUP.
                </p>
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  🌐 Ver página oficial
                </a>
              </>
            ) : (
              <p className="text-gray-400 text-xs leading-relaxed">
                Información oficial no disponible por el momento.
              </p>
            )}
          </div>

        </div>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  )
}
