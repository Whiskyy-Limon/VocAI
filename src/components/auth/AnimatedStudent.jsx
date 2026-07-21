import React from 'react'

/**
 * Ilustración animada de un estudiante para el panel de branding del login/registro.
 * Flota suavemente, parpadea y saluda con la mano; íconos orbitan alrededor.
 */
export default function AnimatedStudent() {
  return (
    <div className="student-illustration">
      <span className="student-float-icon student-float-icon--1" aria-hidden="true">🎓</span>
      <span className="student-float-icon student-float-icon--2" aria-hidden="true">💡</span>
      <span className="student-float-icon student-float-icon--3" aria-hidden="true">📚</span>

      <svg viewBox="0 0 200 220" className="student-svg" aria-hidden="true">
        {/* sombra */}
        <ellipse cx="100" cy="207" rx="50" ry="9" fill="#000000" opacity="0.15" />

        <g className="student-body-float">
          {/* piernas */}
          <rect x="80" y="150" width="15" height="42" rx="7" fill="#1F2937" />
          <rect x="105" y="150" width="15" height="42" rx="7" fill="#1F2937" />
          {/* zapatos */}
          <ellipse cx="87" cy="194" rx="11" ry="6" fill="#062B3D" />
          <ellipse cx="113" cy="194" rx="11" ry="6" fill="#062B3D" />

          {/* cuerpo / hoodie */}
          <rect x="62" y="96" width="76" height="66" rx="26" fill="#ffffff" />
          <path d="M62 128 Q100 143 138 128 L138 160 Q100 173 62 160 Z" fill="#00AEEF" />

          {/* brazo izquierdo sosteniendo un libro */}
          <rect x="49" y="112" width="15" height="40" rx="7" fill="#ffffff" transform="rotate(10 56 112)" />
          <rect x="54" y="146" width="28" height="19" rx="4" fill="#0072A3" />
          <rect x="54" y="146" width="28" height="4" fill="#EAFBFF" opacity="0.7" />

          {/* brazo derecho saludando */}
          <g className="student-wave-arm">
            <rect x="127" y="94" width="15" height="40" rx="7" fill="#ffffff" />
            <circle cx="135" cy="90" r="8.5" fill="#F2C39B" />
          </g>

          {/* cabeza */}
          <circle cx="100" cy="70" r="33" fill="#F2C39B" />

          {/* cabello */}
          <path d="M67 63 Q66 30 100 30 Q134 30 133 63 Q127 47 100 47 Q73 47 67 63 Z" fill="#2B2118" />

          {/* birrete */}
          <g>
            <path d="M63 34 L100 20 L137 34 L100 48 Z" fill="#062B3D" />
            <rect x="96" y="46" width="8" height="10" fill="#062B3D" />
            <circle cx="100" cy="20" r="2.6" fill="#00AEEF" />
            <line x1="100" y1="21" x2="114" y2="42" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="114" cy="43" r="3" fill="#00AEEF" />
          </g>

          {/* ojos */}
          <circle cx="89" cy="71" r="3.4" fill="#1F2937" className="pupil-blink" />
          <circle cx="111" cy="71" r="3.4" fill="#1F2937" className="pupil-blink" />

          {/* sonrisa */}
          <path d="M89 83 Q100 91 111 83" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* mejillas */}
          <circle cx="79" cy="79" r="3.5" fill="#F49B7A" opacity="0.45" />
          <circle cx="121" cy="79" r="3.5" fill="#F49B7A" opacity="0.45" />
        </g>
      </svg>
    </div>
  )
}
