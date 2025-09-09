import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import sessionsController from '../controllers/sessions.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', usersController.getAllUsers);
router.get('/:uid', usersController.getUser);
router.put('/:uid', usersController.updateUser);
router.delete('/:uid', usersController.deleteUser);
router.get('/current', authMiddleware, sessionsController.current);
router.post('/register', usersController.createUser);
router.post('/login', usersController.loginUser); // ✅ ahora sí

export default router;