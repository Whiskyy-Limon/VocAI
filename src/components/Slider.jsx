import React from 'react'

export default function Slider({ value = 3, onChange, min = 1, max = 5, labels = {} }){
  const steps = []
  for(let i=min;i<=max;i++) steps.push(i)

  const range = max - min
  const percent = range === 0 ? 0 : ((value - min) / range) * 100

  return (
    <div className="w-full">
      <div className="relative py-6">
        {/* Tooltip positioned above thumb */}
        <div className="absolute left-0 right-0 pointer-events-none">
          <div style={{ left: `${percent}%`, transform: 'translateX(-50%)' }} className="absolute">
            <div className="mb-2 px-2 py-1 rounded bg-blue-600 text-white text-xs font-medium shadow" style={{ whiteSpace: 'nowrap' }}>
              {labels[value] ?? value}
            </div>
            <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto" />
          </div>
        </div>

        <input
          aria-label="Valor"
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e)=>onChange(Number(e.target.value))}
          className="w-full h-2 bg-transparent appearance-none cursor-pointer"
          style={{
            // make track visible with gradient
            background: 'linear-gradient(90deg, #3b82f6 ' + percent + '%, #e5e7eb ' + percent + '%)'
          }}
        />

        {/* ticks */}
        <div className="absolute left-0 right-0 top-9 h-6">
          {steps.map(s=> (
            <div key={s} style={{ left: `${((s-min)/range)*100}%` }} className="absolute transform -translate-x-1/2 text-center w-12">
              <div className={`mx-auto w-3 h-3 rounded-full ${s<=value ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className="text-xs text-gray-500 mt-1">{labels[s] ?? s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
