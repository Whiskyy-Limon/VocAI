import { useState, useEffect } from 'react'
import api from '../services/api'

/**
 * Hook to fetch careers from the backend API
 * Returns { careers, loading, error }
 * careers: array of career objects with id, title, departamento, sede, etc.
 * loading: boolean indicating if data is being fetched
 * error: error message if fetch failed
 */
export default function useCareers() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get('/careers')
        setCareers(response.data || [])
      } catch (err) {
        console.error('[useCareers] Error fetching careers:', err)
        setError(err.response?.data?.message || 'No se pudieron cargar las carreras. Intenta nuevamente más tarde.')
        setCareers([])
      } finally {
        setLoading(false)
      }
    }

    fetchCareers()
  }, [])

  return { careers, loading, error }
}
