// Script para poblar la base de datos con carreras de TECSUP
const mongoose = require('mongoose');
require('dotenv').config();

const Career = require('../src/models/Career');

const careers = [
  {
    title: 'Diseño y Desarrollo de Simuladores y Videojuegos',
    codigo: 'DDSV',
    description: 'Aprende a crear videojuegos y simuladores profesionales usando Unity, Unreal Engine y tecnologías de realidad virtual.',
    salary: 3500,
    demand: 'Alta',
    duration: '3 años',
    department: 'Tecnología Digital',
    sede: 'Lima'
  },
  {
    title: 'Diseño y Desarrollo de Software',
    codigo: 'DDS',
    description: 'Conviértete en desarrollador full-stack. Aprende frameworks modernos, arquitectura de software y metodologías ágiles.',
    salary: 4200,
    demand: 'Muy Alta',
    duration: '3 años',
    department: 'Tecnología Digital',
    sede: 'Lima'
  },
  {
    title: 'Big Data y Ciencia de Datos',
    codigo: 'BDCD',
    description: 'Domina el análisis de datos masivos, machine learning y visualización de datos con Python, R y herramientas cloud.',
    salary: 5000,
    demand: 'Muy Alta',
    duration: '3 años',
    department: 'Tecnología Digital',
    sede: 'Lima'
  },
  {
    title: 'Administración de Redes y Comunicaciones',
    codigo: 'ARC',
    description: 'Especialízate en infraestructura de redes, ciberseguridad y administración de servidores corporativos.',
    salary: 3800,
    demand: 'Alta',
    duration: '3 años',
    department: 'Tecnología Digital',
    sede: 'Lima'
  },
  {
    title: 'Administración y Sistemas',
    codigo: 'AS',
    description: 'Gestiona sistemas empresariales, ERP, infraestructura TI y proyectos de transformación digital.',
    salary: 3200,
    demand: 'Media',
    duration: '3 años',
    department: 'Tecnología Digital',
    sede: 'Lima'
  },
  {
    title: 'Diseño Gráfico Digital',
    codigo: 'DGD',
    description: 'Crea contenido visual profesional: branding, UI/UX, motion graphics y diseño publicitario digital.',
    salary: 3000,
    demand: 'Alta',
    duration: '3 años',
    department: 'Tecnología Digital',
    sede: 'Lima'
  }
];

async function seedCareers() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Limpiar carreras existentes
    console.log('Limpiando carreras existentes...');
    await Career.deleteMany({ department: 'Tecnología Digital', sede: 'Lima' });
    console.log('✅ Carreras anteriores eliminadas\n');

    // Insertar nuevas carreras
    console.log('Insertando carreras...');
    const result = await Career.insertMany(careers);
    console.log(`✅ ${result.length} carreras insertadas exitosamente!\n`);

    // Mostrar carreras creadas
    console.log('Carreras creadas:');
    result.forEach((career, idx) => {
      console.log(`${idx + 1}. ${career.title} (${career.codigo})`);
      console.log(`   Salario: S/ ${career.salary} | Demanda: ${career.demand} | Duración: ${career.duration}`);
    });

    console.log('\n=== BASE DE DATOS POBLADA EXITOSAMENTE ===');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedCareers();
