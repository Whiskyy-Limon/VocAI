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
    salaryText: { type: String },
    demand: { type: String },

    areas: [{ type: String }],

    // Perfil del egresado
    graduateProfile: { type: String, trim: true },

    // Campo laboral (alias semántico de field, field se conserva)
    workField: { type: String, trim: true },

    // Malla curricular resumida
    curriculum: { type: String, trim: true },

    // Recursos multimedia
    pdfUrl:   { type: String, trim: true },
    imageUrl: { type: String, trim: true },

    // Intereses relacionados (para matching con el test)
    interests: [{ type: String }],

    // Opcionales (para futuro)
    competencies: [{ type: String }],
    skills: [{ type: String }],

    // Soft-delete: false = eliminado lógicamente
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
