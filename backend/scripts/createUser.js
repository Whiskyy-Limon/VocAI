// Script para crear un usuario específico
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function createUser() {
  const userData = {
    email: 'sergio@gmail.com',
    password: 'Kinkiregue_06'
  };

  try {
    console.log('Registrando usuario:', userData.email);
    
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
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
