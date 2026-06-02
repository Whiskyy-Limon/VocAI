import React, { useEffect, useState } from 'react'
import {
  getComparator,
  removeFromComparator,
  clearComparator,
  comparatorStorageKey,
} from '../utils/comparatorStorage'

export default function Comparator(){
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getComparator())

    function handleStorage(event) {
      if (event.key === comparatorStorageKey) {
        setItems(getComparator())
      }
    }

    function handleCustomEvent(event) {
      if (event?.detail) {
        setItems(event.detail)
      } else {
        setItems(getComparator())
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('vocai_comparator_changed', handleCustomEvent)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('vocai_comparator_changed', handleCustomEvent)
    }
  }, [])

  function remove(id){
    const next = removeFromComparator(id)
    setItems(next)
  }
  function clearAll(){
    clearComparator()
    setItems([])
  }

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Comparador de carreras</h1>
            <p className="text-sm text-gray-600 mt-2">
              Compara duracion, sueldo referencial, enfoque profesional y tecnologias clave.
            </p>
          </div>
          <button onClick={clearAll} className="v-btn px-3 py-2 rounded">Limpiar comparador</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card-premium text-sm text-gray-600">No hay carreras en el comparador.</div>
      ) : (
        <div className="overflow-auto">
          <div className="card-premium">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-3 text-xs uppercase tracking-wider text-gray-500">Variable</th>
                  {items.map((i) => (
                    <th key={i.id} className="p-3">
                      <div className="font-semibold">{i.title}</div>
                      <button onClick={() => remove(i.id)} className="btn-secondary mt-2 text-xs">
                        Quitar
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-semibold">Sede</td>
                  {items.map((i) => <td key={i.id} className="p-3">{i.sede}</td>)}
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-semibold">Duracion</td>
                  {items.map((i) => <td key={i.id} className="p-3">{i.duration}</td>)}
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-semibold">Sueldo referencial</td>
                  {items.map((i) => <td key={i.id} className="p-3">{i.salaryText || i.salary || 'No especificado'}</td>)}
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-semibold">Enfoque profesional</td>
                  {items.map((i) => <td key={i.id} className="p-3">{i.field || 'No especificado'}</td>)}
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-semibold">Tecnologias / habilidades</td>
                  {items.map((i) => (
                    <td key={i.id} className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {(i.skills || i.technologies || []).map((skill) => (
                          <span key={skill} className="assistant-chip">{skill}</span>
                        ))}
                        {(!i.skills || i.skills.length === 0) && (!i.technologies || i.technologies.length === 0) && (
                          <span className="text-xs text-gray-500">Sin datos</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-semibold">Descripcion</td>
                  {items.map((i) => (
                    <td key={i.id} className="p-3 text-sm text-gray-700">
                      {i.description || 'No especificado'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
