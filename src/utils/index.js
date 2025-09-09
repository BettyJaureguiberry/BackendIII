import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 🔐 Hasheo de contraseña
export const createHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 🔍 Validación de contraseña
export const passwordValidation = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

// 🧾 Generación de token JWT
export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// 📁 Resolución de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;