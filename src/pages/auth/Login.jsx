import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { emailValid, passwordValid } from '../../utils/validators'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!emailValid(email)) return setError('Email inválido')
    if (!passwordValid(password)) return setError('Contraseña muy corta (min 8 caracteres)')
    setLoading(true)
    try {
      await login({ email, password })
      nav('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al iniciar sesión')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Iniciar sesión</h2>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Contraseña" className="w-full border p-2 rounded" />
        <div className="flex items-center justify-between">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          <Link to="/forgot" className="text-sm text-blue-600">¿Olvidaste la contraseña?</Link>
        </div>
      </form>
      <div className="mt-4 text-sm">¿No tienes cuenta? <Link to="/register" className="text-blue-600">Regístrate</Link></div>
    </div>
  )
}
