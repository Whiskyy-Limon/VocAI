import React from 'react'

const CONFIG = {
  idle:       { label: 'Listo para escuchar', icon: '🎙️', bar: false },
  listening:  { label: 'Escuchando...',        icon: '👂', bar: true  },
  processing: { label: 'Pensando...',           icon: '⚙️', bar: true  },
  responding: { label: 'Respondiendo...',       icon: '🔊', bar: true  },
}

export default function ListeningIndicator({ status, transcript }) {
  const cfg = CONFIG[status] ?? CONFIG.idle

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span>{cfg.icon}</span>
        <span className="uppercase tracking-widest text-xs">{cfg.label}</span>
      </div>

      {/* Transcript en vivo */}
      {status === 'listening' && (
        <div className="w-full max-w-xs bg-violet-50 border border-violet-200 rounded-xl px-4 py-2 min-h-[40px] flex items-center justify-center">
          <p className="text-sm text-violet-700 text-center italic">
            {transcript?.trim() || 'Habla cuando estés listo...'}
          </p>
        </div>
      )}

      {/* Barras de onda cuando procesa o responde */}
      {cfg.bar && status !== 'listening' && (
        <div className="flex items-end gap-1 h-6">
          {[1,2,3,4,5,4,3].map((h, i) => (
            <span
              key={i}
              className="block w-1 rounded-full bg-blue-500"
              style={{
                height: `${h * 4}px`,
                animation: `sound-bounce 0.5s ease-in-out ${i * 0.07}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
