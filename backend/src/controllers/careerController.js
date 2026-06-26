// backend/src/controllers/careerController.js
const Career = require('../models/Career');

// GET /api/careers
const getCareers = async (req, res) => {
  try {
    const careers = await Career.find({ active: { $ne: false } }).sort({ title: 1 });
    res.json(careers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error obteniendo carreras' });
  }
};

// GET /api/careers/:id
const getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res
        .status(404)
        .json({ ok: false, message: 'Carrera no encontrada' });
    }
    res.json(career);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error obteniendo carrera' });
  }
};

// GET /api/careers/seed  (usar solo para cargar datos iniciales)
const seedCareers = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ ok: false, message: 'Seed deshabilitado fuera de desarrollo' });
    }

    await Career.deleteMany({});

    const careers = [
      {
        title: 'Modelado y Animación Digital',
        codigo: 'MAD',
        department: 'Tecnología Digital',
        sede: 'Lima / Santa Anita',
        duration: '2 años',
        field: 'Modelado 3D, texturizado, animación y recursos visuales para entretenimiento, cine, videojuegos y publicidad.',
        salaryText: 'Desde S/ 1,200 a S/ 1,500 (junior)',
        description: 'Formación enfocada en creación de personajes, escenarios y animaciones 3D para industria creativa.',
        longDescription: 'Formación orientada a modelado, texturizado y animación 3D con un enfoque aplicado a proyectos de entretenimiento, publicidad y medios digitales. Se desarrolla la capacidad de crear personajes, entornos y efectos visuales para productos audiovisuales y experiencias interactivas.',
        skills: ['Modelado 3D', 'Texturizado', 'Animación', 'Renderizado', 'Narrativa visual'],
      },
      {
        title: 'Ciberseguridad y Auditoría Informática',
        codigo: 'CAI',
        department: 'Tecnología Digital',
        sede: 'Lima / Santa Anita',
        duration: '3 años',
        field: 'Protección de sistemas, redes y datos, auditoría informática, seguridad y análisis de riesgos.',
        salaryText: 'Aprox. S/ 2,500 a S/ 3,000',
        description: 'Formación en seguridad de la información, auditoría, respuesta a incidentes y control de riesgos.',
        longDescription: 'Se enfoca en la protección de infraestructura tecnológica, auditorías de seguridad y análisis de riesgos. Incluye la implementación de controles, monitoreo, evaluación de vulnerabilidades y respuesta a incidentes en entornos empresariales.',
        skills: ['Seguridad de redes', 'Auditoría', 'Análisis de riesgos', 'Pentesting básico', 'Respuesta a incidentes'],
      },
      {
        title: 'Diseño y Desarrollo de Software',
        codigo: 'DDS',
        department: 'Tecnología Digital',
        sede: 'Lima / Santa Anita',
        duration: '3 años',
        field: 'Desarrollo web, móvil, cloud, interfaces, sistemas y soluciones de software.',
        salaryText: 'Aprox. S/ 1,700 a S/ 2,500',
        description: 'Formación en programación, arquitectura y despliegue de software moderno.',
        longDescription: 'Desarrollo de soluciones digitales que abarcan aplicaciones web y móviles, servicios en la nube y arquitectura de software. Se trabaja con prácticas modernas de desarrollo, diseño de interfaces y pruebas de calidad.',
        skills: ['Desarrollo web', 'Desarrollo móvil', 'APIs', 'Bases de datos', 'Cloud'],
      },
      {
        title: 'Diseño y Desarrollo de Simuladores y Videojuegos',
        codigo: 'DSV',
        department: 'Tecnología Digital',
        sede: 'Lima / Santa Anita',
        duration: '3 años',
        field: 'Desarrollo de videojuegos y simuladores, realidad virtual y aumentada para Android, iOS, web, PC y consolas.',
        salaryText: 'Aprox. S/ 2,700 en adelante',
        description: 'Formación en motores de juego, diseño de niveles y experiencias inmersivas.',
        longDescription: 'Se centra en la creación de videojuegos y simuladores interactivos utilizando motores modernos, realidad virtual y aumentada. Incluye diseño de niveles, programación y experiencia de usuario en múltiples plataformas.',
        skills: ['Unity/Unreal', 'Programación de juegos', 'UX interactiva', 'Realidad virtual', 'Realidad aumentada'],
      },
      {
        title: 'Administración de Redes y Comunicaciones',
        codigo: 'ARC',
        department: 'Tecnología Digital',
        sede: 'Lima / Santa Anita',
        duration: '3 años',
        field: 'Redes, telecomunicaciones, cloud computing, servicios de voz, comunicaciones inalámbricas e IoT.',
        salaryText: 'Aprox. S/ 1,600 a S/ 2,000',
        description: 'Formación en diseño, implementación y gestión de redes y comunicaciones modernas.',
        longDescription: 'Especialización en infraestructura de comunicaciones, redes de datos, servicios de voz, cloud computing y soluciones IoT. Incluye administración, seguridad y monitoreo de servicios críticos.',
        skills: ['Redes', 'Cloud', 'IoT', 'Seguridad', 'Comunicaciones inalámbricas'],
      },
      {
        title: 'Big Data y Ciencia de Datos',
        codigo: 'BDC',
        department: 'Tecnología Digital',
        sede: 'Lima / Santa Anita',
        duration: '3 años',
        field: 'Análisis de datos, machine learning, minería de datos, visualización y toma de decisiones.',
        salaryText: 'Aprox. S/ 3,000 a S/ 3,600',
        description: 'Formación en análisis, modelado predictivo y visualización de grandes volúmenes de datos.',
        longDescription: 'Se desarrolla capacidad para recolectar, limpiar, analizar y visualizar grandes conjuntos de datos. Incluye fundamentos de machine learning, minería de datos y soporte a decisiones basadas en evidencia.',
        skills: ['Analítica', 'Machine learning', 'SQL/NoSQL', 'Visualización', 'ETL'],
      },
    ];

    await Career.insertMany(careers);

    res.json({ ok: true, message: 'Careers seeded', count: careers.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error seeding careers' });
  }
};

module.exports = {
  getCareers,
  getCareerById,
  seedCareers,
};
