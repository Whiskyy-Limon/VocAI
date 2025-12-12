import React, { createContext, useEffect, useState } from 'react'
import api from '../services/api'
import jwtDecode from 'jwt-decode'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('vocai_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      if (token) {
        try {
          const decoded = jwtDecode(token)
          setUser({ id: decoded.sub, email: decoded.email })
          api.setToken(token)
        } catch (err) {
          console.error('Invalid token', err)
          setUser(null)
          setToken(null)
          localStorage.removeItem('vocai_token')
        }
      }
      setLoading(false)
    }
    init()
  }, [token])

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    // Expect { token }
    const { token: t } = res.data
    localStorage.setItem('vocai_token', t)
    setToken(t)
    api.setToken(t)
    const decoded = jwtDecode(t)
    setUser({ id: decoded.sub, email: decoded.email })
  }

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload)
    return res.data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('vocai_token')
    api.setToken(null)
  }

  const value = { user, token, loading, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
