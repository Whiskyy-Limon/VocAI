import React from 'react'
import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function Profile(){
  const profile = JSON.parse(localStorage.getItem('vocai_profile')||'null')
  if(!profile) return <div>No hay perfil generado. Realiza el cuestionario.</div>

  const labels = Object.keys(profile.scores)
  const data = {
    labels,
    datasets: [{
      label: 'Afinidad por áreas',
      data: labels.map(l=>profile.scores[l]||0),
      backgroundColor: 'rgba(37,99,235,0.2)',
      borderColor: 'rgba(37,99,235,1)'
    }]
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Perfil vocacional</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Radar data={data} />
        </div>
        <div>
          <h3 className="font-semibold">Explicación del perfil</h3>
          <p className="text-sm text-gray-700">Este perfil se generó a partir de tus respuestas. Las áreas con mayor puntuación indican afinidad.</p>

          <h3 className="mt-3 font-semibold">Top 3 carreras recomendadas</h3>
          <ol className="list-decimal ml-6">
            {profile.top3.map(t=> (
              <li key={t.id} className="mb-2">
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-600">Afinidad: {t.percent}%</div>
                <div className="mt-1">
                  <a href={`/career/${t.id}`} className="text-blue-600 text-sm">Ver carrera</a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
