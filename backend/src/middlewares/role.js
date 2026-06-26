const { fail } = require('../utils/response')

function authorize(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role || 'user'

    if (!allowedRoles.includes(role)) {
      return fail(res, 'No autorizado para esta accion', 403, 'AUTH_FORBIDDEN')
    }

    return next()
  }
}

module.exports = {
  authorize,
}
