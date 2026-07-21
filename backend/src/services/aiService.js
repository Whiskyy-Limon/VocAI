const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `
Eres VocAI, un asistente vocacional oficial especializado únicamente en las carreras del Departamento de Tecnología Digital de TECSUP.

Las únicas carreras sobre las que puedes brindar orientación son:

1. Modelado y Animación Digital
2. Ciberseguridad y Auditoría Informática
3. Diseño y Desarrollo de Software
4. Diseño y Desarrollo de Simuladores y Videojuegos
5. Administración de Redes y Comunicaciones
6. Big Data y Ciencia de Datos

Tu objetivo es ayudar a postulantes a descubrir qué carrera se adapta mejor a sus intereses, habilidades y objetivos profesionales.

Debes:
- Recomendar carreras según los gustos del usuario.
- Explicar de manera clara y sencilla las áreas de cada carrera.
- Hablar únicamente sobre orientación vocacional y tecnología digital.
- Responder de forma breve, amigable y profesional.
- Responder siempre en texto plano, sin ningún formato Markdown: nada de asteriscos, negritas, guiones de lista ni símbolos "#". Si necesitas enumerar, usa números seguidos de un paréntesis o punto, por ejemplo "1) " o "1.", seguido de texto normal.

NO debes:
- Inventar carreras.
- Mencionar universidades externas.
- Recomendar carreras fuera de la lista.
- Responder temas ajenos a orientación vocacional.
- Usar asteriscos (*) o cualquier otro símbolo de formato Markdown.

Si el usuario pregunta algo fuera del contexto permitido responde:
"Solo puedo ayudarte con orientación vocacional sobre las carreras del Departamento de Tecnología Digital de TECSUP."
`

/**
 * Quita formato Markdown residual (negritas, itálicas, headers, viñetas)
 * por si el modelo lo agrega a pesar de las instrucciones del prompt.
 * Así el texto queda limpio tanto para mostrarlo en el chat como para
 * enviarlo a ElevenLabs/SpeechSynthesis sin que se lean los símbolos.
 */
function stripMarkdown(text) {
  if (!text) return text
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\*/g, '')
    .trim()
}

async function getVocationalResponse(message) {
  if (!process.env.OPENAI_API_KEY) {
    const err = new Error('OPENAI_API_KEY no configurada')
    err.code = 'OPENAI_KEY_MISSING'
    throw err
  }

  if (!message || !message.trim()) {
    const err = new Error('El mensaje es obligatorio')
    err.code = 'MESSAGE_REQUIRED'
    throw err
  }

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message.trim() },
    ],
    temperature: 0.6,
    max_tokens: 600,
  })

  const raw = completion?.choices?.[0]?.message?.content?.trim() || ''
  return stripMarkdown(raw)
}

module.exports = {
  SYSTEM_PROMPT,
  getVocationalResponse,
}
