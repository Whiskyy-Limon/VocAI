import React from 'react'
import { Link } from 'react-router-dom'

export default function AssistantHeader({ statusLabel, voiceOn, onToggleVoice }) {
  return (
    <div className="assistant-hero card-premium relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-600">VocAI</div>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
              Asistente Vocacional por Voz
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
              Explora las carreras del Departamento de Tecnologia Digital de TECSUP - Sede Santa Anita (Lima) con una
              experiencia conversacional 100% por voz.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="status-pill">{statusLabel}</div>
            <button
              onClick={onToggleVoice}
              className="btn-secondary"
              aria-pressed={voiceOn}
            >
              Voz {voiceOn ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-xs md:text-sm">
          <div className="assistant-chip">Enfocado en Tecnologia Digital</div>
          <div className="assistant-chip">Recomendaciones basadas en datos reales</div>
          <div className="assistant-chip">Respuestas en tiempo real</div>
          <Link to="/catalog" className="assistant-link">Ver catalogo</Link>
        </div>
      </div>

      <div className="assistant-hero-glow" aria-hidden="true" />
    </div>
  )
}
