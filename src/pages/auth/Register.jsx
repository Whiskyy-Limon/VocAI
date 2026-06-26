import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { emailValid, passwordValid, checkPasswordRules } from '../../utils/validators'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [showPass, setShowPass] = useState(false)
  const [touched, setTouched] = useState(false)   // mostrar checklist al empezar a escribir
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function update(k, v) { setForm(s => ({ ...s, [k]: v })) }

  const rules = checkPasswordRules(form.password)
  const allPass = rules.every(r => r.ok)

  /* fuerza visual: 0-5 reglas cumplidas */
  const strength = rules.filter(r => r.ok).length
  const strengthColor =
    strength <= 1 ? 'bg-red-500' :
    strength <= 2 ? 'bg-orange-400' :
    strength <= 3 ? 'bg-yellow-400' :
    strength <= 4 ? 'bg-blue-400' :
                    'bg-green-500'
  const strengthLabel =
    strength <= 1 ? 'Muy débil' :
    strength <= 2 ? 'Débil' :
    strength <= 3 ? 'Regular' :
    strength <= 4 ? 'Buena' :
                    'Fuerte'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) return setError('Ingresa tu nombre completo')
    if (!emailValid(form.email)) return setError('Email inválido')
    if (!allPass) { setTouched(true); return setError('La contraseña no cumple todos los requisitos') }
    setLoading(true)
    try {
      await register(form)
      nav('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al crear la cuenta')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">VocAI</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Descubre tu carrera ideal en <strong>Tecsup</strong> con ayuda de inteligencia artificial.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {[
              { icon: '✅', text: 'Test vocacional personalizado' },
              { icon: '✅', text: 'Asistente con IA conversacional' },
              { icon: '✅', text: 'Compara carreras fácilmente' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 text-sm">
                <span>{icon}</span>
                <span className="text-blue-100">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl font-bold text-blue-700">VocAI</span>
            <p className="text-gray-500 text-sm mt-1">Asistente vocacional de Tecsup</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Crear cuenta</h2>
            <p className="text-gray-500 text-sm mb-7">Únete y empieza tu orientación vocacional</p>

            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="usuario@tecsup.edu.pe"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => { update('password', e.target.value); setTouched(true) }}
                    onFocus={() => setTouched(true)}
                    placeholder="Crea una contraseña segura"
                    className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                      touched && !allPass && form.password
                        ? 'border-red-300 bg-red-50 focus:ring-red-400'
                        : touched && allPass
                        ? 'border-green-300 bg-green-50 focus:ring-green-400'
                        : 'border-gray-200 bg-gray-50 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Barra de fuerza */}
                {touched && form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength ? strengthColor : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${
                      strength <= 2 ? 'text-red-500' :
                      strength <= 3 ? 'text-yellow-600' :
                      strength <= 4 ? 'text-blue-600' :
                                      'text-green-600'
                    }`}>
                      {strengthLabel}
                    </p>
                  </div>
                )}

                {/* Checklist de requisitos */}
                {touched && form.password.length > 0 && (
                  <ul className="mt-3 space-y-1.5 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    {rules.map(rule => (
                      <li key={rule.key} className="flex items-center gap-2 text-xs">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold transition-colors ${
                          rule.ok
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {rule.ok ? '✓' : '·'}
                        </span>
                        <span className={`transition-colors ${
                          rule.ok ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          {rule.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">Inicia sesión</Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2025 VocAI — Tecsup. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
