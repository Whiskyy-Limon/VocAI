const multer = require('multer')
const path   = require('path')
const fs     = require('fs')

const UPLOAD_DIR = path.join(__dirname, '../../uploads/careers')

// Asegurar que la carpeta existe al arrancar
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // prefijo timestamp para evitar colisiones
    const ts  = Date.now()
    const ext = path.extname(file.originalname).toLowerCase()
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40)
    cb(null, `${base}_${ts}${ext}`)
  },
})

function fileFilter(_req, file, cb) {
  const ALLOWED_PDF   = ['application/pdf']
  const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp']
  const all = [...ALLOWED_PDF, ...ALLOWED_IMAGE]

  if (all.includes(file.mimetype)) return cb(null, true)
  cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB máximo
})

module.exports = upload
