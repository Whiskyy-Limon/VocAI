const Result = require('../models/Result')
const { ok, fail } = require('../utils/response')
const testService = require('../services/test.service')

async function getQuestions(req, res) {
  try {
    const questions = await testService.getActiveQuestions()
    return ok(res, questions, 'Preguntas obtenidas')
  } catch (err) {
    return fail(res, 'Error al obtener preguntas', 500, 'TEST_QUESTIONS_ERROR')
  }
}

async function submitTest(req, res) {
  try {
    const { answers } = req.body || {}

    if (!Array.isArray(answers) || answers.length === 0) {
      return fail(res, 'Respuestas invalidas', 400, 'TEST_ANSWERS_REQUIRED')
    }

    const payload = await testService.submitTest({
      userId: req.userId,
      answers,
    })

    const result = await Result.create(payload)

    return ok(res, result, 'Resultado registrado', 201)
  } catch (err) {
    const status = err.status || 500
    const code = err.code || 'TEST_SUBMIT_ERROR'
    const message = status === 400 ? err.message : 'Error al registrar resultado'
    return fail(res, message, status, code)
  }
}

async function getHistory(req, res) {
  try {
    const results = await Result.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean()

    return ok(res, results, 'Historial obtenido')
  } catch (err) {
    return fail(res, 'Error al obtener historial', 500, 'TEST_HISTORY_ERROR')
  }
}

module.exports = {
  getQuestions,
  submitTest,
  getHistory,
}
