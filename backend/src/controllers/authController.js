// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  try {
    const { email, password } = req.body;
    
    console.log('Register attempt - Body:', req.body);
    console.log('Email:', email, 'Password:', password ? '***' : 'undefined');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, passwordHash });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error('Error en register:', err);
    return res.status(500).json({ message: 'Error al registrar usuario' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt - Body:', req.body);
    console.log('Email:', email, 'Password:', password ? '***' : 'undefined');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email es obligatorio' });
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
    console.error('Error en forgotPassword:', err);
    return res.status(500).json({ message: 'Error al procesar recuperación de contraseña' });
  }
}

module.exports = { register, login, forgotPassword };
