const express = require('express');
const authRequired = require('../middleware/authMiddleware');
const {
  createProfile,
  getMyLatestProfile,
  getMyHistory,
  getProfileById,
} = require('../controllers/profileController');

const router = express.Router();

router.use(authRequired); // todas protegidas

router.post('/', createProfile);          // POST /api/profiles
router.get('/me', getMyLatestProfile);    // GET /api/profiles/me (último)
router.get('/history', getMyHistory);     // GET /api/profiles/history (todos)
router.get('/:id', getProfileById);       // GET /api/profiles/:id (uno específico)

module.exports = router;
