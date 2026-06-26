const mongoose = require('mongoose');
const logger = require('./logger');

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      const err = new Error('MONGODB_URI no configurada en el entorno');
      err.code = 'MONGODB_URI_MISSING';
      throw err;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'vocai_db',
    });
    logger.info('MongoDB conectado', { host: conn.connection.host });
  } catch (err) {
    logger.error('Error conectando a MongoDB', {
      message: err.message,
      code: err.code || 'MONGODB_CONN_ERROR',
    });
    process.exit(1);
  }
}

module.exports = connectDB;
