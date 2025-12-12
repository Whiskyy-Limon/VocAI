/**
 * Assistant Service for VocAI
 * Handles communication with the backend OpenAI-powered vocational guidance endpoint
 */

import api from './api'

/**
 * Fetch user's JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
function getToken() {
  return localStorage.getItem('vocai_token')
}

/**
 * Call the backend vocational assistant endpoint with OpenAI integration
 * @param {string} userMessage - The user's question or message
 * @param {Object} options - Configuration options (unused; keep for compatibility)
 * @returns {Promise<Object>} Response object with fields: { text, topCareers, recommendedCareers, suggestions }
 * @throws {Error} Will throw if network or backend error occurs
 */
export async function askVocationalAssistant(userMessage, options = {}) {
  // Validate input
  if (!userMessage || userMessage.trim().length === 0) {
    throw new Error('El mensaje no puede estar vacío')
  }

  // NOTE: Authentication/authorization is handled by the backend via JWT in the
  // Authorization header (set by `api.setToken()` in the Auth flow). The backend
  // resolves the authenticated user from the token, so we don't send userId in
  // the request body to avoid trusting client-provided values.
  try {
    // Build request payload (only message) — userId is resolved on server side
    const payload = { message: userMessage.trim() }

    // Make POST request to backend assistant endpoint.
    // Note: the `api` client already sets the base URL to `http://localhost:4000/api`,
    // so the correct path here is `/assistant` (not `/api/assistant`) to avoid duplication.
    const response = await api.post('/assistant', payload)

    const { reply, metadata } = response.data

    // Build standardized response for frontend
    return {
      text: reply || 'No se pudo generar una respuesta.',
      topCareers: metadata?.topCareers || [],
      suggestions: [], // Keep for component compatibility
      // Keep backward compatibility: recommendedCareers used by assistant chat UI
      recommendedCareers: metadata?.topCareers || [],
    }
  } catch (error) {
    const status = error.response?.status
    const serverMessage = String(error.response?.data?.message || '')

    // 401/403: Authentication/authorization issue — ask user to re-login
    if (status === 401 || status === 403) {
      throw new Error('Tu sesión ha expirado o no se reconoce el usuario. Por favor, inicia sesión nuevamente.')
    }

    // If backend explicitly says no vocational profile exists, propagate that exact message
    if (status === 400 && serverMessage === 'No se encontró un perfil vocacional. Primero completa el cuestionario.') {
      throw new Error(serverMessage)
    }

    // For 500 or any other server/network error show a generic message
    throw new Error('Ocurrió un problema al conectar con el asistente. Intenta nuevamente en unos minutos.')
  }
}

export default { askVocationalAssistant }
