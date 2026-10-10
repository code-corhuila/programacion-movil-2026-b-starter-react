// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { startTestServer } from './test-server';

let baseUrl = '';
let close: () => Promise<void>;

beforeEach(async () => {
  ({ baseUrl, close } = await startTestServer());
});

afterEach(async () => {
  await close();
});

const validInput = {
  name: 'Producto de prueba',
  price: 2500,
  category: 'Snacks',
  stock: 10,
};

async function createProduct() {
  const response = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validInput),
  });

  expect(response.status).toBe(201);
  return response.json();
}

describe('Supplied 404 handler', () => {
  // Prueba de ejemplo del starter.
  it('responds with the error structure for an unknown route', async () => {
    const response = await fetch(`${baseUrl}/api/no-existe`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: expect.any(String),
      details: expect.any(Array),
    });
  });

  // Nueva prueba: verifica el mensaje y la ruta del manejador dado.
  it('includes the HTTP method and requested path in details', async () => {
    const response = await fetch(`${baseUrl}/api/unknown-catalog-route`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: 'Ruta no encontrada',
      details: ['GET /api/unknown-catalog-route'],
    });
  });
});

describe('GET /api/products', () => {
  it('returns the eight initial products', async () => {
    const response = await fetch(`${baseUrl}/api/products`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(8);
    expect(body[0]).toEqual({
      id: 1,
      name: 'Agua mineral 600 ml',
      price: 1800,
      category: 'Bebidas',
      stock: 120,
    });
  });

  it('combines case-insensitive search and exact category', async () => {
    const response = await fetch(
      `${baseUrl}/api/products?search=GASEOSA&category=Bebidas`,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.map((product: { id: number }) => product.id)).toEqual([3]);

    const mismatch = await fetch(
      `${baseUrl}/api/products?search=GASEOSA&category=Snacks`,
    );

    expect(mismatch.status).toBe(200);
    expect(await mismatch.json()).toEqual([]);
  });
});

describe('GET /api/products/:id', () => {
  it('returns an existing product', async () => {
    const response = await fetch(`${baseUrl}/api/products/1`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBe(1);
    expect(body.name).toBe('Agua mineral 600 ml');
  });

  it('returns 404 when the product does not exist', async () => {
    const response = await fetch(`${baseUrl}/api/products/99999`);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: 'Producto no encontrado',
      details: ['No existe un producto con id 99999'],
    });
  });

  it.each(['abc', '1.5', '-2'])('rejects the invalid id %s', async (id) => {
    const response = await fetch(`${baseUrl}/api/products/${id}`);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'ID inválido',
      details: ['id debe contener solo dígitos'],
    });
  });
});

describe('POST /api/products', () => {
  it('creates products with incremental ids', async () => {
    const first = await createProduct();
    const second = await createProduct();

    expect(first).toEqual({ id: 9, ...validInput });
    expect(second.id).toBe(10);

    const response = await fetch(`${baseUrl}/api/products/9`);
    expect(await response.json()).toEqual(first);
  });

  it('accumulates validation errors without changing the catalog', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '   ',
        price: 0,
        category: 'Otra',
        stock: -1,
      }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Datos inválidos',
      details: [
        'name es obligatorio',
        'price debe ser un número mayor que 0',
        'category debe ser Bebidas, Snacks, Aseo u Hogar',
        'stock debe ser un entero mayor o igual que 0',
      ],
    });

    const list = await fetch(`${baseUrl}/api/products`);
    expect(await list.json()).toHaveLength(8);
  });

  it('accepts zero stock', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validInput, stock: 0 }),
    });

    expect(response.status).toBe(201);
    expect((await response.json()).stock).toBe(0);
  });

  it('rejects a long name, a string price, and fractional stock', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validInput,
        name: 'a'.repeat(61),
        price: '2500',
        stock: 1.5,
      }),
    });

    expect(response.status).toBe(400);
    expect((await response.json()).details).toEqual([
      'name debe tener máximo 60 caracteres',
      'price debe ser un número mayor que 0',
      'stock debe ser un entero mayor o igual que 0',
    ]);
  });

  it('returns 400 for malformed JSON through the supplied handler', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name":',
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'El cuerpo no es un JSON válido',
      details: [],
    });
  });
});

describe('PUT /api/products/:id', () => {
  it('updates a product while preserving its id', async () => {
    const input = { ...validInput, name: 'Producto actualizado', stock: 0 };

    const response = await fetch(`${baseUrl}/api/products/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 1, ...input });

    const detail = await fetch(`${baseUrl}/api/products/1`);
    expect(await detail.json()).toEqual({ id: 1, ...input });
  });

  it('rejects invalid input without changing the product', async () => {
    const before = await fetch(`${baseUrl}/api/products/1`);
    const original = await before.json();

    const response = await fetch(`${baseUrl}/api/products/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validInput, price: -5 }),
    });

    expect(response.status).toBe(400);

    const after = await fetch(`${baseUrl}/api/products/1`);
    expect(await after.json()).toEqual(original);
  });

  it('returns 404 for a missing product', async () => {
    const response = await fetch(`${baseUrl}/api/products/99999`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validInput),
    });

    expect(response.status).toBe(404);
  });

  it('returns 400 for an invalid id', async () => {
    const response = await fetch(`${baseUrl}/api/products/abc`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validInput),
    });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/products/:id', () => {
  it('deletes a product and returns an empty 204 response', async () => {
    const response = await fetch(`${baseUrl}/api/products/1`, {
      method: 'DELETE',
    });

    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');

    const detail = await fetch(`${baseUrl}/api/products/1`);
    expect(detail.status).toBe(404);
  });

  it('does not reuse a deleted id for a new product', async () => {
    await fetch(`${baseUrl}/api/products/8`, { method: 'DELETE' });

    const product = await createProduct();
    expect(product.id).toBe(9);
  });

  it('returns 404 for a missing product', async () => {
    const response = await fetch(`${baseUrl}/api/products/99999`, {
      method: 'DELETE',
    });

    expect(response.status).toBe(404);
  });

  it('returns 400 for an invalid id', async () => {
    const response = await fetch(`${baseUrl}/api/products/abc`, {
      method: 'DELETE',
    });

    expect(response.status).toBe(400);
  });
});