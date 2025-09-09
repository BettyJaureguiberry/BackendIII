import app from './app.js';
import { connectDB } from './db.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 8080;

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