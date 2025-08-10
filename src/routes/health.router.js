import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const status = dbState === 1 ? '🟢 Conectado' : '🔴 No conectado';

  res.status(200).json({
    status,
    dbState,
    timestamp: new Date().toISOString()
  });
});

export default router;
