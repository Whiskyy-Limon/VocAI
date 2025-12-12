// backend/src/controllers/careerController.js
const Career = require('../models/Career');

// GET /api/careers
const getCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ title: 1 });
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
    await Career.deleteMany({});

    const careers = [
      {
        title: 'Diseño y Desarrollo de Software',
        codigo: 'DDS',
        department: 'Tecnología Digital',
        sede: 'Lima',
        duration: '3 años',
        field: 'Desarrollo de software y aplicaciones',
        salary: 3200,
        demand: 'Muy Alta',
        description:
          'Convierte ideas en aplicaciones web y móviles robustas, seguras y escalables.',
        longDescription:
          'La carrera de Diseño y Desarrollo de Software te prepara para convertir ideas en aplicaciones web y móviles robustas, seguras y escalables. Diseñarás interfaces intuitivas centradas en el usuario, implementarás soluciones usando tecnologías modernas y aplicarás buenas prácticas de arquitectura y pruebas. Al egresar podrás participar en todo el ciclo de vida del software, desde el análisis de requerimientos hasta el despliegue en la nube.',
        areas: ['Programación', 'Aplicaciones web', 'Aplicaciones móviles'],
      },
      {
        title: 'Administración de Redes y Comunicaciones',
        codigo: 'ARC',
        department: 'Tecnología Digital',
        sede: 'Lima',
        duration: '3 años',
        field: 'Redes de datos e infraestructura de comunicaciones',
        salary: 3000,
        demand: 'Alta',
        description:
          'Gestiona redes, servicios de conectividad y seguridad en la infraestructura de comunicaciones.',
        longDescription:
          'La carrera de Administración de Redes y Comunicaciones te forma en el diseño, implementación y gestión de redes de datos y servicios de comunicación. Desarrollarás competencias para configurar equipos de red, administrar servicios de conectividad, monitorear el rendimiento y aplicar políticas de seguridad. Además, conocerás tecnologías relacionadas con virtualización, cloud computing e Internet de las Cosas para responder a las necesidades actuales de infraestructura.',
        areas: ['Redes', 'Seguridad', 'Cloud'],
      },
      {
        title: 'Diseño y Desarrollo de Simuladores y Videojuegos',
        codigo: 'DSV',
        department: 'Tecnología Digital',
        sede: 'Lima',
        duration: '3 años',
        field: 'Simuladores interactivos y videojuegos',
        salary: 2800,
        demand: 'Alta',
        description:
          'Diseña y desarrolla simuladores interactivos y videojuegos para distintas plataformas.',
        longDescription:
          'Esta carrera se orienta al diseño y desarrollo de simuladores interactivos y videojuegos para distintas plataformas. Aprenderás a combinar mecánicas de juego, narrativa, arte digital y programación para crear experiencias inmersivas. Trabajarás con motores de videojuegos, realidad virtual y aumentada, y técnicas de diseño de niveles, preparándote para participar en estudios de desarrollo y proyectos de entretenimiento digital.',
        areas: ['Videojuegos', 'Simuladores', 'Realidad virtual'],
      },
      {
        title: 'Modelado y Animación Digital',
        codigo: 'MAD',
        department: 'Tecnología Digital',
        sede: 'Lima',
        duration: '3 años',
        field: 'Modelado 3D, animación y contenidos digitales',
        salary: 2600,
        demand: 'Media',
        description:
          'Crea recursos visuales y artísticos para la industria creativa mediante modelado y animación 3D.',
        longDescription:
          'La carrera de Modelado y Animación Digital te forma en la creación de recursos visuales y artísticos para la industria creativa. Desarrollarás habilidades en modelado 3D, animación, texturizado y composición para producir contenidos para cine, videojuegos, simuladores y experiencias interactivas. Aprenderás a trabajar con herramientas especializadas y flujos de producción que responden a las tendencias actuales del mercado digital.',
        areas: ['Modelado 3D', 'Animación', 'Arte digital'],
      },
      {
        title: 'Ciberseguridad y Auditoría Informática',
        codigo: 'CAI',
        department: 'Tecnología Digital',
        sede: 'Lima',
        duration: '3 años',
        field: 'Seguridad de la información y auditoría de sistemas',
        salary: 3000,
        demand: 'Muy Alta',
        description:
          'Protege sistemas, redes y datos frente a ciberataques y realiza auditorías de seguridad.',
        longDescription:
          'Esta carrera desarrolla competencias para proteger sistemas informáticos, redes y datos frente a ciberataques. Trabajarás con marcos de referencia y buenas prácticas de la industria para diseñar controles de seguridad, monitorear incidentes, realizar pruebas de vulnerabilidades y ejecutar auditorías de seguridad de la información. Estarás preparado para responder ante amenazas y apoyar la continuidad operativa de las organizaciones.',
        areas: ['Seguridad', 'Auditoría', 'Gestión de riesgos'],
      },
      {
        title: 'Big Data y Ciencia de Datos',
        codigo: 'BDC',
        department: 'Tecnología Digital',
        sede: 'Lima',
        duration: '3 años',
        field: 'Análisis de datos y machine learning',
        salary: 3500,
        demand: 'Muy Alta',
        description:
          'Analiza grandes volúmenes de información para apoyar la toma de decisiones basada en datos.',
        longDescription:
          'La carrera de Big Data y Ciencia de Datos te especializa en el análisis y aprovechamiento de grandes volúmenes de información. Aprenderás a recolectar, limpiar y transformar datos, aplicar técnicas estadísticas y de aprendizaje automático, y comunicar hallazgos mediante visualizaciones efectivas. Podrás apoyar la toma de decisiones basada en datos en organizaciones que necesitan entender mejor su información para generar valor.',
        areas: ['Big Data', 'Ciencia de datos', 'Machine learning'],
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
