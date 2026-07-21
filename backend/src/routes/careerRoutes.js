// backend/src/routes/careerRoutes.js
const express = require('express');
const {
  getCareers,
  getCareerById,
  getCareerRanking,
  seedCareers,
} = require('../controllers/careerController');

const router = express.Router();

// Lista todas las carreras
router.get('/', getCareers);          // GET /api/careers

// Inserta las carreras iniciales en MongoDB (se usa una sola vez)
router.get('/seed', seedCareers);     // GET /api/careers/seed

// Ranking de carreras más elegidas por los usuarios
router.get('/ranking', getCareerRanking); // GET /api/careers/ranking

// Una carrera por id
router.get('/:id', getCareerById);    // GET /api/careers/:id

module.exports = router;
