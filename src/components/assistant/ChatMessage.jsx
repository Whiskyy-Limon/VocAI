import React from 'react'
import { Link } from 'react-router-dom'

export default function ChatMessage({ message }) {
  const isAssistant = message.from === 'assistant'
  const isSystem    = message.from === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-2 rounded-full">
          <span>⚠️</span>
          {message.text}
        </div>
      </div>
    )
  }

  if (isAssistant) {
    return (
      <div className="flex items-end gap-2 max-w-[80%]">
        {/* Avatar pequeño */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1">
          V
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
            <p className="text-sm text-gray-800 leading-relaxed">{message.text}</p>
          </div>
          {message.recommendedCareers?.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-gray-400 pl-1">Carreras recomendadas:</p>
              {message.recommendedCareers.map(career => (
                <Link
                  key={career.id}
                  to={`/career/${career.id}`}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 text-xs font-medium px-3 py-2 rounded-xl transition-colors"
                >
                  🎓 {career.title} →
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  /* Usuario */
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
    </div>
  )
}
