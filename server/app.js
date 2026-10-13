
const express = require('express');
const cors = require('cors');
const seedProducts = require('./data/products.json');

const CATEGORIES = ['Bebidas', 'Snacks', 'Aseo', 'Hogar'];

function parseId(rawId) {
  return /^\d+$/.test(rawId) ? Number(rawId) : null;
}

function validarProducto(datos) {
  const detalles = [];

  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return {
      detalles: ['Debes enviar los datos del producto en formato JSON.']
    };
  }

  if (typeof datos.name !== 'string' || datos.name.trim().length === 0) {
    detalles.push('El nombre es obligatorio.');
  } else if (datos.name.trim().length > 60) {
    detalles.push('El nombre no puede superar los 60 caracteres.');
  }

  if (typeof datos.price !== 'number' || !Number.isFinite(datos.price) || datos.price <= 0) {
    detalles.push('El precio debe ser un número mayor que cero.');
  }

  if (typeof datos.category !== 'string' || !CATEGORIES.includes(datos.category)) {
    detalles.push('La categoría debe ser Bebidas, Snacks, Aseo u Hogar.');
  }

  if (!Number.isInteger(datos.stock) || datos.stock < 0) {
    detalles.push('El inventario debe ser un número entero mayor o igual a cero.');
  }

  return { detalles };
}

function createApp() {
  const app = express();
  const products = seedProducts.map((producto) => ({ ...producto }));
  let siguienteId = Math.max(0, ...products.map((producto) => producto.id)) + 1;

  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
  }));

  app.use(express.json());

  app.get('/api/products', (req, res) => {
    const busqueda = typeof req.query.search === 'string'
      ? req.query.search.trim().toLowerCase()
      : '';

    const categoria = typeof req.query.category === 'string'
      ? req.query.category
      : '';

    const resultado = products.filter((producto) => {
      const coincideNombre = producto.name.toLowerCase().includes(busqueda);
      const coincideCategoria = !categoria || producto.category === categoria;

      return coincideNombre && coincideCategoria;
    });

    return res.status(200).json(resultado);
  });

  app.get('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'Identificador inválido.',
        details: ['El identificador debe contener únicamente números.']
      });
    }

    const producto = products.find((item) => item.id === id);

    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado.',
        details: [`No existe un producto con el identificador ${id}.`]
      });
    }

    return res.status(200).json(producto);
  });

  app.post('/api/products', (req, res) => {
    const { detalles } = validarProducto(req.body);

    if (detalles.length > 0) {
      return res.status(400).json({
        error: 'Los datos del producto no son válidos.',
        details: detalles
      });
    }

    const producto = {
      id: siguienteId++,
      name: req.body.name.trim(),
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock
    };

    products.push(producto);

    return res.status(201).json(producto);
  });

  app.put('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'Identificador inválido.',
        details: ['El identificador debe contener únicamente números.']
      });
    }

    const indice = products.findIndex((producto) => producto.id === id);

    if (indice === -1) {
      return res.status(404).json({
        error: 'Producto no encontrado.',
        details: [`No existe un producto con el identificador ${id}.`]
      });
    }

    const { detalles } = validarProducto(req.body);

    if (detalles.length > 0) {
      return res.status(400).json({
        error: 'Los datos del producto no son válidos.',
        details: detalles
      });
    }

    const productoActualizado = {
      id,
      name: req.body.name.trim(),
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock
    };

    products[indice] = productoActualizado;

    return res.status(200).json(productoActualizado);
  });

  app.delete('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'Identificador inválido.',
        details: ['El identificador debe contener únicamente números.']
      });
    }

    const indice = products.findIndex((producto) => producto.id === id);

    if (indice === -1) {
      return res.status(404).json({
        error: 'Producto no encontrado.',
        details: [`No existe un producto con el identificador ${id}.`]
      });
    }

    products.splice(indice, 1);

    return res.status(204).end();
  });

  app.use((req, res) => {
    res.status(404).json({
      error: 'Ruta no encontrada.',
      details: [`${req.method} ${req.originalUrl}`]
    });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err && err.type === 'entity.parse.failed') {
      return res.status(400).json({
        error: 'El cuerpo no es un JSON válido.',
        details: []
      });
    }

    console.error(err);

    return res.status(500).json({
      error: 'Error interno del servidor.',
      details: []
    });
  });

  return app;
}

module.exports = { createApp, CATEGORIES, parseId };
