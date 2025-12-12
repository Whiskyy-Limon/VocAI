import axios from 'axios'

// En Vite las variables vienen de import.meta.env
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE,
})

let token = null

api.setToken = (t) => {
  token = t
  if (t) {
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Interceptor: ensure Authorization header is present on ALL outgoing requests.
// It reads the token from localStorage. We check both 'token' and 'vocai_token'
// to remain compatible with existing code paths that may use either key.
api.interceptors.request.use((config) => {
  try {
    const t = localStorage.getItem('token') || localStorage.getItem('vocai_token')
    if (t) {
      // Temporal debug log to confirm interceptor runs and token is read
      console.log('INTERCEPTOR TOKEN:', t)
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${t}`
    }
  } catch (e) {
    // localStorage access can fail in some environments; ignore and proceed
  }
  return config
}, (error) => Promise.reject(error))

// Simple wrapper for consistent response/error handling
api.postSafe = (url, data) => api.post(url, data)

export default api
