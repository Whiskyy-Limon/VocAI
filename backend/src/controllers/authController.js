// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { fail } = require('../utils/response');

/* ── Validación de contraseña ── */
const PASSWORD_RULES = [
  { key: 'length',  label: 'Mínimo 8 caracteres',        test: pw => pw.length >= 8 },
  { key: 'upper',   label: 'Una letra mayúscula (A-Z)',   test: pw => /[A-Z]/.test(pw) },
  { key: 'lower',   label: 'Una letra minúscula (a-z)',   test: pw => /[a-z]/.test(pw) },
  { key: 'number',  label: 'Un número (0-9)',             test: pw => /[0-9]/.test(pw) },
  { key: 'special', label: 'Un carácter especial (!@#…)', test: pw => /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?`~]/.test(pw) },
]

function validatePassword(pw) {
  if (typeof pw !== 'string') return { valid: false, failed: PASSWORD_RULES.map(r => r.label) }
  const failed = PASSWORD_RULES.filter(r => !r.test(pw)).map(r => r.label)
  return { valid: failed.length === 0, failed }
}

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    const err = new Error('JWT_SECRET no configurado');
    err.code = 'JWT_SECRET_MISSING';
    throw err;
  }

  return jwt.sign(
    { id: user._id, email: user.email, name: user.name || '', role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return fail(res, 'Email y contraseña son obligatorios', 400, 'AUTH_MISSING_FIELDS');
    }

    const { valid, failed } = validatePassword(password);
    if (!valid) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña no cumple los requisitos de seguridad',
        code: 'AUTH_PASSWORD_WEAK',
        failed,   // array con los requisitos que faltan — el frontend puede mostrarlos
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return fail(res, 'El email ya está registrado', 409, 'AUTH_EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, passwordHash, name: name || '' });

    let token;
    try {
      token = createToken(user);
    } catch (err) {
      return fail(res, 'Error de configuracion de autenticacion', 500, err.code || 'AUTH_CONFIG_ERROR');
    }

    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    return fail(res, 'Error al registrar usuario', 500, 'AUTH_REGISTER_ERROR');
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return fail(res, 'Email y contrasena son obligatorios', 400, 'AUTH_MISSING_FIELDS');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return fail(res, 'Credenciales invalidas', 400, 'AUTH_INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return fail(res, 'Credenciales invalidas', 400, 'AUTH_INVALID_CREDENTIALS');
    }

    let token;
    try {
      token = createToken(user);
    } catch (err) {
      return fail(res, 'Error de configuracion de autenticacion', 500, err.code || 'AUTH_CONFIG_ERROR');
    }

    return res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    return fail(res, 'Error al iniciar sesion', 500, 'AUTH_LOGIN_ERROR');
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return fail(res, 'Email es obligatorio', 400, 'AUTH_EMAIL_REQUIRED');
    }

    const user = await User.findOne({ email });

    // Por seguridad, no revelar si el email existe o no
    if (!user) {
      return res.json({ message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' });
    }

    // TODO: Integrar con un servicio de email real (nodemailer, sendgrid, etc.)
    // Por ahora es solo un mock que simula envío
    console.log(`[MOCK] Email de recuperación enviado a: ${email}`);

    return res.json({ message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' });
  } catch (err) {
    return fail(res, 'Error al procesar recuperacion de contrasena', 500, 'AUTH_FORGOT_ERROR');
  }
}

module.exports = { register, login, forgotPassword };
