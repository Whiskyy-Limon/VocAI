// Probar la respuesta con HTML
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testHtmlResponse() {
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
    console.log('TEXTO PLANO (reply):');
    console.log('========================================\n');
    console.log(response.data.reply);
    
    console.log('\n\n========================================');
    console.log('HTML (replyHtml):');
    console.log('========================================\n');
    console.log(response.data.replyHtml);
    
    console.log('\n\n========================================');
    console.log('METADATA:');
    console.log('========================================');
    console.log(JSON.stringify(response.data.metadata, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testHtmlResponse();
