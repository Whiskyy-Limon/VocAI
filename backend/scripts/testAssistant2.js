// Script para probar el asistente
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testAssistant() {
  console.log('=== PROBANDO ASISTENTE ===\n');

  try {
    // 1. Login para obtener token
    console.log('1. Haciendo login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'sergio@gmail.com',
      password: 'Kinkiregue_06'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso. Token obtenido.\n');

    // 2. Hacer pregunta al asistente
    console.log('2. Consultando al asistente...');
    const assistantResponse = await axios.post(
      `${API_URL}/assistant`,
      {
        message: '¿Qué carreras me recomiendas?'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Respuesta del asistente recibida!');
    console.log('\nRespuesta:', assistantResponse.data.reply);
    console.log('\nMetadata:', assistantResponse.data.metadata);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    if (error.response?.data) {
      console.error('Detalles:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAssistant();
