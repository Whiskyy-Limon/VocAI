import React, { useEffect, useRef } from 'react'

/**
 * Avatar animado de VocAI.
 * - idle      → cara neutral, parpadeo suave
 * - listening → ojos abiertos, cejas arriba, ondas de escucha
 * - processing→ ojos girando / pensando
 * - responding→ boca animada hablando, ondas de voz
 */
export default function VocAIAvatar({ status }) {
  const isSpeaking  = status === 'responding'
  const isListening = status === 'listening'
  const isThinking  = status === 'processing'

  /* gradiente de fondo según estado */
  const bgFrom = isSpeaking  ? '#3b82f6' :
                 isListening ? '#8b5cf6' :
                 isThinking  ? '#f59e0b' : '#0ea5e9'
  const bgTo   = isSpeaking  ? '#2563eb' :
                 isListening ? '#6d28d9' :
                 isThinking  ? '#d97706' : '#0284c7'

  return (
    <div className="vocai-avatar-wrap">
      {/* anillos de fondo */}
      {(isSpeaking || isListening) && (
        <>
          <span className="avatar-ring avatar-ring-1" style={{ borderColor: bgFrom }} />
          <span className="avatar-ring avatar-ring-2" style={{ borderColor: bgFrom }} />
        </>
      )}

      <svg
        viewBox="0 0 120 120"
        className="vocai-avatar-svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="avatarBg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={bgFrom} />
            <stop offset="100%" stopColor={bgTo} />
          </radialGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* Cabeza */}
        <circle cx="60" cy="60" r="52" fill="url(#avatarBg)" />

        {/* Brillo superior */}
        <ellipse cx="60" cy="32" rx="28" ry="12" fill="white" opacity="0.15" />

        {/* ── OREJAS / antenas ── */}
        <rect x="13" y="40" width="8" height="18" rx="4" fill={bgTo} opacity="0.8" />
        <rect x="99" y="40" width="8" height="18" rx="4" fill={bgTo} opacity="0.8" />
        <circle cx="17" cy="36" r="5" fill={bgFrom} stroke="white" strokeWidth="1.5" />
        <circle cx="103" cy="36" r="5" fill={bgFrom} stroke="white" strokeWidth="1.5" />

        {/* ── OJOS ── */}
        {/* ojo izquierdo */}
        <EyeLeft status={status} />
        {/* ojo derecho */}
        <EyeRight status={status} />

        {/* ── BOCA ── */}
        <Mouth status={status} />

        {/* borde metálico */}
        <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.25" />
      </svg>

      {/* ondas de voz debajo cuando habla */}
      {isSpeaking && <SoundWaves />}
    </div>
  )
}

/* ─── Ojo izquierdo ─── */
function EyeLeft({ status }) {
  return (
    <g>
      <ellipse cx="42" cy="54" rx="10" ry="11" fill="white" opacity="0.95" />
      <Pupil cx={42} cy={54} status={status} />
    </g>
  )
}

/* ─── Ojo derecho ─── */
function EyeRight({ status }) {
  return (
    <g>
      <ellipse cx="78" cy="54" rx="10" ry="11" fill="white" opacity="0.95" />
      <Pupil cx={78} cy={54} status={status} />
    </g>
  )
}

/* ─── Pupila con animación ─── */
function Pupil({ cx, cy, status }) {
  const isThinking  = status === 'processing'
  const isSpeaking  = status === 'responding'
  const isListening = status === 'listening'

  /* cejas: más arriba al escuchar */
  const browY = isListening ? cy - 17 : cy - 14

  return (
    <>
      {/* ceja */}
      <rect
        x={cx - 9} y={browY}
        width="18" height="3"
        rx="1.5"
        fill="white"
        opacity="0.5"
        className={isListening ? 'brow-up' : ''}
      />
      {/* pupila */}
      <circle
        cx={cx} cy={cy}
        r={isThinking ? 4 : 5}
        fill={isThinking ? '#fbbf24' : '#1e3a8a'}
        className={
          isThinking  ? 'pupil-spin' :
          isSpeaking  ? 'pupil-pulse' :
          'pupil-blink'
        }
      />
      {/* brillo */}
      <circle cx={cx - 2} cy={cy - 2} r="1.8" fill="white" opacity="0.9" />
    </>
  )
}

/* ─── Boca ─── */
function Mouth({ status }) {
  const isSpeaking = status === 'responding'
  const isHappy    = status === 'idle' || status === 'responding'
  const isThinking = status === 'processing'

  if (isThinking) {
    /* boca torcida — pensando */
    return (
      <path
        d="M 46 80 Q 60 76 74 80"
        stroke="white" strokeWidth="3" strokeLinecap="round"
        fill="none" opacity="0.85"
      />
    )
  }

  if (isSpeaking) {
    return <MouthSpeaking />
  }

  /* sonrisa normal */
  return (
    <path
      d="M 46 78 Q 60 90 74 78"
      stroke="white" strokeWidth="3" strokeLinecap="round"
      fill="none" opacity="0.9"
    />
  )
}

/* ─── Boca hablando (abre/cierra) ─── */
function MouthSpeaking() {
  return (
    <g className="mouth-talk">
      {/* labio superior fijo */}
      <path d="M 46 76 Q 60 72 74 76" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* interior oscuro (elipse que anima) */}
      <ellipse cx="60" cy="80" rx="12" ry="0" fill="#1e3a8a" opacity="0.6" className="jaw-open" />
      {/* labio inferior que baja */}
      <path d="M 46 80 Q 60 88 74 80" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" className="lower-lip" />
    </g>
  )
}

/* ─── Ondas de sonido ─── */
function SoundWaves() {
  return (
    <div className="sound-waves">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="sound-bar" style={{ animationDelay: `${(i - 1) * 0.1}s` }} />
      ))}
    </div>
  )
}
