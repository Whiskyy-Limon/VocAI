const { synthesizeSpeech } = require('../services/voiceService')

/**
 * POST /api/voice/speak
 * Body: { text: string }
 * Devuelve el audio (mp3) generado por ElevenLabs como buffer binario.
 * Si ElevenLabs falla (clave inválida, límite del plan gratuito, etc.),
 * responde 502 con un código de error para que el frontend haga fallback
 * a la síntesis de voz nativa del navegador.
 */
async function speak(req, res) {
  try {
    const { text } = req.body || {}

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'El texto es obligatorio.' })
    }

    const audioBuffer = await synthesizeSpeech(text)

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'no-store',
    })
    return res.send(audioBuffer)
  } catch (err) {
    const code = err?.code || ''

    if (code === 'ELEVENLABS_KEY_MISSING') {
      console.error('[voiceController] ELEVENLABS_API_KEY no configurada')
      return res.status(502).json({ message: 'Síntesis de voz no disponible.', code })
    }

    if (code === 'TEXT_REQUIRED') {
      return res.status(400).json({ message: 'El texto es obligatorio.', code })
    }

    console.error('[voiceController] Error generando audio:', err.message)
    return res.status(502).json({ message: 'No se pudo generar el audio con ElevenLabs.', code: code || 'ELEVENLABS_ERROR' })
  }
}

module.exports = { speak }
