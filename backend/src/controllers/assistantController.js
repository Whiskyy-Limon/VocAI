// backend/src/controllers/assistantController.js
const OpenAI = require('openai');
const VocationalProfile = require('../models/VocationalProfile');
const Career = require('../models/Career');
const User = require('../models/User');

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
    
    console.log('=== ASSISTANT REQUEST ===');
    console.log('Body:', req.body);
    console.log('User from token:', req.user);

    // Asegurarse que la petición viene de un usuario autenticado; el middleware
    // de autenticación debe adjuntar `req.user` con la información del token.
    // También mantenemos compatibilidad con `req.userId`.
    const userId = req.user?.id || req.userId;
    console.log('UserId extracted:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    // Validación básica del payload: solo el mensaje es obligatorio
    if (!message) {
      return res.status(400).json({ message: 'El mensaje es obligatorio.' });
    }
    
    console.log('Message:', message);

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY no configurada');
      return res.status(500).json({ message: 'Error de configuración: API key de OpenAI no disponible' });
    }

    // Buscar el perfil vocacional más reciente del usuario. No es obligatorio.
    const userProfile = await VocationalProfile.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    console.log('User profile found:', !!userProfile);

    // Cargar todas las carreras
    const careers = await Career.find({ department: 'Tecnología Digital', sede: 'Lima' }).lean();
    console.log('Careers found:', careers.length);

    if (!careers || careers.length === 0) {
      return res.status(500).json({ message: 'Error: No se encontraron carreras en la base de datos' });
    }

    // Cargar info del usuario (opcional)
    const user = await User.findById(userId).select('email').lean();

    // Construir el prompt del sistema
    const systemPrompt = buildSystemPrompt(careers, userProfile, user);
    const userMessage = message;

    // Llamar a OpenAI GPT-4 mini
    console.log('Calling OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    console.log('OpenAI response received');

    // Guardado defensivo: OpenAI puede devolver estructuras diferentes en fallos
    let reply = completion?.choices?.[0]?.message?.content || '';
    
    // Post-procesamiento: Mejorar el espaciado de la respuesta
    reply = improveFormatting(reply);

    // Extraer carreras principales recomendadas (vacío si no existe perfil)
    const topCareers = extractTopCareers(userProfile, careers);

    // Respuesta al frontend con saltos de línea preservados
    res.json({
      reply,
      replyHtml: convertToHtml(reply), // Versión HTML para frontend
      metadata: {
        topCareers,
        usedProfile: !!userProfile,
        model: 'gpt-4o-mini',
      },
    });
  } catch (err) {
    console.error('[assistantController] Error generando respuesta:', err);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ message: 'Error generando respuesta del asistente' });
  }
}

/**
 * Construye el prompt del sistema con contexto detallado
 */
function buildSystemPrompt(careers, userProfile, user) {
  // Construir lista formateada de carreras
  const careersText = careers
    .map(
      (c) =>
        `- ${c.title} (Código: ${c.codigo})\n  Descripción: ${c.description}\n  Salario promedio: S/ ${c.salary.toLocaleString('es-PE')}\n  Demanda laboral: ${c.demand}\n  Duración: ${c.duration}`
    )
    .join('\n\n');

  // Construir scores del perfil del usuario (si existe)
  const scoresText = userProfile
    ? Object.entries(userProfile.areaScores || {})
        .map(([carrera, score]) => `- ${carrera}: ${score}%`)
        .join('\n')
    : ''

  // Top 3 carreras recomendadas (si existe perfil)
  const topText = userProfile?.topCareers && userProfile.topCareers.length > 0
    ? userProfile.topCareers.map((c, idx) => `${idx + 1}. ${c.name} (Afinidad: ${c.affinity}%)`).join('\n')
    : '';

  // Construir sección del perfil para el prompt: si hay perfil mostramos detalles, si no, un aviso corto
  const profileSection = userProfile
    ? `## Perfil Vocacional del Estudiante\nAfinidad detectada por área/carrera:\n${scoresText}\n\nTop 3 recomendaciones:\n${topText}`
    : '## Perfil Vocacional del Estudiante\nNo hay perfil vocacional disponible para este usuario. Responde proveyendo información general y recomendaciones basadas en las 6 carreras disponibles.'

  return `Eres un asistente de orientación vocacional para estudiantes de TECSUP Lima - Departamento de Tecnología Digital.

## Carreras Disponibles:
${careersText}

${profileSection}

## INSTRUCCIONES DE FORMATO (CRÍTICO - SEGUIR EXACTAMENTE):

Tu respuesta DEBE tener esta estructura EXACTA:

¡Hola! [Saludo breve en 1 línea]

[Introducción contextual si es necesaria - máximo 1 línea]

**1. [Nombre Carrera] ([Código])**
[Descripción atractiva en 1 línea]

[Explicación de beneficios en 1-2 líneas]

💰 **Salario:** S/ X,XXX | 📊 **Demanda:** [Nivel]

**2. [Nombre Carrera] ([Código])**
[Descripción atractiva en 1 línea]

[Explicación de beneficios en 1-2 líneas]

💰 **Salario:** S/ X,XXX | 📊 **Demanda:** [Nivel]

**3. [Nombre Carrera] ([Código])**
[Descripción atractiva en 1 línea]

[Explicación de beneficios en 1-2 líneas]

💰 **Salario:** S/ X,XXX | 📊 **Demanda:** [Nivel]

[Cierre motivacional en 1-2 líneas]

[Pregunta de engagement al estudiante]

## REGLAS OBLIGATORIAS:
1. Deja UNA LÍNEA EN BLANCO después del saludo inicial
2. Deja UNA LÍNEA EN BLANCO antes de cada número de carrera
3. NO dejes líneas en blanco entre el título y la descripción de la carrera
4. Deja UNA LÍNEA EN BLANCO después del emoji 💰
5. Máximo 3-4 carreras por respuesta
6. Español peruano, tono cercano y motivador
7. Salarios SIEMPRE en formato "S/ X,XXX"
8. Prioriza carreras de Demanda "Muy Alta" primero
9. Usa emojis: 💰 📊 🎮 💻 🔐 🎨 📱
10. Máximo 400 palabras

## EJEMPLO PERFECTO:
¡Hola! Me alegra ayudarte a encontrar tu mejor opción.

**1. Big Data y Ciencia de Datos (BDCD)**
La carrera más demandada del mercado tecnológico peruano.

Aprenderás machine learning, Python y análisis de datos masivos. Las empresas buscan urgentemente estos profesionales.

💰 **Salario:** S/ 5,000 | 📊 **Demanda:** Muy Alta

**2. Diseño y Desarrollo de Software (DDS)**
Conviértete en desarrollador full-stack desde el primer día.

Dominarás frameworks modernos, arquitectura de software y metodologías ágiles. Ideal para crear aplicaciones innovadoras.

💰 **Salario:** S/ 4,200 | 📊 **Demanda:** Muy Alta

Las dos carreras tienen excelente proyección y duran 3 años.

¿Cuál de estas opciones te atrae más?`;
}

