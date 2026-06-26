import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { adminCareers } from '../../services/adminService'
import { API_BASE_URL } from '../../services/api'

/* ── helpers ── */
const toArray = v => Array.isArray(v) ? v : (v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : [])
const toStr   = v => Array.isArray(v) ? v.join(', ') : (v || '')

/** Convierte una ruta relativa del backend en URL absoluta */
const assetUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = API_BASE_URL.replace('/api', '')
  return `${base}${url}`
}

const EMPTY_FORM = {
  title: '', codigo: '', description: '', longDescription: '',
  graduateProfile: '', workField: '', curriculum: '',
  pdfUrl: '', imageUrl: '',
  areas: '', skills: '', interests: '',
  salaryText: '', duration: '', demand: '',
  active: true,
}

/* ── Toast ── */
function Toast({ msg, type, onClose }) {
  if (!msg) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white
      ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      <span>{type === 'error' ? '⚠️' : '✓'} {msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-xl leading-none">×</button>
    </div>
  )
}

/* ── FileInput: reemplaza el campo de URL ── */
function FileInput({ label, accept, currentUrl, file, onFileChange, fileType }) {
  const ref = useRef()
  const isPdf   = fileType === 'pdf'
  const preview = file ? URL.createObjectURL(file) : assetUrl(currentUrl)

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-600">{label}</label>

      {/* Vista previa actual */}
      {currentUrl && !file && (
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border ${isPdf ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          <span>{isPdf ? '📄' : '🖼️'}</span>
          <span className="truncate flex-1">Archivo actual: {currentUrl.split('/').pop()}</span>
          {isPdf
            ? <a href={assetUrl(currentUrl)} target="_blank" rel="noopener noreferrer" className="underline shrink-0">Ver</a>
            : <img src={assetUrl(currentUrl)} alt="" className="h-8 w-8 object-cover rounded" />
          }
        </div>
      )}

      {/* Archivo seleccionado (nuevo) */}
      {file && (
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border ${isPdf ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
          <span>{isPdf ? '📄' : '🖼️'}</span>
          <span className="truncate flex-1">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
          {!isPdf && <img src={preview} alt="" className="h-8 w-8 object-cover rounded" />}
          <button type="button" onClick={() => onFileChange(null)} className="shrink-0 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Botón de selección */}
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 text-sm font-medium transition-colors
          ${file ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                 : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'}`}
      >
        {file ? '↺ Cambiar archivo' : `+ Seleccionar ${isPdf ? 'PDF' : 'imagen'}`}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => onFileChange(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}

/* ── Modal de formulario ── */
function CareerModal({ career, onClose, onSaved, notify }) {
  const isEdit = Boolean(career?._id)

  const [form, setForm] = useState(() =>
    isEdit
      ? { ...career, areas: toStr(career.areas), skills: toStr(career.skills), interests: toStr(career.interests) }
      : { ...EMPTY_FORM }
  )
  const [pdfFile,   setPdfFile]   = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!form.title.trim()) return setError('El título es obligatorio')
    if (!isEdit && !form.codigo.trim()) return setError('El código es obligatorio')

    setLoading(true)
    try {
      /* 1. Guardar datos de la carrera (sin archivos) */
      const payload = {
        ...form,
        areas:     toArray(form.areas),
        skills:    toArray(form.skills),
        interests: toArray(form.interests),
        active:    Boolean(form.active),
      }
      // Limpiar pdfUrl/imageUrl del payload si hay archivo nuevo
      // (se actualizarán en el paso 2)
      if (pdfFile)   delete payload.pdfUrl
      if (imageFile) delete payload.imageUrl

      const saved = isEdit
        ? await adminCareers.update(career._id, payload)
        : await adminCareers.create(payload)

      /* 2. Si hay archivos nuevos, subirlos */
      if (pdfFile || imageFile) {
        const files = {}
        if (pdfFile)   files.pdf   = pdfFile
        if (imageFile) files.image = imageFile

        const uploaded = await adminCareers.uploadFiles(saved._id, files)
        // Mezclar URLs actualizadas en el objeto guardado
        if (uploaded.pdfUrl)   saved.pdfUrl   = uploaded.pdfUrl
        if (uploaded.imageUrl) saved.imageUrl = uploaded.imageUrl
      }

      onSaved(saved, isEdit)
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al guardar')
    } finally { setLoading(false) }
  }

  const Field = ({ label, name, as = 'input', hint }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {as === 'textarea'
        ? <textarea rows={3} value={form[name]} onChange={e => set(name, e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        : <input value={form[name]} onChange={e => set(name, e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      }
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">{isEdit ? 'Editar carrera' : 'Nueva carrera'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>

        {/* body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Título *" name="title" />
            <Field label="Código *" name="codigo" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duración" name="duration" />
            <Field label="Sueldo referencial" name="salaryText" />
          </div>

          <Field label="Descripción corta"        name="description"     as="textarea" />
          <Field label="Descripción larga"         name="longDescription" as="textarea" />
          <Field label="Perfil del egresado"       name="graduateProfile" as="textarea" />
          <Field label="Campo / enfoque laboral"   name="workField"       as="textarea" />
          <Field label="Malla curricular resumida" name="curriculum"      as="textarea" />

          {/* ── Archivos ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <FileInput
              label="📄 PDF informativo"
              accept="application/pdf"
              fileType="pdf"
              currentUrl={form.pdfUrl}
              file={pdfFile}
              onFileChange={setPdfFile}
            />
            <FileInput
              label="🖼️ Imagen de la carrera"
              accept="image/jpeg,image/png,image/webp"
              fileType="image"
              currentUrl={form.imageUrl}
              file={imageFile}
              onFileChange={setImageFile}
            />
          </div>

          <Field label="Áreas (separadas por coma)"    name="areas"     hint="Ej: software, web, cloud" />
          <Field label="Skills (separados por coma)"   name="skills"    hint="Ej: Python, SQL, Git" />
          <Field label="Intereses (separados por coma)"name="interests" hint="Ej: programación, análisis" />

          {/* Toggle activo */}
          <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
            <div
              onClick={() => set('active', !form.active)}
              className={`w-10 h-6 rounded-full transition-colors relative ${form.active ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.active ? 'left-5' : 'left-1'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">Carrera activa</span>
          </label>
        </form>

        {/* footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} type="button"
            className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 transition-colors flex items-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear carrera'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Página principal ── */
export default function AdminCareers() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)
  const [toast,   setToast]   = useState(null)
  const [filter,  setFilter]  = useState('all')

  const notify = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setCareers(await adminCareers.list(true))
    } catch {
      notify('Error al cargar carreras', 'error')
    } finally { setLoading(false) }
  }, [notify])

  useEffect(() => { load() }, [load])

  async function handleDeactivate(career) {
    if (!confirm(`¿Desactivar "${career.title}"?`)) return
    try {
      await adminCareers.deactivate(career._id)
      setCareers(prev => prev.map(c => c._id === career._id ? { ...c, active: false } : c))
      notify(`"${career.title}" desactivada`)
    } catch (err) {
      notify(err?.response?.data?.message || 'Error al desactivar', 'error')
    }
  }

  async function handleReactivate(career) {
    try {
      await adminCareers.update(career._id, { active: true })
      setCareers(prev => prev.map(c => c._id === career._id ? { ...c, active: true } : c))
      notify(`"${career.title}" reactivada`)
    } catch {
      notify('Error al reactivar', 'error')
    }
  }

  function handleSaved(saved, isEdit) {
    setCareers(prev =>
      isEdit ? prev.map(c => c._id === saved._id ? saved : c) : [saved, ...prev]
    )
    notify(isEdit ? 'Carrera actualizada correctamente' : 'Carrera creada correctamente')
    setModal(null)
  }

  const filtered = careers.filter(c => {
    if (filter === 'active')   return c.active !== false
    if (filter === 'inactive') return c.active === false
    return true
  })

  return (
    <div className="space-y-6 py-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="text-xs text-gray-400 hover:text-gray-600">← Panel admin</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Gestión de Carreras</h1>
          <p className="text-gray-500 text-sm">{careers.length} carreras en total</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          + Nueva carrera
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {[
          { key: 'all',      label: 'Todas',     count: careers.length },
          { key: 'active',   label: 'Activas',   count: careers.filter(c => c.active !== false).length },
          { key: 'inactive', label: 'Inactivas', count: careers.filter(c => c.active === false).length },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              filter === f.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f.label} <span className="ml-1 opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🎓</div>
          <p>No hay carreras {filter !== 'all' ? `(${filter})` : ''}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Carrera</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Archivos</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((career, i) => (
                <tr key={career._id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* miniatura imagen */}
                      {career.imageUrl
                        ? <img src={assetUrl(career.imageUrl)} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                        : <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">🎓</div>
                      }
                      <div>
                        <p className="font-semibold text-gray-900">{career.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{career.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{career.codigo}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${career.pdfUrl ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
                        {career.pdfUrl ? '📄 PDF' : '— PDF'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${career.imageUrl ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                        {career.imageUrl ? '🖼️ Img' : '— Img'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      career.active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${career.active !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {career.active !== false ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModal(career)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                        ✏️ Editar
                      </button>
                      {career.active !== false
                        ? <button onClick={() => handleDeactivate(career)}
                            className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                            🚫 Desactivar
                          </button>
                        : <button onClick={() => handleReactivate(career)}
                            className="text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                            ✅ Reactivar
                          </button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <CareerModal
          career={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
          notify={notify}
        />
      )}

      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  )
}
