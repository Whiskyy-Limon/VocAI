import api from './api'

/** GET /api/test/questions — preguntas activas del test */
export async function getQuestions() {
  const res = await api.get('/test/questions')
  return res.data.data ?? res.data
}

/**
 * POST /api/test/submit
 * answers: [{ questionId, optionIndex }]
 */
export async function submitTest(answers) {
  const res = await api.post('/test/submit', { answers })
  return res.data.data ?? res.data
}

/** GET /api/test/history — historial del usuario autenticado */
export async function getHistory() {
  const res = await api.get('/test/history')
  return res.data.data ?? res.data
}

export default { getQuestions, submitTest, getHistory }
