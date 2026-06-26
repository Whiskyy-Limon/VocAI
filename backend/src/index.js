// backend/src/index.js
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const dotenv  = require('dotenv');
const path    = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const careerRoutes = require('./routes/careerRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const profileRoutes = require('./routes/profileRoutes');
const testRoutes = require('./routes/testRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Conexión a Mongo
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Archivos estáticos — uploads servidos públicamente
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/test', testRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VocAI API running' });
});

// Manejo global de errores (siempre al final)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor VocAI escuchando en puerto ${PORT}`);
});
 