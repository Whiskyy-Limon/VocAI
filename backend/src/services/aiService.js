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

NO debes:
- Inventar carreras.
- Mencionar universidades externas.
- Recomendar carreras fuera de la lista.
- Responder temas ajenos a orientación vocacional.

Si el usuario pregunta algo fuera del contexto permitido responde:
"Solo puedo ayudarte con orientación vocacional sobre las carreras del Departamento de Tecnología Digital de TECSUP."
`

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

  return completion?.choices?.[0]?.message?.content?.trim() || ''
}

module.exports = {
  SYSTEM_PROMPT,
  getVocationalResponse,
}
