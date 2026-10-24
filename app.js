const express = require('express');
const app = express();
app.use(express.json());

// Base de datos simulada en memoria
let usuarios = [];
let productos = [
  { id: 'P01', nombre: 'Laptop Gamer', precio: 800, stock: 5 },
  { id: 'P02', nombre: 'Mouse Inalámbrico', precio: 25, stock: 20 }
];
let carrito = [];
let transacciones = [];

// 1. Crear una cuenta
app.post('/api/registro', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }
  usuarios.push({ email, password });
  return res.status(201).json({ mensaje: 'Cuenta creada exitosamente' });
});

// 2. Iniciar sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = usuarios.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token: 'fake-jwt-token-xyz' });
});

// 3. Consultar productos
app.get('/api/productos', (req, res) => {
  return res.status(200).json(productos);
});

// 4. Agregar productos al carrito
app.post('/api/carrito', (req, res) => {
  const { productoId, cantidad } = req.body;
  const prod = productos.find(p => p.id === productoId);
  if (!prod || prod.stock < cantidad) {
    return res.status(400).json({ error: 'Producto no disponible o stock insuficiente' });
  }
  carrito.push({ productoId, nombre: prod.nombre, precio: prod.precio, cantidad });
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  return res.status(200).json({ mensaje: 'Producto agregado al carrito', carrito, total });
});

// 5. Modificar cantidades en el carrito
app.put('/api/carrito/:productoId', (req, res) => {
  const { productoId } = req.params;
  const { nuevaCantidad } = req.body;
  const item = carrito.find(i => i.productoId === productoId);
  if (!item) {
    return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
  }
  item.cantidad = nuevaCantidad;
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  return res.status(200).json({ mensaje: 'Cantidad modificada con éxito', carrito, total });
});

// 6. Realizar el pago
app.post('/api/pago', (req, res) => {
  if (carrito.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const transaccionId = 'TX-' + Math.floor(Math.random() * 1000000);

  transacciones.push({ transaccionId, items: [...carrito], total, estado: 'APROBADO' });
  carrito = []; // Se limpia el carrito tras la compra

  return res.status(200).json({ mensaje: 'Pago procesado exitosamente', transaccionId, total });
});

// 7. Recibir confirmación de compra
app.get('/api/compra/confirmacion/:transaccionId', (req, res) => {
  const { transaccionId } = req.params;
  const transaccion = transacciones.find(t => t.transaccionId === transaccionId);
  if (!transaccion) {
    return res.status(404).json({ error: 'Transacción no encontrada' });
  }
  return res.status(200).json({
    mensaje: '¡Gracias por su compra!',
    detalle: transaccion
  });
});

module.exports = app;