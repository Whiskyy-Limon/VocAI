import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration, onClose])

  if (!message) return null

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[type] || 'bg-blue-500'

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-pulse`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-lg font-bold">✕</button>
    </div>
  )
}
