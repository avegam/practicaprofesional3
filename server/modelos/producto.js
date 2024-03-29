// Conexion Base de datos Mongo 
const mongoose=require('mongoose')

// Define el esquema de producto en la base de datos 
const ProductoSchema = mongoose.Schema({
    nombre: String,
    precio: String,
    imagen: String,
    stock: String,
    ingredientes: String,
    uso: String
  })
  
  const productoModel= mongoose.model('productos',ProductoSchema);

  module.exports = productoModel;
  