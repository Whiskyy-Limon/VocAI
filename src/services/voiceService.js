/**
 * Voice Service for VocAI
 * Solicita al backend el audio (ElevenLabs) para una respuesta de texto.
 */

import api from './api'

/**
 * Pide al backend el audio TTS de ElevenLabs para el texto dado.
 * @param {string} text
 * @returns {Promise<string>} URL de objeto (blob) reproducible en un <audio>
 * @throws {Error} si ElevenLabs no está disponible (el caller debe hacer fallback)
 */
export async function fetchSpeechAudioUrl(text) {
  if (!text || !text.trim()) {
    throw new Error('El texto es obligatorio')
  }

  const response = await api.post(
    '/voice/speak',
    { text: text.trim() },
    { responseType: 'blob' }
  )

  const blob = new Blob([response.data], { type: 'audio/mpeg' })
  return URL.createObjectURL(blob)
}

export default { fetchSpeechAudioUrl }
