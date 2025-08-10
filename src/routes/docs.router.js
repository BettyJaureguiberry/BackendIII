import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({
    endpoints: {
      users: '/api/users',
      pets: '/api/pets',
      adoptions: '/api/adoptions',
      sessions: '/api/sessions',
      health: '/health',
      docs: '/docs'
    }
  });
});

export default router;
