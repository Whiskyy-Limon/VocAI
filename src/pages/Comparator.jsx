import React, { useEffect, useState } from 'react'

export default function Comparator(){
  const [items, setItems] = useState([])

  useEffect(()=>{
    setItems(JSON.parse(localStorage.getItem('vocai_comparator')||'[]'))
  },[])

  function remove(id){
    const next = items.filter(i=>i.id!==id)
    setItems(next)
    localStorage.setItem('vocai_comparator', JSON.stringify(next))
  }
  function clearAll(){
    setItems([])
    localStorage.removeItem('vocai_comparator')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Comparador</h1>
      {items.length===0 ? <div>No hay carreras en el comparador</div> : (
        <div>
          <div className="overflow-auto">
            <div className="card-premium">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="p-2">Campo</th>
                  {items.map(i=> <th key={i.id} className="p-2">{i.title}<div className="text-xs"><button onClick={()=>remove(i.id)} className="v-btn">Quitar</button></div></th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-semibold">Sede</td>
                  {items.map(i=> <td key={i.id} className="p-2">{i.sede}</td>)}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Salario</td>
                  {items.map(i=> <td key={i.id} className="p-2">${i.salary}</td>)}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Demanda</td>
                  {items.map(i=> <td key={i.id} className="p-2">{i.demand}</td>)}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Duración</td>
                  {items.map(i=> <td key={i.id} className="p-2">{i.duration}</td>)}
                </tr>
              </tbody>
            </table>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={clearAll} className="v-btn px-3 py-1 rounded">Limpiar comparador</button>
          </div>
        </div>
      )}
    </div>
  )
}
