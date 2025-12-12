// Prueba final con la pregunta específica del usuario
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testProgramacion() {
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'sergio@gmail.com',
      password: 'Kinkiregue_06'
    });
    
    const token = loginResponse.data.token;
    
    const response = await axios.post(
      `${API_URL}/assistant`,
      {
        message: 'Me gustan la programación y la tecnología'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('========================================');
    console.log('RESPUESTA FINAL:');
    console.log('========================================\n');
    console.log(response.data.reply);
    console.log('\n========================================');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testProgramacion();
