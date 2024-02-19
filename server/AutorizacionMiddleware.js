// authorizeMiddleware.js x
const userModelo= require('./modelos/user');
const jwt = require('jsonwebtoken');
//const getCookie = require('../client/js/carrito.js')

const authorize = (requiredRole) => {

  return (req, res, next) => {
    const token = getCookie(req,'Token');
    //const token = req.header('x-auth-token');
    console.log(token)
    if (!token) {
      return res.status(401).send('Acceso no autorizado. Token no proporcionado.');
    }

    try {
      const decoded = jwt.verify(token, 'clave_secreta');
      const userRole = decoded.Rol;
      console.log(userRole)
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


const checkUser = (req, res, next) => {
  const token = getCookie(req,'Token');
  if (token) {
    jwt.verify(token, 'clave_secreta', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        console.log("verificado?")
        let user = await userModelo.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

function getCookie(req, nombre) {
  var nombreEQ = nombre + "=";
  var cookies = req.headers.cookie ? req.headers.cookie.split(';') : [];

  for(var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();

      if (cookie.indexOf(nombreEQ) === 0) {
          return cookie.substring(nombreEQ.length, cookie.length);
      }
  }

  return null;
}

module.exports = { authorize, checkUser };