import { Router } from 'express';
import { generateMockPets } from '../utils/mockingPets.js'; 
import { generateMockUsers } from '../utils/mockingUsers.js';
import UserModel from '../dao/models/User.js';
import PetModel from '../dao/models/Pet.js';
import { checkMockState } from '../middlewares/checkMockState.js';
import { createError } from '../utils/createError.js';
import { logger } from '../utils/logger.js';
import { validateMockInput } from '../middlewares/validateMockInput.js';

const router = Router();

// 🧪 Simulación de error para testeo del middleware global
router.get('/test-error', async (req, res, next) => {
  try {
    logger.warn('[Mocking/TestError] Simulando CastError');
    await UserModel.findById('pepito'); // ID inválido
    res.send('No deberías ver esto');
  } catch (error) {
    logger.error('[Mocking/TestError] Error simulado:', error);
    next(error);
  }
});

// 👀 Vista previa de los últimos datos mockeados
router.get('/preview', async (req, res, next) => {
  try {
    logger.info('[Mocking/Preview] Iniciando consulta de últimos datos');

    const lastUsers = await UserModel.find().sort({ createdAt: -1 }).limit(5);
    const lastPets = await PetModel.find().sort({ createdAt: -1 }).limit(5);

    logger.success(`[Mocking/Preview] Datos obtenidos: ${lastUsers.length} usuarios, ${lastPets.length} mascotas`);

    res.status(200).json({
      usuarios: lastUsers,
      mascotas: lastPets
    });
  } catch (error) {
    logger.error('[Mocking/Preview] Error en consulta:', error);
    next(error);
  }
});

// 🛠️ Generación de datos mockeados con validación previa
router.post('/generateData', checkMockState ,validateMockInput, async (req, res, next) => {
  try {
    logger.info('[Mocking/Generate] Iniciando generación de datos');

    const users = generateMockUsers(10);
    const pets = generateMockPets(10);

    logger.info(`[Mocking/Generate] Generando ${users.length} usuarios y ${pets.length} mascotas`);

    const userOps = users.map(user => ({ insertOne: { document: user } }));
    const petOps = pets.map(pet => ({ insertOne: { document: pet } }));

    const userResult = await UserModel.bulkWrite(userOps, { ordered: true });
    const petResult = await PetModel.bulkWrite(petOps, { ordered: true });

    logger.success(`[Mocking/Generate] Insertados ${userResult.insertedCount} usuarios y ${petResult.insertedCount} mascotas`);

    res.status(200).json({
      message: 'Mocking exitoso',
      usuariosInsertados: userResult.insertedCount,
      mascotasInsertadas: petResult.insertedCount
    });
  } catch (error) {
    logger.error('[Mocking/Generate] Error en generación:', error);
    next(error);
  }
});

router.get('/mockingusers', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 50;
    const users = generateMockUsers(count);
    res.status(200).json(users);
  } catch (error) {
    req.logger.error('Error al generar usuarios mockeados:', error);
    res.status(500).json({ error: 'Error al generar usuarios mockeados' });
  }
});

router.get('/mockingpets', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 50;
    const pets = generateMockPets(count);
    res.status(200).json(pets);
  } catch (error) {
    req.logger.error('Error al generar mascotas mockeadas:', error);
    res.status(500).json({ error: 'Error al generar mascotas mockeadas' });
  }
});


router.delete('/clear', async (req, res, next) => {
  try {
    logger.warn('[Mocking/Clear] Borrando todos los datos mockeados');

    const userResult = await UserModel.deleteMany({});
    const petResult = await PetModel.deleteMany({});

    logger.success(`[Mocking/Clear] Eliminados ${userResult.deletedCount} usuarios y ${petResult.deletedCount} mascotas`);

    res.status(200).json({
      message: 'Datos mockeados eliminados',
      usuariosEliminados: userResult.deletedCount,
      mascotasEliminadas: petResult.deletedCount
    });
  } catch (error) {
    logger.error('[Mocking/Clear] Error al borrar datos:', error);
    next(error);
  }
});


export default router;
