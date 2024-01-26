// authorizeMiddleware.js
const jwt = require('jsonwebtoken');

const authorize = (requiredRole) => {
  return (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).send('Acceso no autorizado. Token no proporcionado.');
    }

    try {
      const decoded = jwt.verify(token, 'clave_secreta');
      const userRole = decoded.role;

      if (userRole !== requiredRole) {
        return res.status(403).send('Acceso no autorizado. Rol insuficiente.');
      }

      // Usuario autorizado, continúa con la solicitud
      next();
    } catch (error) {
      console.error('Error al verificar el token:', error);
      return res.status(401).send('Acceso no autorizado. Token inválido.');
    }
  };
};

module.exports = authorize;