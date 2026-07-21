const express = require('express');
const authRequired = require('../middleware/authMiddleware');
const {
  createProfile,
  getMyLatestProfile,
  getMyHistory,
  getProfileById,
  chooseCareer,
  getMyChoice,
} = require('../controllers/profileController');

const router = express.Router();

router.use(authRequired); // todas protegidas

router.post('/', createProfile);          // POST /api/profiles
router.get('/me', getMyLatestProfile);    // GET /api/profiles/me (último)
router.get('/history', getMyHistory);     // GET /api/profiles/history (todos)
router.put('/choice', chooseCareer);      // PUT /api/profiles/choice — elegir carrera
router.get('/choice', getMyChoice);       // GET /api/profiles/choice — carrera elegida
router.get('/:id', getProfileById);       // GET /api/profiles/:id (uno específico)

module.exports = router;
