// Script para registrar un usuario contra el backend local
// Uso: node scripts/createUser.js correo@ejemplo.com "MiContraseña123!"
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:4000/api';

async function createUser() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Uso: node scripts/createUser.js correo@ejemplo.com "MiContraseña123!"');
    process.exit(1);
  }

  try {
    console.log('Registrando usuario:', email);

    const response = await axios.post(`${API_URL}/auth/register`, { email, password });

    console.log('✅ Usuario creado exitosamente!');
    console.log('Token:', response.data.token);
    console.log('Usuario:', response.data.user);
    console.log('\nAhora puedes hacer login con este usuario.');
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️  El usuario ya existe. Puedes hacer login directamente.');
    } else {
      console.error('❌ Error:', error.response?.data || error.message);
    }
  }
}

createUser();
