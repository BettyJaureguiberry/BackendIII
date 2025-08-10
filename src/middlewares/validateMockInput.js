import { createError } from '../utils/createError.js';

export const validateMockInput = (req, res, next) => {
  const { usuarios = 10, mascotas = 10 } = req.body;

  if (
    typeof usuarios !== 'number' || usuarios < 1 || usuarios > 100 ||
    typeof mascotas !== 'number' || mascotas < 1 || mascotas > 100
  ) {
    throw createError(400, 'Los valores de usuarios y mascotas deben ser números entre 1 y 100');
  }

  next();
};
