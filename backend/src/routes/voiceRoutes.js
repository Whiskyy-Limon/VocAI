// backend/src/routes/voiceRoutes.js
const express = require('express')
const { speak } = require('../controllers/voiceController')

const router = express.Router()

/**
 * POST /api/voice/speak
 * Body: { "text": "texto a convertir en audio" }
 * Respuesta exitosa (200): audio/mpeg (buffer binario)
 * Error (502): { message, code } — el frontend debe hacer fallback a SpeechSynthesis nativa
 */
router.post('/speak', speak)

module.exports = router
