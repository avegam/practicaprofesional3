const request = require('supertest');
const express = require('express');
const app = express();
const productoModel = require('../modelos/producto.js'); 

// Configuración básica del servidor Express para pruebas
app.get('/detalle/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const documento = await productoModel.findById(id);
    if (!documento) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(documento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});


// Ejemplo de prueba con Jest y supertest
//test suite
describe('GET /detalle/:id', () => {
    //prueba 1
  it('debería devolver el producto con el ID correcto', async () => {
    // Supongamos que tienes una función de prueba en tu modelo que simula la búsqueda por ID
    productoModel.findById = jest.fn().mockResolvedValue({ id: 1, nombre: 'serum capilar' });

    const response = await request(app).get('/detalle/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, nombre: 'serum capilar' });
    console.log("prueba 1: ")
    console.log(response.body)
  });
//prueba 2
  it('debería devolver 404 si el producto no existe', async () => {
    productoModel.findById = jest.fn().mockResolvedValue(null);

    const response = await request(app).get('/detalle/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ mensaje: 'Producto no encontrado' });
    console.log("prueba 2: ")
    console.log(response.body)
  });
//prueba 3
  it('debería devolver 500 en caso de error en la base de datos', async () => {
    productoModel.findById = jest.fn().mockRejectedValue(new Error('Error de base de datos'));

    const response = await request(app).get('/detalle/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error al obtener datos desde la base de datos' });
    console.log("prueba 3: ")
    console.log(response.body)
  });
});
