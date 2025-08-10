import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

import healthRouter from './routes/health.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import docsRouter from './routes/docs.router.js';
import mocksRouter from './routes/mocks.router.js';

import { logger } from './utils/logger.js';
import { requestLogger } from './middlewares/logger.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/health', healthRouter);
app.use('/docs', docsRouter);
app.use('/api/mocks', mocksRouter);

// 🧯 Middleware global quirúrgico
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Error de validación: ' + err.message;
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'Formato inválido en el parámetro: ' + err.message;
  }

  logger.error(`[Error global] ${message}`);

  res.status(status).json({
    error: true,
    message
  });
});


// 🔌 Conexión a MongoDB Atlas y arranque controlado
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.success(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('❌ No se pudo conectar a MongoDB Atlas. Servidor no iniciado.');
    logger.error(err);
  });
