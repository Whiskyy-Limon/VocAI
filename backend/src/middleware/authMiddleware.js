// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { fail } = require('../utils/response');

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return fail(res, 'Token no proporcionado', 401, 'AUTH_TOKEN_MISSING');
  }

  if (!process.env.JWT_SECRET) {
    return fail(res, 'Error de configuracion: JWT_SECRET no disponible', 500, 'JWT_SECRET_MISSING');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 IMPORTANTE: en el token el id puede venir como "sub", "id" o "_id"
    const userId = payload.sub || payload.id || payload._id;

    if (!userId) {
      return fail(res, 'Token invalido o mal formado', 401, 'AUTH_TOKEN_INVALID');
    }

    // Para usarlo en los controladores nuevos
    req.user = {
      id: userId,
      email: payload.email,
      role: payload.role || 'user',
    };

    // Para compatibilidad con código viejo que use req.userId
    req.userId = userId;

    next();
  } catch (err) {
    return fail(res, 'Token invalido o expirado', 401, 'AUTH_TOKEN_EXPIRED');
  }
}

module.exports = authRequired;
