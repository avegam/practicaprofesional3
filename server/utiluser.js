const saltRounds = 10;
const bcrypt = require('bcrypt');

// Función para verificar si el correo electrónico ya está registrado
async function checkExistingEmail(user) {
    const existingUser = await userModel.findOne({ Email: user.Email });
    return existingUser !== null;
  }
  
  // Función para hashear el password
  async function hashPassword(user) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    return hashedPassword;
  }



module.exports = { checkExistingEmail, hashPassword };