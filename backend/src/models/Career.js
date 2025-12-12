// backend/src/models/Career.js
const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    // NUEVO: descripción larga para la pantalla de detalle
    longDescription: { type: String, trim: true },

    codigo: { type: String, required: true },

    // Departamento / sede
    department: { type: String, required: true, default: 'Tecnología Digital' },
    sede: { type: String, required: true, default: 'Lima' },

    duration: { type: String },

    // Campo laboral / área
    field: { type: String },

    // Datos para el comparador / catálogo
    salary: { type: Number },
    demand: { type: String },

    areas: [{ type: String }],

    // Opcionales (para futuro)
    competencies: [{ type: String }],
    skills: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
