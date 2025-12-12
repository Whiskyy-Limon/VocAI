import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useCareers from '../hooks/useCareers'
import Slider from '../components/Slider'

// 15 questions covering multiple topics. Each question now maps to one or more of the 6 careers (by id)
const QUESTIONS = [
  { id:1, text:'¿Te interesa resolver problemas de lógica y programación?' },
  { id:2, text:'¿Disfrutas trabajar con personas y ayudarles directamente?' },
  { id:3, text:'¿Te motiva la investigación y el método científico?' },
  { id:4, text:'¿Te atrae el diseño visual y la creatividad aplicada?' },
  { id:5, text:'¿Te gustaría trabajar en el cuidado de la salud (hospitales, clínicas)?' },
  { id:6, text:'¿Te interesan las leyes, la argumentación y la política?' },
  { id:7, text:'¿Te gustan las matemáticas, el análisis estadístico o económico?' },
  { id:8, text:'¿Te interesa la gestión de empresas, finanzas o emprendimiento?' },
  { id:9, text:'¿Te atrae el trabajo con máquinas, procesos industriales o automatización?' },
  { id:10, text:'¿Te motiva construir dispositivos físicos que combinan electrónica y software?' },
  { id:11, text:'¿Disfrutas comunicar ideas, escribir o trabajar en medios?' },
  { id:12, text:'¿Te interesa la biología y trabajar en laboratorios?' },
  { id:13, text:'¿Te motivan las estrategias de marketing y análisis del usuario?' },
  { id:14, text:'¿Te atrae la gastronomía, el trabajo con alimentos y la creatividad culinaria?' },
  { id:15, text:'¿Te interesa el urbanismo, la construcción y el diseño de espacios?' }
]

// Map each question id to one or more career ids from CAREERS (td1..td6)
// This ensures scoring only affects the 6 allowed careers.
const QUESTION_TO_CAREERS = {
  1: ['td1','td2','td4'],           // programación, datos, juegos
  2: ['td6','td4'],                // trabajo con personas -> animación, juegos
  3: ['td2','td3','td1'],          // investigación -> datos, ciber, software
  4: ['td6','td4'],                // diseño visual -> animación, juegos
  5: [],                            // salud -> no aplica a las 6
  6: [],
  7: ['td2','td3'],                // matemáticas -> datos y ciber
  8: ['td1','td5'],                // gestión/empresa -> software (emprendimientos digitales), redes (infra)
  9: ['td5','td1'],                // máquinas/automatización -> redes, software
  10: ['td1','td5','td4'],         // dispositivos -> software, redes, juegos (simuladores)
  11: ['td6','td4'],               // comunicar -> animación, juegos
  12: [],
  13: ['td2','td1'],               // marketing/analisis -> datos, software
  14: [],
  15: []
}

