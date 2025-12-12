// Script para probar el registro y login
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testAuth() {
  console.log('=== PROBANDO AUTENTICACIÓN ===\n');

  // Datos de prueba
  const testUser = {
    email: 'test@example.com',
    password: 'password123'
  };

  try {
    // 1. Registro
    console.log('1. Intentando registrar usuario...');
    console.log('Datos:', testUser);
    
    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('✅ Registro exitoso!');
    console.log('Token:', registerResponse.data.token);
    console.log('Usuario:', registerResponse.data.user);
    console.log('');

    // 2. Login
    console.log('2. Intentando hacer login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, testUser);
    console.log('✅ Login exitoso!');
    console.log('Token:', loginResponse.data.token);
    console.log('Usuario:', loginResponse.data.user);
    console.log('');

    console.log('=== TODAS LAS PRUEBAS PASARON ===');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers enviados:', error.config?.headers);
    console.error('Datos enviados:', error.config?.data);
  }
}

testAuth();
