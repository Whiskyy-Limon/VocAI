const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { pathToFileURL } = require('url')
const Career = require('../src/models/Career')

dotenv.config()

async function loadCareers() {
  const careersPath = path.resolve(__dirname, '../../src/mocks/careers.js')
  const careersUrl = pathToFileURL(careersPath).href
  const module = await import(careersUrl)
  return module.CAREERS || []
}

function normalizeCareers(careers) {
  return careers.map((career) => ({
    title: career.title,
    description: career.description,
    codigo: career.codigo,
    department: career.departamento || 'Tecnologia Digital',
    sede: career.sede || 'Lima',
    duration: career.duration,
    field: career.field,
    salaryText: career.salaryText,
    skills: career.skills || [],
  }))
}

async function seedCareers() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI no configurada')
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'vocai_db',
  })

  const careers = await loadCareers()
  const normalized = normalizeCareers(careers)

  await Career.deleteMany({})
  const result = await Career.insertMany(normalized)

  console.log(`Carreras insertadas: ${result.length}`)
}

seedCareers()
  .then(() => mongoose.connection.close())
  .catch((error) => {
    console.error('Error en seedCareers:', error)
    mongoose.connection.close()
    process.exit(1)
  })
