// Conexion Base de datos Mongo 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secretKey = 'tu_clave_secreta'; // Reemplaza con tu clave secreta

const UserSchema = mongoose.Schema({
  Nombre: String,
  Apellido: String,
  Email: String,
  password: String,
  Rol: String
});

UserSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    const document = this;

    bcrypt.hash(document.password, saltRounds, (error, hashedPassword) => {
      if (error) {
        next(error);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.generateAuthToken = function () {
  const user = this;

  return new Promise((resolve, reject) => {
    jwt.sign({ _id: user._id, Rol: user.Rol }, secretKey, { expiresIn: '1h' }, (err, token) => {
      console.log(token)
      console.log("el anteriorro")
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
module.exports = userModel;