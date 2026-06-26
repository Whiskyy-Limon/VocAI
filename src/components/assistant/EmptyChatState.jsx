import React from 'react'

const SUGGESTIONS = [
  '¿Qué carrera es buena si me gusta programar?',
  '¿Cuánto gana un egresado de Big Data?',
  '¿Qué carreras tienen que ver con videojuegos?',
  '¿Qué estudiar si me interesa la ciberseguridad?',
]

export default function EmptyChatState({ userEmail, onSuggestion }) {
  const name = userEmail ? userEmail.split('@')[0] : 'estudiante'

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center gap-6">
      <div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
          🤖
        </div>
        <h3 className="text-lg font-bold text-gray-900">Hola, {name} 👋</h3>
        <p className="text-gray-500 text-sm mt-1 max-w-xs">
          Presiona el micrófono o escribe para comenzar. Cuéntame tus intereses y te ayudo a elegir tu carrera ideal.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Puedes preguntarme…</p>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => onSuggestion?.(s)}
            className="w-full text-left text-sm text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-100 hover:border-blue-200 rounded-xl px-4 py-2.5 transition-colors"
          >
            💬 {s}
          </button>
        ))}
      </div>
    </div>
  )
}
