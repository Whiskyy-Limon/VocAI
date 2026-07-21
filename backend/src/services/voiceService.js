const { getEnv } = require('../config/env')

const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech'

/**
 * Convierte texto a voz usando la API de ElevenLabs (modelo multilingüe, voz en español).
 * @param {string} text
 * @returns {Promise<Buffer>} audio en formato mp3
 */
async function synthesizeSpeech(text) {
  const { elevenLabsApiKey, elevenLabsVoiceId, elevenLabsModel } = getEnv()

  if (!elevenLabsApiKey) {
    const err = new Error('ELEVENLABS_API_KEY no configurada')
    err.code = 'ELEVENLABS_KEY_MISSING'
    throw err
  }

  if (!text || !text.trim()) {
    const err = new Error('El texto es obligatorio')
    err.code = 'TEXT_REQUIRED'
    throw err
  }

  const response = await fetch(`${ELEVENLABS_TTS_URL}/${elevenLabsVoiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': elevenLabsApiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: text.trim(),
      model_id: elevenLabsModel,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    const err = new Error(`ElevenLabs respondió ${response.status}: ${errorBody}`)
    err.code = response.status === 401 ? 'ELEVENLABS_KEY_INVALID' : 'ELEVENLABS_REQUEST_FAILED'
    err.status = response.status
    throw err
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

module.exports = { synthesizeSpeech }
