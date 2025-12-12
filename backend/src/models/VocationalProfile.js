// backend/src/models/VocationalProfile.js
const mongoose = require('mongoose');

const topCareerSchema = new mongoose.Schema(
  {
    careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
    name: String,
    affinity: Number, // porcentaje
  },
  { _id: false }
);

const vocationalProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{ type: Number, required: true }], // tus respuestas 1–5
    areaScores: { type: Map, of: Number }, // { TI: 80, Economia: 60, ... }
    topCareers: [topCareerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('VocationalProfile', vocationalProfileSchema);
