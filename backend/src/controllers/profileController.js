// backend/src/controllers/profileController.js
const VocationalProfile = require('../models/VocationalProfile');
const mongoose = require('mongoose');

async function createProfile(req, res) {
  try {
    const { answers, areaScores, topCareers } = req.body;

    // Validaciones de entrada
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Las respuestas son obligatorias (array no vacío)' });
    }

    if (!areaScores || typeof areaScores !== 'object') {
      return res.status(400).json({ message: 'areaScores es obligatorio (objeto)' });
    }

    if (!Array.isArray(topCareers)) {
      return res.status(400).json({ message: 'topCareers debe ser un array' });
    }

    // Validar que todas las respuestas sean números entre 1 y 5
    if (!answers.every(a => typeof a === 'number' && a >= 1 && a <= 5)) {
      return res.status(400).json({ message: 'Todas las respuestas deben ser números entre 1 y 5' });
    }

    const profile = await VocationalProfile.create({
      user: req.userId,
      answers,
      areaScores,
      topCareers,
    });

    res.status(201).json(profile);
  } catch (err) {
    console.error('Error createProfile:', err);
    res.status(500).json({ message: 'Error al guardar el perfil vocacional' });
  }
}

// GET /api/profiles/me  (último perfil del usuario)
async function getMyLatestProfile(req, res) {
  try {
    const profile = await VocationalProfile.findOne({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate('user', 'email');

    if (!profile) {
      return res.status(404).json({ message: 'No hay perfil para este usuario aún' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Error getMyLatestProfile:', err);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
}

// GET /api/profiles/history (historial completo)
async function getMyHistory(req, res) {
  try {
    const profiles = await VocationalProfile.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'email');

    res.json(profiles);
  } catch (err) {
    console.error('Error getMyHistory:', err);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
}

// GET /api/profiles/:id (perfil específico del usuario)
async function getProfileById(req, res) {
  try {
    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const profile = await VocationalProfile.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate('user', 'email');

    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Error getProfileById:', err);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
}

module.exports = { createProfile, getMyLatestProfile, getMyHistory, getProfileById };
