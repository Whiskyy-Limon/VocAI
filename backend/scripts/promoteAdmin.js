// Promueve un usuario existente a role: 'admin'
// Uso: node scripts/promoteAdmin.js correo@ejemplo.com
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Uso: node scripts/promoteAdmin.js correo@ejemplo.com');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'vocai_db' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.log(`No existe ningún usuario registrado con el email: ${email}`);
    console.log('Primero debe registrarse desde /register, luego correr este script.');
    process.exit(1);
  }

  user.role = 'admin';
  await user.save();
  console.log(`✅ ${email} ahora tiene role: admin`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
