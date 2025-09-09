import jwt from 'jsonwebtoken';


/**
 * Middleware de autenticación.
 * Verifica el token JWT en la cookie 'coderCookie' y adjunta el payload al req.user.
 */
export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.coderCookie;

  if (!token) {
    console.warn(`[AUTH] No token provided from IP ${req.ip}`);
    return res.status(401).send({ status: "error", message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, 'tokenSecretJWT');
    req.user = user;
    console.info(`[AUTH] Token verified for user ${user.email || user.id}`);
    next();
  } catch (error) {
    console.error(`[AUTH] Invalid token from IP ${req.ip}: ${error.message}`);
    res.status(403).send({ status: "error", message: "Invalid token" });
  }
};