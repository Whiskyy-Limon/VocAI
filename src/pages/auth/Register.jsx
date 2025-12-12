import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { emailValid, passwordValid } from '../../utils/validators'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function update(k, v) { setForm(s=>({...s, [k]: v})) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!form.name) return setError('Ingrese su nombre')
    if (!emailValid(form.email)) return setError('Email inválido')
    if (!passwordValid(form.password)) return setError('Contraseña muy corta (min 8 caracteres)')
    setLoading(true)
    try {
      await register(form)
      nav('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al registrar')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Registro</h2>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={form.name} onChange={(e)=>update('name', e.target.value)} placeholder="Nombre completo" className="w-full border p-2 rounded" />
        <input value={form.email} onChange={(e)=>update('email', e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
        <input value={form.password} onChange={(e)=>update('password', e.target.value)} type="password" placeholder="Contraseña (min 8)" className="w-full border p-2 rounded" />
        <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</button>
      </form>
    </div>
  )
}
