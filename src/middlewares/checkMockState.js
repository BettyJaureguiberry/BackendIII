import UserModel from '../dao/models/User.js';
import PetModel from '../dao/models/Pet.js';
import { createError } from '../utils/createError.js';

export const checkMockState = async (req, res, next) => {
  try {
    const userCount = await UserModel.countDocuments();
    const petCount = await PetModel.countDocuments();

    if ((userCount > 0 || petCount > 0) && req.query.force !== 'true') {
      throw createError(409, 'Ya existen datos mockeados. Usá ?force=true para regenerar.');
    }

    // Si viene force=true, borramos antes de generar
    if (req.query.force === 'true') {
      await UserModel.deleteMany({});
      await PetModel.deleteMany({});
    }

    next();
  } catch (err) {
    next(err);
  }
};
