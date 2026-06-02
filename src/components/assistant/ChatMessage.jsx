import React from 'react'
import { Link } from 'react-router-dom'

export default function ChatMessage({ message }) {
  const isAssistant = message.from === 'assistant'
  const isSystem = message.from === 'system'

  if (isSystem) {
    return (
      <div className="assistant-system">
        {message.text}
      </div>
    )
  }

  return (
    <div className={`assistant-bubble ${isAssistant ? 'assistant-bubble--assistant' : 'assistant-bubble--user'}`}>
      <div className="assistant-bubble__text">{message.text}</div>
      {isAssistant && message.recommendedCareers?.length > 0 && (
        <div className="assistant-bubble__links">
          {message.recommendedCareers.map((career) => (
            <Link key={career.id} to={`/career/${career.id}`} className="assistant-link">
              {career.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
