import React, { useState } from 'react'
import api from '../../services/api'

export default function ForgotPassword(){
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try{
      await api.post('/auth/forgot', { email })
      setMsg('Si el email existe, recibirás instrucciones para recuperar la contraseña.')
    }catch(err){
      setMsg('Error al solicitar recuperación')
    }finally{setLoading(false)}
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Recuperar contraseña</h2>
      {msg && <div className="mb-2 text-green-600">{msg}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
      </form>
    </div>
  )
}
