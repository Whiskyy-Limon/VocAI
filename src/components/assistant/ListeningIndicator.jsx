import React from 'react'

export default function ListeningIndicator({ status, transcript }) {
  if (!status) return null

  const labelMap = {
    idle: 'Listo para escuchar',
    listening: 'Escuchando...',
    processing: 'Procesando...',
    responding: 'Respondiendo...',
  }

  return (
    <div className="assistant-status">
      <div className="assistant-status__label">{labelMap[status] || 'Listo'}</div>
      {status === 'listening' && (
        <div className="assistant-status__transcript">
          {transcript && transcript.trim().length > 0 ? transcript : 'Habla cuando estes listo...'}
        </div>
      )}
      {status === 'processing' && <div className="assistant-status__wave" aria-hidden="true" />}
      {status === 'responding' && <div className="assistant-status__wave" aria-hidden="true" />}
    </div>
  )
}
