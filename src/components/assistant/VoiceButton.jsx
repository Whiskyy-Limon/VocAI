import React from 'react'

export default function VoiceButton({ status, onClick, disabled }) {
  const isListening = status === 'listening'
  const isProcessing = status === 'processing'

  const label = isListening
    ? 'Detener'
    : isProcessing
      ? 'Procesando'
      : 'Hablar'

  return (
    <button
      type="button"
      className={`mic-button ${isListening ? 'mic-button--listening' : ''}`}
      onClick={onClick}
      disabled={disabled || isProcessing}
      aria-pressed={isListening}
    >
      <span className="mic-button__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="mic-icon" role="presentation">
          <path
            d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 1 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="mic-button__label">{label}</span>
      {isListening && (
        <span className="mic-button__rings" aria-hidden="true">
          <span className="mic-ring" />
          <span className="mic-ring mic-ring--delay" />
        </span>
      )}
    </button>
  )
}
