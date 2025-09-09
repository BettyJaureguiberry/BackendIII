import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import healthRouter from './routes/health.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import docsRouter from './routes/docs.router.js';
import mocksRouter from './routes/mocks.router.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { logger } from './utils/logger.js';
import swaggerDocs from './docs/swagger.js';




dotenv.config();

const app = express();

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
app.use('/api-docs', swaggerDocs.serve, swaggerDocs.setup);


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

export default app;