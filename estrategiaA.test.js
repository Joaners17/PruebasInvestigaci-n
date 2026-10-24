// estrategiaA.test.js - Enfoque de Pirámide (Unitaria)

// Función pura de lógica interna del carrito
function calcularTotalCarrito(items) {
  return items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
}

describe('Estrategia A: Pruebas Unitarias (Pirámide de Pruebas)', () => {
  it('Debe calcular el total del carrito de forma aislada sin tocar servidores', () => {
    const itemsPrueba = [
      { productoId: 'P01', precio: 500, cantidad: 2 },
      { productoId: 'P02', precio: 250, cantidad: 1 }
    ];

    const total = calcularTotalCarrito(itemsPrueba);
    
    // Verificación matemática directa
    expect(total).toBe(1250);
  });
});