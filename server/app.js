/**
 * API de productos (Express).
 *
 * createApp() construye la aplicación sin iniciar el servidor.
 * server/index.js inicia el servidor y las pruebas usan un puerto libre.
 *
 * Almacenamiento en memoria: se reinicia con el servidor.
 * Formato de error: { error: "mensaje", details: ["..."] }.
 */
const express = require('express');
const cors = require('cors');
const seedProducts = require('./data/products.json');

const CATEGORIES = ['Bebidas', 'Snacks', 'Aseo', 'Hogar'];

/**
 * Utilidad del starter.
 * Acepta identificadores que contienen solo dígitos.
 */
function parseId(rawId) {
  return /^\d+$/.test(rawId) ? Number(rawId) : null;
}

function createApp() {
  const app = express();

  // Configuración suministrada por el starter.
  app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
  app.use(express.json());

  const products = seedProducts.map((item) => ({ ...item }));
  let nextId = Math.max(0, ...products.map((product) => product.id)) + 1;

  // Validación compartida por POST y PUT.
  function validateInput(body) {
    const { name, price, category, stock } = body ?? {};
    const details = [];

    if (typeof name !== 'string' || name.trim() === '') {
      details.push('name es obligatorio');
    } else if (name.length > 60) {
      details.push('name debe tener máximo 60 caracteres');
    }

    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
      details.push('price debe ser un número mayor que 0');
    }

    if (!CATEGORIES.includes(category)) {
      details.push('category debe ser Bebidas, Snacks, Aseo u Hogar');
    }

    if (!Number.isInteger(stock) || stock < 0) {
      details.push('stock debe ser un entero mayor o igual que 0');
    }

    return details;
  }

  // Listar productos y aplicar ambos filtros cuando estén presentes.
  app.get('/api/products', (req, res) => {
    const { search, category } = req.query;

    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        typeof search !== 'string' ||
        product.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        typeof category !== 'string' ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });

    return res.status(200).json(filteredProducts);
  });

  // Consultar un producto.
  app.get('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'ID inválido',
        details: ['id debe contener solo dígitos'],
      });
    }

    const product = products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        details: [`No existe un producto con id ${id}`],
      });
    }

    return res.status(200).json(product);
  });

  // Crear un producto.
  app.post('/api/products', (req, res) => {
    const details = validateInput(req.body);

    if (details.length > 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details,
      });
    }

    const { name, price, category, stock } = req.body;

    const product = {
      id: nextId,
      name: name.trim(),
      price,
      category,
      stock,
    };

    nextId += 1;
    products.push(product);

    return res.status(201).json(product);
  });

  // Actualizar todos los campos editables de un producto.
  app.put('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'ID inválido',
        details: ['id debe contener solo dígitos'],
      });
    }

    const index = products.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        details: [`No existe un producto con id ${id}`],
      });
    }

    const details = validateInput(req.body);

    if (details.length > 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details,
      });
    }

    const { name, price, category, stock } = req.body;

    const updatedProduct = {
      id,
      name: name.trim(),
      price,
      category,
      stock,
    };

    products[index] = updatedProduct;

    return res.status(200).json(updatedProduct);
  });

  // Eliminar un producto; 204 no tiene cuerpo.
  app.delete('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'ID inválido',
        details: ['id debe contener solo dígitos'],
      });
    }

    const index = products.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        details: [`No existe un producto con id ${id}`],
      });
    }

    products.splice(index, 1);

    return res.status(204).end();
  });

  // Manejador 404 suministrado por el starter.
  app.use((req, res) => {
    res.status(404).json({
      error: 'Ruta no encontrada',
      details: [`${req.method} ${req.originalUrl}`],
    });
  });

  // Manejador central suministrado por el starter.
  // Express requiere cuatro parámetros para reconocerlo.
  // eslint-disable-next-line no-unused-vars -- Express exige los 4 parámetros para reconocerlo.
  app.use((err, _req, res, _next) => {
    if (err && err.type === 'entity.parse.failed') {
      return res.status(400).json({
        error: 'El cuerpo no es un JSON válido',
        details: [],
      });
    }

    console.error(err);

    return res.status(500).json({
      error: 'Error interno del servidor',
      details: [],
    });
  });

  return app;
}

module.exports = { createApp, CATEGORIES, parseId };