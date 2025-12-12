// backend/src/routes/assistantRoutes.js
const express = require('express');
const { askAssistant } = require('../controllers/assistantController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /api/assistant
 * 
 * Genera una respuesta de orientación vocacional personalizada usando OpenAI
 * 
 * Requiere autenticación (token JWT en header Authorization)
 * 
 * Body:
 * {
 *   "message": "¿Qué carrera me recomiendas?",
 * }
 * 
 * Respuesta exitosa (200):
 * {
 *   "reply": "Según tu perfil, te recomiendo...",
 *   "metadata": {
 *     "topCareers": [ { "id": "64a1...", "title": "Simuladores y Videojuegos" } ],
 *     "usedProfile": true,
 *     "model": "gpt-4o-mini"
 *   }
 * }
 * 
 * Errores:
 * - 400: { message: 'El mensaje es obligatorio.' } — si el body no incluye `message`
 * - 500: Error de OpenAI o servidor
 * Requiere autenticación (token JWT en header Authorization — userId se obtiene del token)
 * Nota: No envíes `userId` en el body; el servidor lo obtiene del JWT.
 */
router.post('/', authMiddleware, askAssistant);

module.exports = router;
