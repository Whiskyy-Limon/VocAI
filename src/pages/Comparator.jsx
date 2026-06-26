import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getComparator,
  removeFromComparator,
  clearComparator,
  comparatorStorageKey,
} from '../utils/comparatorStorage'

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

const ROWS = [
  { key: 'sede',        label: '📍 Sede',                  render: v => v?.sede || 'Lima' },
  { key: 'duration',    label: '⏱️ Duración',               render: v => v?.duration || '3 años' },
  { key: 'salaryText',  label: '💰 Sueldo referencial',     render: v => v?.salaryText || 'No especificado' },
  { key: 'field',       label: '🎯 Enfoque profesional',    render: v => v?.field || '—' },
  { key: 'description', label: '📋 Descripción',            render: v => v?.description || '—' },
  { key: 'skills',      label: '🛠️ Habilidades clave',      render: null }, // custom
]

function SkillsCell({ skills }) {
  if (!skills?.length) return <span className="text-xs text-gray-400">Sin datos</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map(s => (
        <span key={s} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">{s}</span>
      ))}
    </div>
  )
}

/* Slot vacío — invita a agregar una carrera */
function EmptySlot({ index }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 h-full text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
      <span className="text-3xl opacity-40">➕</span>
      <p className="text-sm text-gray-400 font-medium">Carrera {index}</p>
      <Link
        to="/catalog"
        className="text-xs text-blue-600 hover:underline font-medium"
      >
        Ir al catálogo →
      </Link>
    </div>
  )
}

export default function Comparator() {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getComparator())
    const onStorage = e => { if (e.key === comparatorStorageKey) setItems(getComparator()) }
    const onCustom  = e => setItems(e?.detail ?? getComparator())
    window.addEventListener('storage', onStorage)
    window.addEventListener('vocai_comparator_changed', onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('vocai_comparator_changed', onCustom)
    }
  }, [])

  function remove(id) { setItems(removeFromComparator(id)) }
  function clearAll()  { clearComparator(); setItems([]) }

  /* Siempre mostramos 3 columnas (ítems + slots vacíos) */
  const slots = [...items, ...Array(3 - items.length).fill(null)]

  return (
    <div className="space-y-6 py-4">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Tecsup — Tecnología Digital</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Comparador de Carreras</h1>
          <p className="text-gray-500 text-sm mt-1">
            Compara hasta 3 carreras — duración, sueldo, enfoque y habilidades.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${
            items.length === 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'
          }`}>
            {items.length} / 3 carreras
          </span>
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-full transition-colors font-medium"
            >
              🗑️ Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Estado vacío total */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="text-6xl opacity-30">⚖️</div>
          <h3 className="text-lg font-bold text-gray-700">El comparador está vacío</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Ve al catálogo y presiona <strong>"+ Comparar"</strong> en las carreras que te interesen.
          </p>
          <Link
            to="/catalog"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Ir al catálogo
          </Link>
        </div>
      )}

      {/* Comparación */}
      {items.length > 0 && (
        <div className="space-y-5">

          {/* Tarjetas de cabecera */}
          <div className="grid grid-cols-3 gap-4">
            {slots.map((item, i) =>
              item ? (
                <div key={item.id} className={`bg-gradient-to-br ${CAREER_COLORS[item.title] ?? 'from-blue-500 to-blue-700'} rounded-2xl p-5 text-white relative`}>
                  <div className="text-3xl mb-2">{CAREER_ICONS[item.title] ?? '🎓'}</div>
                  <h3 className="font-bold text-sm leading-snug">{item.title}</h3>
                  <p className="text-white/70 text-xs mt-1">{item.sede || 'Santa Anita'}</p>
                  <button
                    onClick={() => remove(item.id)}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs flex items-center justify-center transition-colors"
                    title="Quitar"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <EmptySlot key={`empty-${i}`} index={i + 1} />
              )
            )}
          </div>

          {/* Filas de comparación */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {ROWS.map((row, rowIdx) => (
              <div
                key={row.key}
                className={`grid grid-cols-4 ${rowIdx !== 0 ? 'border-t border-gray-100' : ''}`}
              >
                {/* Etiqueta */}
                <div className="px-5 py-4 bg-gray-50 flex items-start">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide leading-relaxed">
                    {row.label}
                  </span>
                </div>

                {/* Valores */}
                {slots.map((item, i) => (
                  <div key={i} className="px-5 py-4 border-l border-gray-100">
                    {item ? (
                      row.key === 'skills' ? (
                        <SkillsCell skills={item.skills} />
                      ) : (
                        <p className={`text-sm leading-relaxed ${
                          row.key === 'salaryText' ? 'font-semibold text-green-700' :
                          row.key === 'duration'   ? 'font-semibold text-blue-700' :
                          'text-gray-700'
                        }`}>
                          {row.render(item)}
                        </p>
                      )
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-3 gap-4">
            {slots.map((item, i) =>
              item ? (
                <Link
                  key={item.id}
                  to={`/career/${item.id}`}
                  className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl py-3 transition-colors"
                >
                  Ver detalle completo →
                </Link>
              ) : (
                <div key={`btn-empty-${i}`} />
              )
            )}
          </div>

        </div>
      )}
    </div>
  )
}
