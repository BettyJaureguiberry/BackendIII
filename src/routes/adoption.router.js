import { Router} from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import petsController from '../controllers/pets.controller.js';


const router = Router();

router.get('/',adoptionsController.getAllAdoptions);
router.get('/:aid',adoptionsController.getAdoption);
router.post('/:uid/:pid',adoptionsController.createAdoption);
router.patch('/:pid/adopt', authMiddleware, petsController.adoptPet);
router.delete('/:aid', adoptionsController.deleteAdoption);


export default router;