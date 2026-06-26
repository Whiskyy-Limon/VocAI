const { fail } = require('../utils/response')

function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const code = err.code || null
  const message = err.message || 'Error interno del servidor'

  if (process.env.NODE_ENV !== 'production') {
    console.error('ErrorHandler:', err)
  }

  return fail(res, message, status, code)
}

module.exports = errorHandler
