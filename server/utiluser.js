const saltRounds = 10;
const bcrypt = require('bcrypt');


  
  // Función para hashear el password
  async function hashPassword(user) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    return hashedPassword;
  }



module.exports =  hashPassword;