const express = require('express');
const { register, login, forgotPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);        // POST /api/auth/register
router.post('/login', login);              // POST /api/auth/login
router.post('/forgot', forgotPassword);    // POST /api/auth/forgot

module.exports = router;
