import React, { useMemo, useState } from 'react'
import useCareers from '../hooks/useCareers'
import CareerCard from '../components/CareerCard'
import Toast from '../components/Toast'

function filterCareers(list, q, filters){
  return list.filter(c=>{
    // Filtro obligatorio: solo Lima
    if (c.sede !== 'Lima') return false
    
    if (q && !c.title.toLowerCase().includes(q.toLowerCase())) return false
    if (filters.career && c.title !== filters.career) return false
    if (filters.sede && c.sede !== filters.sede) return false
    if (filters.demand && c.demand !== filters.demand) return false
    if (filters.salary && c.salary < Number(filters.salary)) return false
    return true
  })
}

export default function Catalog(){
  const { careers: CAREERS, loading, error } = useCareers()
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState({ career: '', sede: '', demand: '', salary: '' })
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState(null)
  const per = 6

  const filtered = useMemo(()=>filterCareers(CAREERS, q, filters), [CAREERS, q, filters])
  const total = filtered.length
  const pages = Math.ceil(total / per)
  const items = filtered.slice((page-1)*per, page*per)
  const addToComparator = (updated)=>{
    // Updated list is provided by CareerCard; just acknowledge it
    // Toast is handled by CareerCard, but we can optionally trigger sync here
  }

  // Obtener carreras únicas de Lima para el selector
  const careersLima = [...new Set(CAREERS.filter(c=>c.sede==='Lima').map(c=>c.title))]

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Catálogo de carreras</h1>
      {loading && <div className="mb-4 text-sm text-gray-600">Cargando carreras del Departamento de Tecnología Digital – TECSUP, Sede Lima...</div>}
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {!loading && !error && (
      <>
      <div className="mb-4 flex gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar carrera" className="search-input" />
        <select value={filters.career} onChange={(e)=>setFilters(s=>({...s, career: e.target.value}))} className="border p-2 rounded">
          <option value="">Selecciona una carrera</option>
          {careersLima.map(career=> <option key={career} value={career}>{career}</option>)}
        </select>
        <select value={filters.sede} onChange={(e)=>setFilters(s=>({...s, sede: e.target.value}))} className="border p-2 rounded">
          <option value="">Sede (Lima)</option>
          {[...new Set(CAREERS.map(c=>c.sede))].map(a=> <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(c => (
          <CareerCard
            key={c._id || c.id || c.codigo}
            career={c}
            onAdd={addToComparator}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>Mostrando {items.length} de {total} resultados</div>
        <div className="space-x-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="btn-secondary px-3 py-1 rounded">Anterior</button>
          <span> {page}/{pages||1} </span>
          <button onClick={()=>setPage(p=>Math.min(pages||1,p+1))} className="btn-secondary px-3 py-1 rounded">Siguiente</button>
        </div>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      </>
      )}
    </div>
  )
}
