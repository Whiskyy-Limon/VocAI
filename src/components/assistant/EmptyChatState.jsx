import React from 'react'

export default function EmptyChatState({ userEmail }) {
  return (
    <div className="assistant-empty">
      <div className="assistant-empty__title">
        Hola{userEmail ? `, ${userEmail}` : ''}.
      </div>
      <div className="assistant-empty__text">
        Presiona el microfono para comenzar la conversacion por voz.
      </div>
    </div>
  )
}
