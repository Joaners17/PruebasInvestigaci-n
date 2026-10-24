const request = require('supertest');
const app = require('./app');

describe('Pruebas de Integración - Sistema de Ventas (Testing Trophy)', () => {
  
  it('Debería agregar un producto al carrito y retornar el total correctamente', async () => {
    const response = await request(app)
      .post('/api/carrito')
      .send({ productoId: 'P01', cantidad: 1 }); // Usamos el ID P01 que existe en app.js

    expect(response.statusCode).toBe(200);
    expect(response.body.carrito.length).toBe(1);
    expect(response.body.total).toBe(800); // 800 * 1
  });

});