/**
 * Seed de carreras para VocAI — TECSUP
 * Uso: node scripts/seedCareers.js
 * Estrategia: upsert por `codigo` — seguro para ejecutar múltiples veces.
 * No borra carreras existentes.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const Career = require('../src/models/Career')

const CAREERS = [
  {
    codigo: 'DDS',
    title: 'Diseño y Desarrollo de Software',
    department: 'Tecnología Digital',
    sede: 'Lima / Santa Anita',
    duration: '3 años',
    description: 'Formación en programación, arquitectura y despliegue de software moderno.',
    longDescription: 'Desarrollo de soluciones digitales que abarcan aplicaciones web y móviles, servicios en la nube y arquitectura de software. Se trabaja con prácticas modernas de desarrollo, diseño de interfaces y pruebas de calidad.',
    graduateProfile: 'Egresado capaz de diseñar, desarrollar y desplegar sistemas de software usando metodologías ágiles. Domina lenguajes de programación modernos, frameworks web, bases de datos relacionales y no relacionales, y servicios en la nube.',
    field: 'Desarrollo web, móvil, cloud, interfaces, sistemas y soluciones de software.',
    workField: 'Desarrollo web, móvil, cloud, interfaces, sistemas y soluciones de software.',
    curriculum: 'Fundamentos de programación → Estructuras de datos → POO → Bases de datos → Desarrollo web → Desarrollo móvil → Cloud computing → Seguridad en software → Proyecto integrador.',
    salaryText: 'Aprox. S/ 1,700 a S/ 2,500',
    salary: 2000,
    demand: 'Alta',
    areas: ['software', 'web', 'móvil', 'cloud', 'tecnología'],
    skills: ['Desarrollo web', 'Desarrollo móvil', 'APIs REST', 'Bases de datos', 'Cloud', 'Git', 'Metodologías ágiles'],
    interests: ['programación', 'tecnología', 'innovación', 'resolución de problemas', 'crear aplicaciones'],
    competencies: ['Diseño de software', 'Gestión de proyectos ágiles', 'Trabajo en equipo', 'Pensamiento lógico'],
    active: true,
  },
  {
    codigo: 'ARC',
    title: 'Administración de Redes y Comunicaciones',
    department: 'Tecnología Digital',
    sede: 'Lima / Santa Anita',
    duration: '3 años',
    description: 'Formación en diseño, implementación y gestión de redes y comunicaciones modernas.',
    longDescription: 'Especialización en infraestructura de comunicaciones, redes de datos, servicios de voz, cloud computing y soluciones IoT. Incluye administración, seguridad y monitoreo de servicios críticos.',
    graduateProfile: 'Técnico especializado en el diseño e implementación de redes LAN/WAN, administración de servidores, seguridad perimetral y soluciones de comunicación unificada. Trabaja con equipos Cisco, MikroTik y plataformas cloud.',
    field: 'Redes, telecomunicaciones, cloud computing, servicios de voz, comunicaciones inalámbricas e IoT.',
    workField: 'Redes, telecomunicaciones, cloud computing, servicios de voz, comunicaciones inalámbricas e IoT.',
    curriculum: 'Fundamentos de redes → TCP/IP → Routing y Switching → Seguridad de redes → Wireless → VoIP → Cloud networking → IoT → Proyecto integrador.',
    salaryText: 'Aprox. S/ 1,600 a S/ 2,000',
    salary: 1800,
    demand: 'Alta',
    areas: ['redes', 'telecomunicaciones', 'cloud', 'seguridad', 'tecnología'],
    skills: ['Redes LAN/WAN', 'Routing y Switching', 'Cloud', 'IoT', 'Seguridad de redes', 'Comunicaciones inalámbricas', 'VoIP'],
    interests: ['tecnología', 'infraestructura', 'comunicaciones', 'seguridad', 'sistemas'],
    competencies: ['Administración de servidores', 'Configuración de equipos de red', 'Monitoreo de infraestructura'],
    active: true,
  },
  {
    codigo: 'BDC',
    title: 'Big Data y Ciencia de Datos',
    department: 'Tecnología Digital',
    sede: 'Lima / Santa Anita',
    duration: '3 años',
    description: 'Formación en análisis, modelado predictivo y visualización de grandes volúmenes de datos.',
    longDescription: 'Se desarrolla capacidad para recolectar, limpiar, analizar y visualizar grandes conjuntos de datos. Incluye fundamentos de machine learning, minería de datos y soporte a decisiones basadas en evidencia.',
    graduateProfile: 'Especialista capaz de extraer valor de grandes volúmenes de datos usando herramientas de análisis estadístico, machine learning y visualización. Trabaja con Python, R, SQL, Spark y plataformas cloud de datos.',
    field: 'Análisis de datos, machine learning, minería de datos, visualización y toma de decisiones.',
    workField: 'Análisis de datos, machine learning, minería de datos, visualización y toma de decisiones.',
    curriculum: 'Estadística → Python para datos → SQL/NoSQL → Visualización → Machine Learning → Big Data (Hadoop/Spark) → Inteligencia de negocios → Proyecto integrador.',
    salaryText: 'Aprox. S/ 3,000 a S/ 3,600',
    salary: 3300,
    demand: 'Muy alta',
    areas: ['datos', 'análisis', 'tecnología', 'inteligencia artificial', 'machine learning'],
    skills: ['Python', 'SQL/NoSQL', 'Machine Learning', 'Visualización de datos', 'ETL', 'Hadoop/Spark', 'Estadística'],
    interests: ['análisis', 'matemáticas', 'tecnología', 'resolución de problemas', 'inteligencia artificial'],
    competencies: ['Análisis estadístico', 'Modelado predictivo', 'Comunicación de resultados', 'Pensamiento analítico'],
    active: true,
  },
  {
    codigo: 'CAI',
    title: 'Ciberseguridad y Auditoría Informática',
    department: 'Tecnología Digital',
    sede: 'Lima / Santa Anita',
    duration: '3 años',
    description: 'Formación en seguridad de la información, auditoría, respuesta a incidentes y control de riesgos.',
    longDescription: 'Se enfoca en la protección de infraestructura tecnológica, auditorías de seguridad y análisis de riesgos. Incluye la implementación de controles, monitoreo, evaluación de vulnerabilidades y respuesta a incidentes en entornos empresariales.',
    graduateProfile: 'Especialista en seguridad que diseña, implementa y evalúa controles de seguridad informática. Realiza auditorías, pruebas de penetración básicas y gestiona respuestas ante incidentes de seguridad.',
    field: 'Protección de sistemas, redes y datos, auditoría informática, seguridad y análisis de riesgos.',
    workField: 'Protección de sistemas, redes y datos, auditoría informática, seguridad y análisis de riesgos.',
    curriculum: 'Fundamentos de seguridad → Criptografía → Seguridad de redes → Hacking ético → Auditoría ISO 27001 → Respuesta a incidentes → Forense digital → Proyecto integrador.',
    salaryText: 'Aprox. S/ 2,500 a S/ 3,000',
    salary: 2750,
    demand: 'Muy alta',
    areas: ['seguridad', 'tecnología', 'auditoría', 'análisis', 'redes'],
    skills: ['Seguridad de redes', 'Auditoría', 'Análisis de riesgos', 'Hacking ético', 'Respuesta a incidentes', 'Criptografía', 'ISO 27001'],
    interests: ['seguridad', 'tecnología', 'análisis', 'investigación', 'protección de datos'],
    competencies: ['Evaluación de vulnerabilidades', 'Gestión de riesgos', 'Pensamiento crítico', 'Ética profesional'],
    active: true,
  },
  {
    codigo: 'DSV',
    title: 'Diseño y Desarrollo de Simuladores y Videojuegos',
    department: 'Tecnología Digital',
    sede: 'Lima / Santa Anita',
    duration: '3 años',
    description: 'Formación en motores de juego, diseño de niveles y experiencias inmersivas.',
    longDescription: 'Se centra en la creación de videojuegos y simuladores interactivos utilizando motores modernos, realidad virtual y aumentada. Incluye diseño de niveles, programación y experiencia de usuario en múltiples plataformas.',
    graduateProfile: 'Desarrollador de videojuegos y simuladores con dominio de motores como Unity y Unreal Engine. Diseña mecánicas, niveles e interfaces para plataformas móviles, PC, consolas y experiencias de realidad virtual.',
    field: 'Desarrollo de videojuegos y simuladores, realidad virtual y aumentada para Android, iOS, web, PC y consolas.',
    workField: 'Desarrollo de videojuegos y simuladores, realidad virtual y aumentada para Android, iOS, web, PC y consolas.',
    curriculum: 'Programación orientada a objetos → Matemáticas para juegos → Unity/Unreal → Diseño de niveles → Física de juegos → Realidad virtual → Realidad aumentada → Proyecto integrador.',
    salaryText: 'Aprox. S/ 2,700 en adelante',
    salary: 2700,
    demand: 'Alta',
    areas: ['videojuegos', 'simuladores', 'realidad virtual', 'diseño', 'innovación'],
    skills: ['Unity', 'Unreal Engine', 'Programación C#/C++', 'Diseño de niveles', 'UX interactiva', 'Realidad virtual', 'Realidad aumentada'],
    interests: ['videojuegos', 'diseño', 'creatividad', 'innovación', 'tecnología', 'animación'],
    competencies: ['Diseño de experiencias interactivas', 'Programación de gameplay', 'Creatividad', 'Trabajo multidisciplinario'],
    active: true,
  },
  {
    codigo: 'MAD',
    title: 'Modelado y Animación Digital',
    department: 'Tecnología Digital',
    sede: 'Lima / Santa Anita',
    duration: '2 años',
    description: 'Formación enfocada en creación de personajes, escenarios y animaciones 3D para industria creativa.',
    longDescription: 'Formación orientada a modelado, texturizado y animación 3D con un enfoque aplicado a proyectos de entretenimiento, publicidad y medios digitales. Se desarrolla la capacidad de crear personajes, entornos y efectos visuales para productos audiovisuales y experiencias interactivas.',
    graduateProfile: 'Artista digital 3D capaz de modelar, texturizar y animar personajes y escenarios para cine, publicidad, videojuegos y medios digitales. Domina herramientas como Blender, Maya y ZBrush.',
    field: 'Modelado 3D, texturizado, animación y recursos visuales para entretenimiento, cine, videojuegos y publicidad.',
    workField: 'Modelado 3D, texturizado, animación y recursos visuales para entretenimiento, cine, videojuegos y publicidad.',
    curriculum: 'Fundamentos de diseño → Modelado 3D básico → Texturizado → Rigging → Animación 3D → Renderizado → VFX → Proyecto integrador.',
    salaryText: 'Desde S/ 1,200 a S/ 1,500 (junior)',
    salary: 1350,
    demand: 'Media',
    areas: ['diseño', 'animación', '3D', 'creatividad', 'arte digital'],
    skills: ['Modelado 3D', 'Texturizado', 'Animación', 'Renderizado', 'Narrativa visual', 'Blender', 'Maya'],
    interests: ['diseño', 'arte', 'creatividad', 'animación', 'videojuegos', 'cine'],
    competencies: ['Sentido artístico', 'Atención al detalle', 'Creatividad', 'Manejo de software 3D'],
    active: true,
  },
]

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌  MONGODB_URI no está definida en .env')
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'vocai_db' })
    console.log('✅  Conectado a MongoDB\n')

    let created = 0
    let updated = 0

    for (const data of CAREERS) {
      const before = await Career.findOne({ codigo: data.codigo }).lean()
      await Career.findOneAndUpdate(
        { codigo: data.codigo },
        { $set: data },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      if (before) {
        updated++
        console.log(`  ↺  Actualizada: ${data.title}`)
      } else {
        created++
        console.log(`  ✦  Creada:      ${data.title}`)
      }
    }

    const total = await Career.countDocuments({ active: { $ne: false } })
    console.log(`\n🌱  Seed completado: ${created} creadas, ${updated} actualizadas`)
    console.log(`📊  Total activas en DB: ${total} carreras`)
    process.exit(0)
  } catch (err) {
    console.error('❌  Error en seed:', err.message)
    process.exit(1)
  }
}

seed()