/**
 * Extrae las carreras principales del perfil del usuario
 */
function extractTopCareers(userProfile, careers) {
  if (!userProfile || !userProfile.topCareers || userProfile.topCareers.length === 0) {
    return [];
  }

  // Return top career objects with id & title so the frontend can build links
  return userProfile.topCareers.slice(0, 3).map((tc) => {
    const found = careers.find(c => String(c._id) === String(tc.careerId) || String(c.codigo) === String(tc.careerId) || c.title === tc.name)
    const id = found ? (found._id ? String(found._id) : (found.id || found.codigo)) : (tc.careerId ? String(tc.careerId) : undefined)
    const title = found ? found.title : tc.name
    return { id, title }
  })
}

/**
 * Mejora el formato de la respuesta para mejor legibilidad
 */
function improveFormatting(text) {
  if (!text) return text;
  
  // 1. Asegurar espacio después del saludo inicial
  text = text.replace(/^(¡Hola!.*?\.)([^\n])/m, '$1\n\n$2');
  
  // 2. Agregar doble salto antes de cada carrera numerada
  text = text.replace(/([^\n])\n(\*\*\d+\.)/g, '$1\n\n$2');
  
  // 3. Agregar salto después del título de cada carrera
  text = text.replace(/(\*\*\d+\.\s+[^*]+\*\*)\n([^\n])/g, '$1\n$2');
  
  // 4. Asegurar doble salto después de la descripción breve (línea corta después del título)
  text = text.replace(/(\*\*\d+\.\s+[^*]+\*\*\n[^\n]+\n)([^\n💰])/g, '$1\n$2');
  
  // 5. Agregar doble salto después de las líneas con emoji de salario
  text = text.replace(/(💰\s*\*\*Salario:.*?\*\*Demanda:.*?\n)([^\n])/g, '$1\n$2');
  
  // 6. Asegurar doble salto antes del cierre final
  text = text.replace(/([^\n])\n(Todas estas carreras|Estas carreras|Cada una de|¿Qué te parece|¿Cuál de estas|¿Alguna de estas|¿Te gustaría)/gi, '$1\n\n$2');
  
  // 7. Asegurar doble salto antes de preguntas finales
  text = text.replace(/([^\n?])\n(¿[^¿]+\?[^?]*$)/g, '$1\n\n$2');
  
  // 8. Limpiar más de 3 saltos consecutivos (exceso)
  text = text.replace(/\n{4,}/g, '\n\n\n');
  
  return text;
}

/**
 * Convierte el texto markdown a HTML para mejor renderizado en frontend
 */
function convertToHtml(text) {
  if (!text) return '';
  
  let html = text;
  
  // Convertir saltos de línea dobles a párrafos
  html = html.split('\n\n').map(paragraph => {
    if (!paragraph.trim()) return '';
    
    // Convertir negritas **texto** a <strong>
    paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Envolver en párrafo
    return `<p>${paragraph}</p>`;
  }).join('\n');
  
  // Agregar clases CSS para mejor formato
  html = html.replace(/<p><strong>(\d+)\.\s+([^<]+)<\/strong>/g, 
    '<p class="career-title"><strong>$1. $2</strong>');
  
  html = html.replace(/💰/g, '<span class="emoji">💰</span>');
  html = html.replace(/📊/g, '<span class="emoji">📊</span>');
  html = html.replace(/🎮/g, '<span class="emoji">🎮</span>');
  html = html.replace(/💻/g, '<span class="emoji">💻</span>');
  html = html.replace(/🔐/g, '<span class="emoji">🔐</span>');
  html = html.replace(/🎨/g, '<span class="emoji">🎨</span>');
  
  return html;
}

module.exports = { askAssistant };
