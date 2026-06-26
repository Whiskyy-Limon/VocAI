const express = require('express')
const { getQuestions, submitTest, getHistory } = require('../controllers/testController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/questions', getQuestions)
router.post('/submit', authMiddleware, submitTest)
router.get('/history', authMiddleware, getHistory)

module.exports = router
