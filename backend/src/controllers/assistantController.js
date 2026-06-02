// backend/src/controllers/assistantController.js
const OpenAI = require('openai');
const Career = require('../models/Career');
const { getVocationalResponse } = require('../services/aiService');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Controlador askAssistant
 * Nota: El identificador del usuario (userId) ahora se obtiene desde el token JWT
 * y lo coloca el middleware de autenticación en `req.user`. No se debe confiar
 * en un `userId` pasado en el body para fines de autenticación/autorización.
 */
async function askAssistant(req, res) {
  try {
    const { message } = req.body;

    // Asegurarse que la petición viene de un usuario autenticado; el middleware
    // de autenticación debe adjuntar `req.user` con la información del token.
    // También mantenemos compatibilidad con `req.userId`.
    const userId = req.user?.id || req.userId
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    // Validación básica del payload: solo el mensaje es obligatorio
    if (!message) {
      return res.status(400).json({ message: 'El mensaje es obligatorio.' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY no configurada');
      return res.status(500).json({ message: 'Error de configuración: API key de OpenAI no disponible' });
    }

    // Cargar todas las carreras del departamento
    const careers = await Career.find({ department: 'Tecnología Digital' }).lean();

    if (!careers || careers.length === 0) {
      return res.status(500).json({ message: 'Error: No se encontraron carreras en la base de datos' });
    }

    // Construir el prompt del sistema
    const systemPrompt = buildSystemPrompt(careers);
    const userMessage = message;

    // Llamar a OpenAI GPT-4 mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // o 'gpt-4' si tienes acceso
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Guardado defensivo: OpenAI puede devolver estructuras diferentes en fallos
    const reply = completion?.choices?.[0]?.message?.content || '';

    // Sin perfil vocacional: enviamos lista vacía y dejamos que el frontend no muestre enlaces extras
    const topCareers = [];

    // Respuesta al frontend
    res.json({
      reply,
      metadata: {
        topCareers,
        usedProfile: false,
        model: 'gpt-4o-mini',
      },
    });
  } catch (err) {
    console.error('[assistantController] Error generando respuesta:', err);
    return res.status(500).json({ message: 'Error generando respuesta del asistente' });
  }
}

/**
 * POST /api/assistant/chat
 * Respuesta directa desde OpenAI con prompt restringido a TECSUP.
 */
async function chatAssistant(req, res) {
  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'El mensaje es obligatorio.' });
    }

    const response = await getVocationalResponse(message);

    if (!response) {
      return res.status(502).json({ message: 'No se pudo generar una respuesta.' });
    }

    return res.json({ response });
  } catch (err) {
    const code = err?.code || '';

    if (code === 'OPENAI_KEY_MISSING') {
      return res.status(500).json({ message: 'Error de configuracion: OPENAI_API_KEY no disponible' });
    }

    if (code === 'MESSAGE_REQUIRED') {
      return res.status(400).json({ message: 'El mensaje es obligatorio.' });
    }

    console.error('[chatAssistant] Error:', err);
    return res.status(500).json({ message: 'Error generando respuesta del asistente' });
  }
}

/**
 * Construye el prompt del sistema con contexto detallado
 */
function buildSystemPrompt(careers) {
  // Construir lista formateada de carreras
  const careersText = careers
    .map(
      (c) =>
        `- ${c.title} (Código: ${c.codigo})\n  Descripción: ${c.description}\n  Sueldo referencial: ${c.salaryText || (c.salary ? `S/ ${c.salary}` : 'No especificado')}\n  Duración: ${c.duration}\n  Enfoque: ${c.field}\n  Tecnologías/Habilidades: ${(c.skills || []).join(', ')}`
    )
    .join('\n\n');

  return `Eres un asistente de orientación vocacional empático y profesional para estudiantes del Departamento de Tecnología Digital de TECSUP – Sede Santa Anita (Lima).

Tu objetivo es ayudar a los estudiantes a elegir y entender mejor sus opciones de carrera basándote en:
1. Los datos reales de cada carrera (duración, enfoque, sueldo referencial, habilidades)
2. Sus preguntas e intereses específicos

## Carreras Disponibles
${careersText}

## Instrucciones para tus respuestas
1. Responde SIEMPRE en español, con tono claro, empático y accesible.
2. Menciona explícitamente las carreras que mejor encajan según lo que el estudiante comenta.
3. Justifica por qué recomiendas esas carreras (usa duración, enfoque, sueldo referencial y habilidades).
4. Si el estudiante pregunta sobre datos específicos, usa la información de la BD proporcionada.
5. Sé conciso pero informativo; máximo 300 palabras por respuesta.
6. Si el estudiante parece indeciso, motívalo y destaca las oportunidades del Departamento.
7. No hagas recomendaciones fuera del Departamento de Tecnología Digital de TECSUP.`;
}

module.exports = { askAssistant, chatAssistant };
