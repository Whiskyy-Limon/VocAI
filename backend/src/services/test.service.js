const Question = require('../models/Question')
const Career = require('../models/Career')

function normalizeText(value) {
  return String(value || '').toLowerCase().trim()
}

function careerMatchesCategory(career, category) {
  const cat = normalizeText(category)
  if (!cat) return false

  const areas = (career.areas || []).map(normalizeText)
  if (areas.includes(cat)) return true

  const skills = (career.skills || []).map(normalizeText)
  if (skills.includes(cat)) return true

  const field = normalizeText(career.field)
  if (field.includes(cat)) return true

  const title = normalizeText(career.title)
  if (title.includes(cat)) return true

  return false
}

function buildCategoryScores(answers) {
  return answers.reduce((acc, item) => {
    const key = item.category
    acc[key] = (acc[key] || 0) + item.score
    return acc
  }, {})
}

function computeAffinities(categoryScores, careers) {
  const categories = Object.keys(categoryScores)
  const totalScore = categories.reduce((sum, key) => sum + (categoryScores[key] || 0), 0)

  const ranked = careers.map((career) => {
    const matchScore = categories.reduce((sum, category) => {
      return careerMatchesCategory(career, category) ? sum + (categoryScores[category] || 0) : sum
    }, 0)

    const affinity = totalScore > 0 ? Math.round((matchScore / totalScore) * 100) : 0

    return {
      careerId: career._id,
      title: career.title,
      affinity,
      matchScore,
    }
  })

  ranked.sort((a, b) => b.matchScore - a.matchScore)

  return {
    totalScore,
    recommendedCareers: ranked.slice(0, 3).map(({ careerId, title, affinity }) => ({
      careerId,
      title,
      affinity,
    })),
  }
}

async function getActiveQuestions() {
  return Question.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean()
}

async function submitTest({ userId, answers }) {
  const questions = await Question.find({ _id: { $in: answers.map((a) => a.questionId) }, active: true })
  const questionMap = new Map(questions.map((q) => [String(q._id), q]))

  const enrichedAnswers = answers.map((answer) => {
    const questionId = String(answer.questionId || '')
    const question = questionMap.get(questionId)

    if (!question) {
      const err = new Error('Pregunta no encontrada o inactiva')
      err.status = 400
      err.code = 'TEST_QUESTION_INVALID'
      throw err
    }

    let option = null
    if (Number.isInteger(answer.optionIndex)) {
      option = question.options[answer.optionIndex]
    } else if (answer.optionLabel) {
      option = question.options.find((opt) => opt.label === answer.optionLabel)
    } else if (typeof answer.score === 'number') {
      option = { label: answer.optionLabel || 'Opcion', score: answer.score }
    }

    if (!option) {
      const err = new Error('Opcion invalida')
      err.status = 400
      err.code = 'TEST_OPTION_INVALID'
      throw err
    }

    return {
      questionId: question._id,
      optionLabel: option.label,
      score: option.score,
      category: question.category,
    }
  })

  const categoryScores = buildCategoryScores(enrichedAnswers)
  const careers = await Career.find().lean()
  const { totalScore, recommendedCareers } = computeAffinities(categoryScores, careers)

  return {
    user: userId,
    answers: enrichedAnswers,
    categoryScores,
    recommendedCareers,
    totalScore,
  }
}

async function getHistory(userId) {
  return userId
}

module.exports = {
  getActiveQuestions,
  submitTest,
  getHistory,
}
