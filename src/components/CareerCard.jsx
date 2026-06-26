import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Toast from './Toast'
import { addToComparator } from '../utils/comparatorStorage'

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

export default function CareerCard({ career }) {
  const [toast, setToast] = useState(null)

  const icon = CAREER_ICONS[career.title] ?? '🎓'
  const gradient = CAREER_COLORS[career.title] ?? 'from-blue-500 to-blue-700'
  const careerId = career._id || career.id || career.codigo

  function handleAddToComparator() {
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

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">

        {/* Header con gradiente */}
        <div className={`bg-gradient-to-br ${gradient} px-5 pt-5 pb-6 text-white relative`}>
          <div className="text-3xl mb-2">{icon}</div>
          <h3 className="font-bold text-base leading-snug">{career.title}</h3>
          <p className="text-xs text-white/70 mt-0.5">
            {career.departamento || 'Tecnología Digital'} · {career.sede || 'Santa Anita'}
          </p>
          {/* Badge duración */}
          <span className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {career.duration || '3 años'}
          </span>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col flex-1 px-5 py-4 gap-4">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{career.description}</p>

          {/* Sueldo */}
          <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
            <span className="text-base">💰</span>
            <div>
              <p className="text-xs text-gray-500">Sueldo referencial</p>
              <p className="text-sm font-semibold text-green-700">{career.salaryText || 'No especificado'}</p>
            </div>
          </div>

          {/* Skills */}
          {career.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {career.skills.slice(0, 4).map(skill => (
                <span key={skill} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
                  {skill}
                </span>
              ))}
              {career.skills.length > 4 && (
                <span className="text-xs bg-gray-100 text-gray-400 rounded-full px-2.5 py-1">
                  +{career.skills.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Acciones */}
          <div className="mt-auto flex gap-2 pt-1">
            <Link
              to={`/career/${careerId}`}
              className="flex-1 text-center text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl py-2 transition-colors"
            >
              Ver detalles
            </Link>
            <button
              onClick={handleAddToComparator}
              className="flex-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-2 transition-colors"
            >
              + Comparar
            </button>
          </div>
        </div>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </>
  )
}
