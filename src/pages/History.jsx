import React from 'react'

export default function History(){
  const hist = JSON.parse(localStorage.getItem('vocai_history')||'[]')
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Historial de recomendaciones</h1>
      {hist.length===0 ? <div>No hay historiales</div> : (
        <div className="space-y-4">
          {hist.map((h,idx)=> (
            <div key={idx} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{new Date(h.date).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Perfil generado</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-semibold">Carreras recomendadas</div>
                <ul className="list-disc ml-5">
                  {h.top3.map(t=> <li key={t.id}><a className="text-blue-600" href={`/career/${t.id}`}>{t.title}</a> — Afinidad: {t.score}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
