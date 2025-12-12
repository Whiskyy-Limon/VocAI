// backend/src/routes/careerRoutes.js
const express = require('express');
const {
  getCareers,
  getCareerById,
  seedCareers,
} = require('../controllers/careerController');

const router = express.Router();

// Lista todas las carreras
router.get('/', getCareers);          // GET /api/careers

// Inserta las carreras iniciales en MongoDB (se usa una sola vez)
router.get('/seed', seedCareers);     // GET /api/careers/seed

// Una carrera por id
router.get('/:id', getCareerById);    // GET /api/careers/:id

module.exports = router;
