const Question = require('../models/Question')
const { ok, fail } = require('../utils/response')

async function listQuestions(req, res) {
  try {
    const questions = await Question.find().sort({ order: 1, createdAt: 1 }).lean()
    return ok(res, questions, 'Preguntas obtenidas')
  } catch (err) {
    return fail(res, 'Error al obtener preguntas', 500, 'ADMIN_Q_LIST_ERROR')
  }
}

async function createQuestion(req, res) {
  try {
    const { text, category, options, active, order } = req.body

    if (!text || !text.trim())
      return fail(res, 'El campo text es requerido', 400, 'ADMIN_Q_TEXT_REQUIRED')
    if (!category || !category.trim())
      return fail(res, 'El campo category es requerido', 400, 'ADMIN_Q_CATEGORY_REQUIRED')
    if (!Array.isArray(options) || options.length < 2)
      return fail(res, 'Se requieren al menos 2 opciones', 400, 'ADMIN_Q_OPTIONS_REQUIRED')

    for (const opt of options) {
      if (!opt.label || !opt.label.trim())
        return fail(res, 'Cada opción debe tener un label', 400, 'ADMIN_Q_OPTION_LABEL')
      if (typeof opt.score !== 'number')
        return fail(res, 'Cada opción debe tener un score numérico', 400, 'ADMIN_Q_OPTION_SCORE')
    }

    const question = await Question.create({
      text: text.trim(),
      category: category.trim().toLowerCase(),
      options,
      active: active !== undefined ? Boolean(active) : true,
      order: order ?? 0,
    })

    return ok(res, question, 'Pregunta creada', 201)
  } catch (err) {
    return fail(res, 'Error al crear pregunta', 500, 'ADMIN_Q_CREATE_ERROR')
  }
}

async function updateQuestion(req, res) {
  try {
    const { id } = req.params
    const { text, category, options, active, order } = req.body

    const question = await Question.findById(id)
    if (!question)
      return fail(res, 'Pregunta no encontrada', 404, 'ADMIN_Q_NOT_FOUND')

    if (text !== undefined) {
      if (!text.trim()) return fail(res, 'El campo text no puede estar vacío', 400, 'ADMIN_Q_TEXT_EMPTY')
      question.text = text.trim()
    }
    if (category !== undefined) {
      if (!category.trim()) return fail(res, 'El campo category no puede estar vacío', 400, 'ADMIN_Q_CATEGORY_EMPTY')
      question.category = category.trim().toLowerCase()
    }
    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2)
        return fail(res, 'Se requieren al menos 2 opciones', 400, 'ADMIN_Q_OPTIONS_REQUIRED')
      for (const opt of options) {
        if (!opt.label || !opt.label.trim())
          return fail(res, 'Cada opción debe tener un label', 400, 'ADMIN_Q_OPTION_LABEL')
        if (typeof opt.score !== 'number')
          return fail(res, 'Cada opción debe tener un score numérico', 400, 'ADMIN_Q_OPTION_SCORE')
      }
      question.options = options
    }
    if (active !== undefined) question.active = Boolean(active)
    if (order !== undefined) question.order = order

    await question.save()
    return ok(res, question, 'Pregunta actualizada')
  } catch (err) {
    return fail(res, 'Error al actualizar pregunta', 500, 'ADMIN_Q_UPDATE_ERROR')
  }
}

async function deleteQuestion(req, res) {
  try {
    const { id } = req.params
    const question = await Question.findByIdAndDelete(id)
    if (!question)
      return fail(res, 'Pregunta no encontrada', 404, 'ADMIN_Q_NOT_FOUND')
    return ok(res, { id }, 'Pregunta eliminada')
  } catch (err) {
    return fail(res, 'Error al eliminar pregunta', 500, 'ADMIN_Q_DELETE_ERROR')
  }
}

module.exports = { listQuestions, createQuestion, updateQuestion, deleteQuestion }
