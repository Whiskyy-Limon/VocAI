// Simple test harness for askAssistant controller
// For testing purposes, ensure OPENAI_API_KEY is set so the OpenAI client can be instantiated.
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-api-key';
const { askAssistant } = require('../src/controllers/assistantController');
const VocationalProfile = require('../src/models/VocationalProfile');
const Career = require('../src/models/Career');
const User = require('../src/models/User');

async function run() {
  // Monkeypatch DB methods
  VocationalProfile.findOne = function() {
    return { sort: () => ({ lean: async () => null }) };
  };
  Career.find = function() {
    return { lean: async () => ([
      { _id: 'c1', title: 'Simuladores y Videojuegos', codigo: 'SVG', description: 'Juego', salary: 1200, demand: 'Alta', duration: '5 semestres' },
      { _id: 'c2', title: 'Big Data', codigo: 'BD', description: 'Data', salary: 1500, demand: 'Alta', duration: '5 semestres' }
    ]) };
  };
  User.findById = async function(id) {
    return { email: 'test@example.com' };
  };

  // Fake req/res
  const req = { body: { message: '¿Qué me recomiendas?' }, user: { id: 'u123' } };

  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; console.log('RESPONSE', this.statusCode, JSON.stringify(obj, null, 2)); }
  };

  try {
    await askAssistant(req, res);
    console.log('Done');
  } catch (err) {
    console.error('Unhandled error in test:', err);
  }
}

run();
