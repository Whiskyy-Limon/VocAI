import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Toast from './Toast'

export default function CareerCard({ career, onAdd }){
  const [toast, setToast] = useState(null)
  const departmentText = `Departamento de ${career.departamento || 'Tecnología Digital'} – TECSUP, Sede ${career.sede || 'Lima'}`
  
  function handleAddToComparator() {
    const current = JSON.parse(localStorage.getItem('vocai_comparator') || '[]')
    const id = career._id || career.id || career.codigo
    
    // Check if already exists
    if (current.find((x) => x.id === id)) {
      setToast({ message: 'Esta carrera ya está en el comparador', type: 'info' })
      return
    }
    
    // Check if at max capacity
    if (current.length >= 3) {
      setToast({ message: 'El comparador tiene máximo 3 carreras', type: 'info' })
      return
    }
    
    // Build item
    const item = {
      id,
      title: career.title,
      sede: career.sede || 'Lima',
      salaryText: career.salaryText || (career.salary ? `S/ ${career.salary}` : 'No especificado'),
      duration: career.duration || '3 años',
      field: career.field || '',
      skills: career.skills || []
    }
    
    const updated = [...current, item]
    localStorage.setItem('vocai_comparator', JSON.stringify(updated))
    setToast({ message: 'Agregado al comparador', type: 'success' })
    
    // Trigger onAdd if provided
    if (onAdd) {
      onAdd(updated)
    }
  }
  
  return (
    <>
      <div className="card-premium flex flex-col gap-4">
        <div>
          <h3 className="font-semibold text-lg">{career.title}</h3>
          <p className="text-xs text-gray-500">{departmentText}</p>
        </div>

        <p className="text-sm text-gray-700">{career.description}</p>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div>
            <div className="font-semibold text-gray-700">Duracion</div>
            <div>{career.duration || '3 años'}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">Sueldo referencial</div>
            <div>{career.salaryText || 'No especificado'}</div>
          </div>
        </div>

        <div className="text-xs text-gray-600">
          <div className="font-semibold text-gray-700">Enfoque</div>
          <div>{career.field}</div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <Link to={`/career/${career._id || career.id || career.codigo}`} className="btn-secondary text-sm" style={{textDecoration: 'none'}}>Ver detalles</Link>
          <button onClick={handleAddToComparator} className="v-btn px-3 py-1 rounded text-sm">Agregar</button>
        </div>
      </div>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </>
  )
}
