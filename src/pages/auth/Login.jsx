import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { emailValid, passwordValid } from '../../utils/validators'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!emailValid(email)) return setError('Email inválido')
    if (!passwordValid(password)) return setError('La contraseña debe tener al menos 8 caracteres')
    setLoading(true)
    try {
      await login({ email, password })
      nav('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Credenciales incorrectas')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* círculos decorativos */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">VocAI</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Tu asistente de IA para descubrir la carrera ideal en <strong>Tecsup</strong> según tus intereses y habilidades.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-xs text-blue-100">IA Personalizada</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-xs text-blue-100">Catálogo completo</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs text-blue-100">Orientación vocacional</div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl font-bold text-blue-700">VocAI</span>
            <p className="text-gray-500 text-sm mt-1">Asistente vocacional de Tecsup</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Bienvenido de vuelta</h2>
            <p className="text-gray-500 text-sm mb-7">Ingresa tus credenciales para continuar</p>

            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@tecsup.edu.pe"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <Link to="/forgot" className="text-xs text-blue-600 hover:underline">¿Olvidaste tu contraseña?</Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">Regístrate gratis</Link>
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
