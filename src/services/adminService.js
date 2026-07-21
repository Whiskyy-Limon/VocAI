import api from './api'

// ── Carreras ──────────────────────────────────────────────
export const adminCareers = {
  list: (includeInactive = true) =>
    api.get(`/admin/careers?includeInactive=${includeInactive}`).then(r => r.data.data),

  create: (data) =>
    api.post('/admin/careers', data).then(r => r.data.data),

  update: (id, data) =>
    api.put(`/admin/careers/${id}`, data).then(r => r.data.data),

  deactivate: (id) =>
    api.delete(`/admin/careers/${id}`).then(r => r.data.data),

  /** Elimina la carrera de forma permanente (irreversible) */
  remove: (id) =>
    api.delete(`/admin/careers/${id}/permanent`).then(r => r.data.data),

  /**
   * Sube pdf y/o imagen para una carrera.
   * @param {string} id  — _id de la carrera
   * @param {{ pdf?: File, image?: File }} files
   */
  uploadFiles: (id, files) => {
    const fd = new FormData()
    if (files.pdf)   fd.append('pdf',   files.pdf)
    if (files.image) fd.append('image', files.image)
    return api.post(`/admin/careers/${id}/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data)
  },
}

// ── Preguntas ─────────────────────────────────────────────
export const adminQuestions = {
  list: () =>
    api.get('/admin/questions').then(r => r.data.data),

  create: (data) =>
    api.post('/admin/questions', data).then(r => r.data.data),

  update: (id, data) =>
    api.put(`/admin/questions/${id}`, data).then(r => r.data.data),

  delete: (id) =>
    api.delete(`/admin/questions/${id}`).then(r => r.data.data),
}
