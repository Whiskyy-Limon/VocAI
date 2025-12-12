// Script para probar pregunta sobre carreras cortas
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testCarrerasCortas() {
  try {
    // Login
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'sergio@gmail.com',
      password: 'Kinkiregue_06'
    });
    
    const token = loginResponse.data.token;
    
    // Pregunta sobre carreras cortas
    const assistantResponse = await axios.post(
      `${API_URL}/assistant`,
      {
        message: '¿Qué carreras son más cortas y tienen buenas oportunidades laborales?'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('RESPUESTA DEL ASISTENTE:\n');
    console.log(assistantResponse.data.reply);
    console.log('\n-------------------\n');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCarrerasCortas();
