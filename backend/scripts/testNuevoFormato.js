// Script para probar el nuevo formato mejorado
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testNuevoFormato() {
  try {
    // Login
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'sergio@gmail.com',
      password: 'Kinkiregue_06'
    });
    
    const token = loginResponse.data.token;
    
    console.log('========================================');
    console.log('PRUEBA 1: Pregunta general');
    console.log('========================================\n');
    
    // Pregunta 1
    const response1 = await axios.post(
      `${API_URL}/assistant`,
      {
        message: 'Ayúdame a elegir una carrera'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log(response1.data.reply);
    console.log('\n\n========================================');
    console.log('PRUEBA 2: Pregunta sobre salarios');
    console.log('========================================\n');
    
    // Pregunta 2
    const response2 = await axios.post(
      `${API_URL}/assistant`,
      {
        message: '¿Cuáles son las carreras mejor pagadas?'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log(response2.data.reply);
    
    console.log('\n\n========================================');
    console.log('PRUEBA 3: Interés específico');
    console.log('========================================\n');
    
    // Pregunta 3
    const response3 = await axios.post(
      `${API_URL}/assistant`,
      {
        message: 'Me gustan los videojuegos, ¿qué me recomiendas?'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log(response3.data.reply);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testNuevoFormato();
