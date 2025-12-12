// backend/src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const careerRoutes = require('./routes/careerRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assistantRoutes = require('./routes/assistantRoutes');

const app = express();

// Conexión a Mongo
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/assistant', assistantRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VocAI API running' });
});

// Manejo básico de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor VocAI escuchando en puerto ${PORT}`);
});
 