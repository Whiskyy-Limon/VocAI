const STORAGE_KEY = 'vocai_comparator'
const MAX_ITEMS = 3

export function getComparator() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (e) {
    return []
  }
}

function notifyChange(items) {
  try {
    window.dispatchEvent(new CustomEvent('vocai_comparator_changed', { detail: items }))
  } catch (e) {
    // ignore
  }
}

export function setComparator(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  notifyChange(items)
}

export function clearComparator() {
  localStorage.removeItem(STORAGE_KEY)
  notifyChange([])
}

export function normalizeCareerForComparator(career) {
  const id = career._id || career.id || career.codigo
  return {
    id,
    title: career.title,
    sede: career.sede || 'Lima',
    salaryText: career.salaryText || (career.salary ? `S/ ${career.salary}` : 'No especificado'),
    duration: career.duration || '3 anos',
    field: career.field || '',
    skills: career.skills || [],
    description: career.description || career.longDescription || '',
  }
}

export function addToComparator(career) {
  const current = getComparator()
  const item = normalizeCareerForComparator(career)

  if (current.find((x) => x.id === item.id)) {
    return { ok: false, reason: 'exists', items: current }
  }

  if (current.length >= MAX_ITEMS) {
    return { ok: false, reason: 'max', items: current }
  }

  const updated = [...current, item]
  setComparator(updated)
  return { ok: true, items: updated }
}

export function removeFromComparator(id) {
  const current = getComparator()
  const next = current.filter((item) => item.id !== id)
  setComparator(next)
  return next
}

export const comparatorStorageKey = STORAGE_KEY
export const comparatorMaxItems = MAX_ITEMS
