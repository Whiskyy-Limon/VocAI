// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 IMPORTANTE: en el token el id puede venir como "sub", "id" o "_id"
    const userId = payload.sub || payload.id || payload._id;

    if (!userId) {
      return res.status(401).json({ message: 'Token inválido o mal formado' });
    }

    // Para usarlo en los controladores nuevos
    req.user = {
      id: userId,
      email: payload.email,
    };

    // Para compatibilidad con código viejo que use req.userId
    req.userId = userId;

    next();
  } catch (err) {
    console.error('Error verificando token:', err);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = authRequired;
