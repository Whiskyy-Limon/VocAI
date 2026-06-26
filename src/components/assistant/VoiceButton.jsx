import React from 'react'

const STATE = {
  idle:       { label: 'Hablar',      bg: 'from-blue-500 to-blue-700',     ring: '' },
  listening:  { label: 'Detener',     bg: 'from-violet-500 to-violet-700', ring: 'ring-violet-400' },
  processing: { label: 'Procesando',  bg: 'from-amber-400 to-amber-600',   ring: '' },
  responding: { label: 'Respondiendo',bg: 'from-blue-400 to-indigo-600',   ring: '' },
}

export default function VoiceButton({ status, onClick, disabled }) {
  const cfg = STATE[status] ?? STATE.idle
  const isListening  = status === 'listening'
  const isProcessing = status === 'processing'
  const isResponding = status === 'responding'

  return (
    <div className="relative flex items-center justify-center">
      {/* anillos al escuchar */}
      {isListening && (
        <>
          <span className="absolute w-24 h-24 rounded-full border-2 border-violet-400 animate-ping opacity-40" />
          <span className="absolute w-32 h-32 rounded-full border border-violet-300 animate-ping opacity-20" style={{ animationDelay: '0.3s' }} />
        </>
      )}

      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isProcessing || isResponding}
        className={`
          relative w-20 h-20 rounded-full
          bg-gradient-to-br ${cfg.bg}
          text-white shadow-lg
          flex flex-col items-center justify-center gap-1
          transition-all duration-200
          hover:scale-105 hover:shadow-xl
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${isListening ? 'scale-110 shadow-violet-300/50' : ''}
        `}
        aria-pressed={isListening}
      >
        {isProcessing ? (
          <svg className="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : isListening ? (
          /* ícono de stop */
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          /* ícono de micrófono */
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z" />
          </svg>
        )}
        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
          {cfg.label}
        </span>
      </button>
    </div>
  )
}
