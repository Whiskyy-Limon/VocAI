const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { authorize } = require('../middlewares/role')
const upload = require('../config/upload')
const {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/adminQuestionController')

const {
  listCareers,
  createCareer,
  updateCareer,
  deleteCareer,
  permanentlyDeleteCareer,
  uploadCareerFiles,
} = require('../controllers/adminCareerController')

const router = express.Router()

// Todos los endpoints admin requieren token válido + rol admin
router.use(authMiddleware, authorize('admin'))

// ── Preguntas ──
router.get('/questions',        listQuestions)
router.post('/questions',       createQuestion)
router.put('/questions/:id',    updateQuestion)
router.delete('/questions/:id', deleteQuestion)

// ── Carreras ──
router.get('/careers',        listCareers)
router.post('/careers',       createCareer)
router.put('/careers/:id',    updateCareer)
router.delete('/careers/:id', deleteCareer)
router.delete('/careers/:id/permanent', permanentlyDeleteCareer)

// ── Upload de archivos (pdf + image) ──
// multer acepta ambos campos opcionales en un solo request
router.post(
  '/careers/:id/upload',
  upload.fields([
    { name: 'pdf',   maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  uploadCareerFiles
)

module.exports = router
