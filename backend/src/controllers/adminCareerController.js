const path   = require('path')
const fs     = require('fs')
const Career = require('../models/Career')
const { ok, fail } = require('../utils/response')

/* ── helpers ── */
function validateCareerBody(body, requireCodigo = true) {
  const { title, codigo } = body
  if (!title || !String(title).trim())
    return 'El campo title es requerido'
  if (requireCodigo && (!codigo || !String(codigo).trim()))
    return 'El campo codigo es requerido'
  return null
}

/* GET /api/admin/careers  — lista todas (incluyendo inactivas) */
async function listCareers(req, res) {
  try {
    const { includeInactive } = req.query
    const filter = includeInactive === 'true' ? {} : { active: { $ne: false } }
    const careers = await Career.find(filter).sort({ title: 1 }).lean()
    return ok(res, careers, 'Carreras obtenidas')
  } catch (err) {
    return fail(res, 'Error al obtener carreras', 500, 'ADMIN_C_LIST_ERROR')
  }
}

/* POST /api/admin/careers */
async function createCareer(req, res) {
  try {
    const error = validateCareerBody(req.body, true)
    if (error) return fail(res, error, 400, 'ADMIN_C_VALIDATION')

    const {
      title, codigo, description, longDescription,
      department, sede, duration, field, workField,
      salary, salaryText, demand,
      areas, skills, interests, competencies,
      graduateProfile, curriculum, pdfUrl, imageUrl,
      active,
    } = req.body

    const exists = await Career.findOne({ codigo: String(codigo).trim().toUpperCase() })
    if (exists) return fail(res, `Ya existe una carrera con código ${codigo}`, 409, 'ADMIN_C_CODIGO_DUPLICATE')

    const career = await Career.create({
      title:           String(title).trim(),
      codigo:          String(codigo).trim().toUpperCase(),
      description:     description   || '',
      longDescription: longDescription || '',
      department:      department    || 'Tecnología Digital',
      sede:            sede          || 'Lima / Santa Anita',
      duration:        duration      || '',
      field:           field         || workField || '',
      workField:       workField     || field     || '',
      salary:          salary        ?? undefined,
      salaryText:      salaryText    || '',
      demand:          demand        || '',
      areas:           Array.isArray(areas)        ? areas        : [],
      skills:          Array.isArray(skills)       ? skills       : [],
      interests:       Array.isArray(interests)    ? interests    : [],
      competencies:    Array.isArray(competencies) ? competencies : [],
      graduateProfile: graduateProfile || '',
      curriculum:      curriculum      || '',
      pdfUrl:          pdfUrl          || '',
      imageUrl:        imageUrl        || '',
      active:          active !== undefined ? Boolean(active) : true,
    })

    return ok(res, career, 'Carrera creada', 201)
  } catch (err) {
    return fail(res, 'Error al crear carrera', 500, 'ADMIN_C_CREATE_ERROR')
  }
}

/* PUT /api/admin/careers/:id */
async function updateCareer(req, res) {
  try {
    const career = await Career.findById(req.params.id)
    if (!career) return fail(res, 'Carrera no encontrada', 404, 'ADMIN_C_NOT_FOUND')

    const ALLOWED = [
      'title', 'description', 'longDescription', 'department', 'sede', 'duration',
      'field', 'workField', 'salary', 'salaryText', 'demand',
      'areas', 'skills', 'interests', 'competencies',
      'graduateProfile', 'curriculum', 'pdfUrl', 'imageUrl', 'active',
    ]

    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) {
        career[key] = req.body[key]
      }
    }

    // Si actualizan field o workField, mantener ambos en sync
    if (req.body.field !== undefined && req.body.workField === undefined)
      career.workField = req.body.field
    if (req.body.workField !== undefined && req.body.field === undefined)
      career.field = req.body.workField

    // No permitir cambiar codigo por PUT (es un identificador natural)
    await career.save()
    return ok(res, career, 'Carrera actualizada')
  } catch (err) {
    return fail(res, 'Error al actualizar carrera', 500, 'ADMIN_C_UPDATE_ERROR')
  }
}

/* DELETE /api/admin/careers/:id — soft delete */
async function deleteCareer(req, res) {
  try {
    const career = await Career.findById(req.params.id)
    if (!career) return fail(res, 'Carrera no encontrada', 404, 'ADMIN_C_NOT_FOUND')

    career.active = false
    await career.save()

    return ok(res, { id: career._id, title: career.title, active: false }, 'Carrera desactivada')
  } catch (err) {
    return fail(res, 'Error al desactivar carrera', 500, 'ADMIN_C_DELETE_ERROR')
  }
}

/* POST /api/admin/careers/:id/upload
   Campos del formulario multipart:
     - pdf   (opcional) → actualiza career.pdfUrl
     - image (opcional) → actualiza career.imageUrl
*/
async function uploadCareerFiles(req, res) {
  try {
    const career = await Career.findById(req.params.id)
    if (!career) return fail(res, 'Carrera no encontrada', 404, 'ADMIN_C_NOT_FOUND')

    const UPLOAD_BASE = '/uploads/careers'
    const updates = {}

    if (req.files?.pdf?.[0]) {
      // Borrar archivo anterior si era local
      if (career.pdfUrl?.startsWith('/uploads/')) {
        const old = path.join(__dirname, '../..', career.pdfUrl)
        if (fs.existsSync(old)) fs.unlinkSync(old)
      }
      updates.pdfUrl = `${UPLOAD_BASE}/${req.files.pdf[0].filename}`
    }

    if (req.files?.image?.[0]) {
      if (career.imageUrl?.startsWith('/uploads/')) {
        const old = path.join(__dirname, '../..', career.imageUrl)
        if (fs.existsSync(old)) fs.unlinkSync(old)
      }
      updates.imageUrl = `${UPLOAD_BASE}/${req.files.image[0].filename}`
    }

    if (Object.keys(updates).length === 0) {
      return fail(res, 'No se recibió ningún archivo', 400, 'ADMIN_C_NO_FILE')
    }

    Object.assign(career, updates)
    await career.save()

    return ok(res, { pdfUrl: career.pdfUrl, imageUrl: career.imageUrl }, 'Archivos subidos correctamente')
  } catch (err) {
    // Multer lanza errores con message cuando el tipo no es permitido
    if (err.message?.includes('no permitido')) return fail(res, err.message, 400, 'ADMIN_C_FILE_TYPE')
    return fail(res, 'Error al subir archivos', 500, 'ADMIN_C_UPLOAD_ERROR')
  }
}

module.exports = { listCareers, createCareer, updateCareer, deleteCareer, uploadCareerFiles }
