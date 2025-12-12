import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import useVoice from '../hooks/useVoice'
import useSpeechToText from '../hooks/useSpeechToText'
import { askVocationalAssistant } from '../services/assistantService'
import { Link } from 'react-router-dom'

function MessageBubble({ m }){
  const isAssistant = m.from === 'assistant'
  return (
    <div className={`max-w-xl ${isAssistant ? 'self-start' : 'self-end'} mb-3` }>
      <div className={`px-4 py-2 rounded-lg ${isAssistant ? 'bg-gray-100 text-gray-900' : 'bg-blue-600 text-white'}`}>
        {m.text}
        {m.recommendedCareers && m.recommendedCareers.length>0 && (
          <div className="mt-2 space-y-1">
            {m.recommendedCareers.map(c=> (
              <div key={c.id}>
                <Link to={`/career/${c.id}`} className="text-sm text-blue-600 underline">{c.title}</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Assistant(){
  const { user } = useAuth()
  const [messages, setMessages] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('vocai_chat_history')||'[]') } catch(e){ return [] }
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [voiceOn, setVoiceOn] = useState(true)
  const { speak, cancel, isSupported } = useVoice()
  const { startListening, stopListening, isListening, isSupported: isSpeechSupported } = useSpeechToText()
  const listRef = useRef(null)

  // initial assistant greeting
  useEffect(()=>{
    if (messages.length === 0) {
      const introText = 'Hola, soy VocAI, tu asistente de orientación vocacional para las carreras del Departamento de Tecnología Digital de TECSUP – Sede Lima.'
      const introMsg = { id: 'intro', from: 'assistant', text: introText, suggestions: ['Ir al cuestionario','Ver catálogo de carreras'] }
      setMessages([introMsg])
      // speak intro if voice on
      if (voiceOn && isSupported) {
        // small timeout to ensure voice loaded
        setTimeout(()=> speak(introText), 300)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  useEffect(()=>{
    localStorage.setItem('vocai_chat_history', JSON.stringify(messages))
    // scroll to bottom after messages change. If last message is assistant, ensure it's visible.
    const last = messages[messages.length-1]
    const shouldScroll = !!last
    if (shouldScroll) {
      setTimeout(()=> {
        try { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }) } catch(e) { /* ignore */ }
      }, 80)
    }
  }, [messages])

  const send = useCallback(async (text) => {
    if (!text || text.trim()==='') return
    const userMsg = { id: Date.now()+':u', from: 'user', text }
    setMessages(m=>[...m, userMsg])
    setInput('')
    setIsTyping(true)
    try{
      const res = await askVocationalAssistant(text)
      const recommended = res.recommendedCareers || res.topCareers || []
      const assistantMsg = { id: Date.now()+':a', from: 'assistant', text: res.text, suggestions: res.suggestions, recommendedCareers: recommended }
      // simulate typing delay
      setTimeout(()=>{
        setMessages(m=>[...m, assistantMsg])
        setIsTyping(false)
        if (voiceOn && isSupported) speak(assistantMsg.text)
      }, 700 + Math.min(1200, assistantMsg.text.length*20))
    }catch(err){
      setIsTyping(false)
      const errorText = err.message || 'Lo siento, ocurrió un error generando la respuesta. Intenta nuevamente.'
      const errMsg = { id: Date.now()+':aerr', from:'assistant', text: errorText }
      setMessages(m=>[...m, errMsg])
    }
  }, [speak, voiceOn, isSupported])

  function handleMicrophone() {
    if (!isSpeechSupported) return
    if (isListening) {
      stopListening()
    } else {
      startListening((transcript) => {
        setInput(transcript)
      })
    }
  }

  function handleSubmit(e){
    e.preventDefault()
    send(input)
  }

  function handleChip(text){
    // send immediately
    send(text)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-premium mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Asistente Vocacional</h1>
          <div className="text-sm text-gray-500">Chatea con el asistente para explorar las carreras del Departamento de Tecnología Digital de TECSUP – Sede Lima.</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Voz:</div>
          <button onClick={()=>{ setVoiceOn(v=>!v); if (!voiceOn) { /* turning on */ } else cancel() }} className="px-3 py-1 border rounded">{voiceOn ? 'ON' : 'OFF'}</button>
        </div>
      </div>

      <div className="card-premium flex flex-col" style={{height: '60vh'}}>
        <div ref={listRef} className="flex-1 overflow-auto mb-4 p-2 flex flex-col">
          {messages.length===0 && (
            <div className="text-sm text-gray-500">Hola {user?.email || ''}! Puedes empezar preguntando algo o usar las sugerencias.</div>
          )}
          {messages.map(m=> <MessageBubble key={m.id} m={m} />)}
          {isTyping && <div className="text-sm text-gray-500">Asistente está escribiendo...</div>}
        </div>

        <div className="mb-3">
          <div className="flex gap-2">
            <button onClick={()=>handleChip('No sé qué estudiar')} className="px-3 py-1 bg-gray-100 rounded">No sé qué estudiar</button>
            <button onClick={()=>handleChip('Me gustan la programación y la tecnología')} className="px-3 py-1 bg-gray-100 rounded">Me gustan la programación y la tecnología</button>
            <button onClick={()=>handleChip('Prefiero carreras cortas con alta demanda')} className="px-3 py-1 bg-gray-100 rounded">Prefiero carreras cortas con alta demanda</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Escribe tu pregunta aquí..." className="flex-1 border p-2 rounded resize-none" rows={2} />
          <div className="flex flex-col gap-2">
            <button className="v-btn px-4 py-2 rounded">Enviar</button>
            {isSpeechSupported && (
              <button
                type="button"
                onClick={handleMicrophone}
                className="v-btn px-4 py-2 rounded"
              >
                {isListening ? '⏹️ Escuchando…' : '🎙️ Hablar'}
              </button>
            )}
            <Link to="/questionnaire" className="text-sm text-gray-600 underline">Ir al cuestionario</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
