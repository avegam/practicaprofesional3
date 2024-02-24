// Conexion Base de datos Mongo 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { checkExistingEmail, hashPassword  }= require('../utiluser');

const saltRounds = 10;
const secretKey = 'clave_secreta'; // Reemplaza con tu clave secreta

const UserSchema = mongoose.Schema({
  Nombre: String,
  Apellido: String,
  Telefono:String,
  Email: String,
  password: String,
  Rol: String
});



// Middleware pre-save para el UserSchema
UserSchema.pre('save', async function(next) {
  const user = this;

  try {
    const emailExists = await checkExistingEmail(user);
    if (emailExists) {
      const error = new Error('El correo electrónico ya está registrado');
      return next(error);
    }

    // Si el correo electrónico no existe, proceder con el hash del password
    if (user.isNew || user.isModified('password')) {
      const hashedPassword = await hashPassword(user);
      user.password = hashedPassword;
    }

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.generateAuthToken = function () {
  const user = this;

  return new Promise((resolve, reject) => {
    jwt.sign({ _id: user._id, Rol: user.Rol }, secretKey, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

UserSchema.methods.isCorrectPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (error, same) {
      if (error) {
        reject(error);
      } else {
        resolve(same);
      }
    });
  });
};

const userModel = mongoose.model('user',UserSchema);
module.exports =  userModel;