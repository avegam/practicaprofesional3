// Conexion Base de datos Mongo 
const mongoose=require('mongoose')

const ContactoSchema = mongoose.Schema({
    Telefono: String,
    Email: String,
    Ubicacion: String,
    Contacto: String

  })
  
  const contactoModel= mongoose.model('contacto',ContactoSchema);

  module.exports = contactoModel;