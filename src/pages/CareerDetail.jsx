import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useCareers from '../hooks/useCareers'
import Toast from '../components/Toast'

export default function CareerDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { careers, loading, error } = useCareers()
  const [toast, setToast] = useState(null)

  const career = useMemo(
    () => careers.find(c => c._id === id || c.id === id || c.codigo === id),
    [careers, id]
  )

  if (loading) {
    return (
      <div className="card-premium flex items-center justify-center h-48">
        <p className="text-sm text-slate-500">Cargando carrera...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-premium flex items-center justify-center h-48">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="card-premium flex flex-col items-center justify-center h-64 text-center space-y-3">
        <h1 className="text-xl md:text-2xl font-semibold">Carrera no encontrada</h1>
        <p className="text-sm text-slate-500 max-w-md">
          No hemos encontrado información para esta carrera. Vuelve al catálogo e intenta
          seleccionar otra opción.
        </p>
        <button
          onClick={() => nav('/catalog')}
          className="btn-secondary px-4 py-2 rounded inline-flex items-center justify-center"
          style={{ width: 'auto', textDecoration: 'none' }}
        >
          Volver al catálogo
        </button>
      </div>
    )
  }

  function add() {
    const current = JSON.parse(localStorage.getItem('vocai_comparator') || '[]')
    const careerId = career._id || career.id || career.codigo

    if (current.find(x => x.id === careerId)) {
      setToast({ message: 'Esta carrera ya está en el comparador', type: 'info' })
      return
    }

    if (current.length >= 3) {
      setToast({ message: 'El comparador tiene máximo 3 carreras', type: 'info' })
      return
    }

    const item = {
      id: careerId,
      title: career.title,
      sede: career.sede || 'Lima',
      salary: career.salary || '$',
      demand: career.demand || '',
      duration: career.duration || ''
    }

    const updated = [...current, item]
    localStorage.setItem('vocai_comparator', JSON.stringify(updated))
    setToast({ message: 'Agregado al comparador', type: 'success' })
  }

  const departmentText = `Departamento de ${career.departamento || 'Tecnología Digital'} – TECSUP, Sede ${career.sede || 'Lima'}`

  return (
    <div className="card-premium space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">
            {career.title}
          </h1>
          <p className="text-xs md:text-sm text-gray-600">{departmentText}</p>
        </div>
        <div className="space-x-2">
          <button onClick={() => nav('/catalog')} className="btn-secondary px-3 py-1 rounded">
            Volver
          </button>
          <button onClick={add} className="v-btn px-3 py-1 rounded">
            Agregar al comparador
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-1">Descripción general</h3>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-line">
            {career.longDescription || career.description}
          </p>

          {career.competencies?.length > 0 && (
            <>
              <h3 className="mt-4 font-semibold">Perfil del egresado</h3>
              <p className="text-sm text-gray-700">
                Competencias: {career.competencies.join(', ')}
              </p>
            </>
          )}

          {career.skills?.length > 0 && (
            <>
              <h3 className="mt-3 font-semibold">Habilidades</h3>
              <p className="text-sm text-gray-700">
                {career.skills.join(', ')}
              </p>
            </>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Campo laboral</h3>
          <p className="text-sm text-gray-700">{career.field}</p>

          <h3 className="mt-3 font-semibold">Departamento y sede</h3>
          <p className="text-sm text-gray-700">{departmentText}</p>

          <h3 className="mt-3 font-semibold">Salario promedio</h3>
          <p className="text-sm text-gray-700">
            {career.salary ? `S/ ${career.salary}` : 'No especificado'}
          </p>

          <h3 className="mt-3 font-semibold">Duración</h3>
          <p className="text-sm text-gray-700">
            {career.duration || '3 años'}
          </p>

          <h3 className="mt-3 font-semibold">Demanda laboral</h3>
          <p className="text-sm text-gray-700">
            {career.demand || 'No especificado'}
          </p>
        </div>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  )
}
