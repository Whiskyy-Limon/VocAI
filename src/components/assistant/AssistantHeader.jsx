import React from 'react'
import { Link } from 'react-router-dom'

const STATUS_CONFIG = {
  idle:       { color: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400',  label: 'Esperando' },
  listening:  { color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500 animate-pulse', label: 'Escuchando' },
  processing: { color: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500 animate-pulse',  label: 'Procesando' },
  responding: { color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500 animate-pulse',   label: 'Respondiendo' },
}

export default function AssistantHeader({ statusLabel, voiceOn, onToggleVoice, status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-2xl px-7 py-6 text-white overflow-hidden">
      {/* destellos decorativos */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-40 h-40 bg-indigo-500/10 rounded-full translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-xs font-bold">V</div>
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">VocAI Assistant</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            Asistente Vocacional IA
          </h1>
          <p className="text-blue-200/70 text-sm mt-1 max-w-lg">
            Conversa por voz con IA para descubrir la carrera ideal en Tecnología Digital — TECSUP Santa Anita.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">
              🎓 Tecnología Digital
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">
              🤖 IA en tiempo real
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">
              🎙️ Voz + texto
            </span>
            <Link to="/catalog" className="flex items-center gap-1 bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 text-xs px-3 py-1 rounded-full transition-colors">
              📚 Ver catálogo →
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {/* Pill de estado */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.color}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>

          {/* Toggle voz */}
          <button
            onClick={onToggleVoice}
            aria-pressed={voiceOn}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              voiceOn
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <span>{voiceOn ? '🔊' : '🔇'}</span>
            Voz {voiceOn ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  )
}
