/**
 * Seed de preguntas vocacionales para VocAI
 * Uso: node scripts/seedQuestions.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const Question = require('../src/models/Question')

const QUESTIONS = [
  // ── tecnología ──
  {
    text: '¿Disfrutas aprender sobre computadoras, redes o sistemas operativos?',
    category: 'tecnología',
    order: 1,
    options: [
      { label: 'Mucho, es mi mayor interés', score: 5 },
      { label: 'Algo, me llama la atención', score: 3 },
      { label: 'Poco, prefiero otras áreas', score: 1 },
      { label: 'Nada, no me interesa', score: 0 },
    ],
  },
  {
    text: '¿Cuándo algo falla en tu computadora o celular, intentas resolverlo tú mismo?',
    category: 'tecnología',
    order: 2,
    options: [
      { label: 'Siempre, me encanta resolverlo', score: 5 },
      { label: 'A veces intento antes de pedir ayuda', score: 3 },
      { label: 'Casi nunca, prefiero pedir ayuda', score: 1 },
      { label: 'Nunca, no me interesa', score: 0 },
    ],
  },

  // ── diseño ──
  {
    text: '¿Te gusta crear imágenes, ilustraciones, logos o contenido visual?',
    category: 'diseño',
    order: 3,
    options: [
      { label: 'Sí, disfruto mucho diseñar', score: 5 },
      { label: 'De vez en cuando', score: 3 },
      { label: 'No mucho', score: 1 },
      { label: 'No me llama la atención', score: 0 },
    ],
  },
  {
    text: '¿Has utilizado herramientas como Photoshop, Illustrator, Figma o similares?',
    category: 'diseño',
    order: 4,
    options: [
      { label: 'Sí, las uso regularmente', score: 5 },
      { label: 'Las he probado un poco', score: 3 },
      { label: 'Solo de nombre', score: 1 },
      { label: 'Nunca las he usado', score: 0 },
    ],
  },

  // ── análisis ──
  {
    text: '¿Te atrae analizar datos, estadísticas o gráficos para sacar conclusiones?',
    category: 'análisis',
    order: 5,
    options: [
      { label: 'Sí, me parece fascinante', score: 5 },
      { label: 'Me resulta interesante', score: 3 },
      { label: 'No es lo que más me gusta', score: 1 },
      { label: 'No me interesa', score: 0 },
    ],
  },
  {
    text: '¿Disfrutas resolver problemas matemáticos o lógicos?',
    category: 'análisis',
    order: 6,
    options: [
      { label: 'Sí, me encantan los retos lógicos', score: 5 },
      { label: 'Los resuelvo pero no es mi pasión', score: 3 },
      { label: 'Me cuestan bastante', score: 1 },
      { label: 'Los evito si puedo', score: 0 },
    ],
  },

  // ── innovación ──
  {
    text: '¿Te gustaría crear tu propia aplicación, videojuego o software algún día?',
    category: 'innovación',
    order: 7,
    options: [
      { label: 'Es uno de mis sueños', score: 5 },
      { label: 'Me parece interesante', score: 3 },
      { label: 'No lo he pensado mucho', score: 1 },
      { label: 'No me interesa', score: 0 },
    ],
  },
  {
    text: '¿Sueles proponer nuevas ideas o mejoras cuando trabajas en equipo?',
    category: 'innovación',
    order: 8,
    options: [
      { label: 'Siempre, me encanta innovar', score: 5 },
      { label: 'A veces lo hago', score: 3 },
      { label: 'Prefiero seguir las ideas del grupo', score: 1 },
      { label: 'Casi nunca propongo cosas nuevas', score: 0 },
    ],
  },

  // ── comunicación ──
  {
    text: '¿Te resulta fácil explicar temas complejos a otras personas?',
    category: 'comunicación',
    order: 9,
    options: [
      { label: 'Sí, me gusta mucho enseñar y explicar', score: 5 },
      { label: 'Lo hago cuando es necesario', score: 3 },
      { label: 'Me cuesta un poco', score: 1 },
      { label: 'Prefiero no hacerlo', score: 0 },
    ],
  },
  {
    text: '¿Disfrutas trabajar en equipo y coordinar proyectos con otros?',
    category: 'comunicación',
    order: 10,
    options: [
      { label: 'Sí, me encanta el trabajo en equipo', score: 5 },
      { label: 'Lo hago bien aunque prefiero trabajar solo a veces', score: 3 },
      { label: 'Me cuesta coordinarme con otros', score: 1 },
      { label: 'Prefiero trabajar solo', score: 0 },
    ],
  },

  // ── administración ──
  {
    text: '¿Te interesa gestionar proyectos, recursos o equipos de trabajo?',
    category: 'administración',
    order: 11,
    options: [
      { label: 'Sí, me gusta organizar y liderar', score: 5 },
      { label: 'Me parece interesante', score: 3 },
      { label: 'No es lo mío', score: 1 },
      { label: 'No me llama la atención', score: 0 },
    ],
  },
  {
    text: '¿Eres de las personas que planifican y organizan bien su tiempo?',
    category: 'administración',
    order: 12,
    options: [
      { label: 'Sí, soy muy organizado/a', score: 5 },
      { label: 'Intento serlo', score: 3 },
      { label: 'Me cuesta un poco', score: 1 },
      { label: 'No soy muy organizado/a', score: 0 },
    ],
  },

  // ── seguridad / análisis de riesgo ──
  {
    text: '¿Te preocupa la seguridad de tu información personal en internet?',
    category: 'tecnología',
    order: 13,
    options: [
      { label: 'Sí, me parece un tema muy importante', score: 5 },
      { label: 'Algo, pero no profundizo', score: 3 },
      { label: 'No lo había pensado mucho', score: 1 },
      { label: 'No me preocupa', score: 0 },
    ],
  },

  // ── videojuegos / simulación ──
  {
    text: '¿Juegas videojuegos y te interesa saber cómo fueron creados?',
    category: 'innovación',
    order: 14,
    options: [
      { label: 'Sí, me apasiona el desarrollo de juegos', score: 5 },
      { label: 'Me genera curiosidad', score: 3 },
      { label: 'Juego pero no me interesa crearlos', score: 1 },
      { label: 'No juego ni me interesa', score: 0 },
    ],
  },

  // ── datos y ciencia ──
  {
    text: '¿Te gustaría trabajar con grandes volúmenes de datos para descubrir patrones?',
    category: 'análisis',
    order: 15,
    options: [
      { label: 'Sí, me parece apasionante', score: 5 },
      { label: 'Me resulta interesante', score: 3 },
      { label: 'No del todo', score: 1 },
      { label: 'No me interesa', score: 0 },
    ],
  },
]

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌  MONGODB_URI no está definida en .env')
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'vocai_db' })
    console.log('✅  Conectado a MongoDB')

    const existing = await Question.countDocuments()
    if (existing > 0) {
      console.log(`ℹ️   Ya existen ${existing} preguntas. Ejecutando upsert por texto...`)
    }

    let created = 0
    let updated = 0

    for (const q of QUESTIONS) {
      const result = await Question.findOneAndUpdate(
        { text: q.text },
        { $set: q },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      if (result.createdAt?.getTime() === result.updatedAt?.getTime()) {
        created++
      } else {
        updated++
      }
    }

    console.log(`🌱  Seed completado: ${created} creadas, ${updated} actualizadas`)
    console.log(`📊  Total en DB: ${await Question.countDocuments()} preguntas`)
    process.exit(0)
  } catch (err) {
    console.error('❌  Error en seed:', err.message)
    process.exit(1)
  }
}

seed()
