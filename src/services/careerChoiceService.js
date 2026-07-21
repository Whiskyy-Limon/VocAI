import api from './api'

/** PUT /api/profiles/choice — marca una carrera como la elegida por el usuario */
export async function chooseCareer(careerId) {
  const res = await api.put('/profiles/choice', { careerId })
  return res.data
}

/** GET /api/profiles/choice — carrera elegida por el usuario autenticado (o null) */
export async function getMyChoice() {
  const res = await api.get('/profiles/choice')
  return res.data
}

/** GET /api/careers/ranking — carreras ordenadas por cuántos usuarios las eligieron */
export async function getCareerRanking() {
  const res = await api.get('/careers/ranking')
  return res.data.data ?? res.data
}

export default { chooseCareer, getMyChoice, getCareerRanking }