export default function Questionnaire(){
  const { careers: CAREERS, loading: careersLoading, error: careersError } = useCareers()
  const [answers, setAnswers] = useState({})
  const [idx, setIdx] = useState(0)
  const [review, setReview] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const nav = useNavigate()

  function answer(qid, value){
    setAnswers(a=>({...a, [qid]: value}))
  }

  function next(){
    const q = QUESTIONS[idx]
    if (!answers[q.id]){
      setError('Por favor responde la pregunta antes de continuar')
      return
    }
    setError(null)
    setIdx(i=>Math.min(QUESTIONS.length-1, i+1))
  }
  function prev(){ setIdx(i=>Math.max(0, i-1)) }

  function goToReview(){
    // Validate all answered
    const missing = QUESTIONS.filter(q=>!answers[q.id]).map(q=>q.id)
    if (missing.length>0){
      setError(`Responde todas las preguntas antes de revisar. Faltan: ${missing.join(', ')}`)
      return
    }
    setError(null)
    setReview(true)
  }

  function computeProfile(){
    // Compute scores per career using QUESTION_TO_CAREERS mapping and answers (1-5)
    const careerScores = {}
    // init
    CAREERS.forEach(c => { careerScores[c.id] = { career: c, total: 0, max: 0 } })

    QUESTIONS.forEach(q => {
      const val = Number(answers[q.id] || 0)
      const mapped = QUESTION_TO_CAREERS[q.id] || []
      mapped.forEach(cid => {
        if (!careerScores[cid]) return
        careerScores[cid].total += val
        careerScores[cid].max += 5
      })
    })

    // Convert to percentage for each career
    const scored = Object.values(careerScores).map(s => {
      const percent = s.max > 0 ? Math.round((s.total / s.max) * 100) : 0
      return { career: s.career, percent }
    }).sort((a,b)=>b.percent - a.percent)

    const top3 = scored.slice(0,3).map(r=>({ id: r.career.id, title: r.career.title, percent: r.percent }))
    const scoresObj = {}
    scored.forEach(s => { scoresObj[s.career.id] = s.percent })

    const profile = { date: new Date().toISOString(), top3, scores: scoresObj }
    return profile
  }

  async function finish(){
    setSubmitting(true)
    try{
      const profile = computeProfile()
      const hist = JSON.parse(localStorage.getItem('vocai_history')||'[]')
      hist.unshift(profile)
      localStorage.setItem('vocai_history', JSON.stringify(hist))
      localStorage.setItem('vocai_profile', JSON.stringify(profile))
      // simulate small delay
      setTimeout(()=>{
        setSubmitting(false)
        setReview(false)
        nav('/profile')
      }, 400)
    }catch(err){
      setSubmitting(false)
      setError('Error generando el perfil')
    }
  }

  const progress = Math.round(((idx+1)/QUESTIONS.length)*100)

  // Render
  if (review){
    return (
      <div className="max-w-3xl mx-auto card-premium">
        <h1 className="text-2xl font-semibold mb-4">Revisar respuestas</h1>
        <div className="mb-4 text-sm text-gray-600">Confirma tus respuestas antes de generar tu perfil vocacional.</div>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <div className="space-y-3">
          {QUESTIONS.map(q=> (
            <div key={q.id} className="border p-3 rounded">
              <div className="font-medium">{q.id}. {q.text}</div>
              <div className="text-sm text-gray-600">Respuesta: <span className="font-semibold">{answers[q.id]}</span></div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <button onClick={()=>setReview(false)} className="btn-secondary px-3 py-2 rounded">Volver a editar</button>
          <button onClick={finish} disabled={submitting} className="v-btn px-3 py-2 rounded">{submitting ? 'Generando...' : 'Generar perfil'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto card-premium">
      <h1 className="text-2xl font-semibold mb-4">Cuestionario vocacional</h1>
      <div className="mb-4 text-sm text-gray-600"><strong>Nota:</strong> Este cuestionario proporciona orientación vocacional exclusivamente para las 6 carreras del Departamento de Tecnología Digital de TECSUP – Sede Lima.</div>
      
      {careersLoading && <div className="mb-3 text-sm text-gray-600">Cargando carreras...</div>}
      {careersError && <div className="mb-3 text-sm text-red-600">{careersError}</div>}

      {!careersLoading && !careersError && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Progreso: <span className="font-medium">{progress}%</span></div>
            <div className="w-1/2 bg-gray-100 h-2 rounded overflow-hidden">
              <div style={{ width: `${progress}%` }} className="h-2 bg-blue-600" />
            </div>
          </div>

          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

          <div className="border p-4 rounded">
            <div className="mb-2 font-semibold">Pregunta {idx+1} de {QUESTIONS.length}</div>
            <div className="mb-4">{QUESTIONS[idx].text}</div>

            <Slider
              value={answers[QUESTIONS[idx].id] || 3}
              onChange={(val)=>{ setError(null); answer(QUESTIONS[idx].id, val) }}
              min={1}
              max={5}
              labels={{1:'Nunca',2:'Rara vez',3:'A veces',4:'Frecuentemente',5:'Siempre'}}
            />
            {!answers[QUESTIONS[idx].id] && <div className="mt-2 text-sm text-red-600">Debes seleccionar una opción para avanzar.</div>}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button onClick={prev} className="btn-secondary px-3 py-2 rounded">Anterior</button>
            <div className="flex gap-2">
              <button onClick={()=>setIdx(0)} className="btn-secondary px-3 py-2 rounded">Primera</button>
              {idx<QUESTIONS.length-1 ? (
                <button onClick={next} disabled={!answers[QUESTIONS[idx].id]} className="v-btn px-3 py-2 rounded disabled:opacity-50">Siguiente</button>
              ) : (
                <button onClick={goToReview} disabled={Object.keys(answers).length < QUESTIONS.length} className="v-btn px-3 py-2 rounded disabled:opacity-50">Revisar respuestas</button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
