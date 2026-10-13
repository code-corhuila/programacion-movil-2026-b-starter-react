// @vitest-environment node
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { startTestServer } from '../../src/features/products/__tests__/test-server';

/**
 * Integration tests for the products API.
 * Author: Andrés Felipe Gómez Anacona.
 *
 * Each test starts a FRESH API instance on a free port (startTestServer), so the seed data is
 * intact and tests do not affect each other. supertest receives the base URL and sends real
 * HTTP requests, exactly as the mobile app would.
 *
 * Error handling (course rules):
 *  - 404 has two sources. (1) A route handler answers 404 when a valid numeric id matches no
 *    product. (2) The provided catch-all middleware answers 404 for an unknown route.
 *    Both use the uniform body { error, details[] }.
 *  - 500 comes from the provided central error handler, which Express runs when a handler
 *    throws or calls next(error). It hides internal details from the client and logs the real
 *    error on the server. The public routes are written not to throw, so a 500 cannot be
 *    triggered through them without changing the code; the parse-error test below exercises
 *    the same central handler, which turns malformed JSON into a 400 instead of a 500.
 *  - 400 is for client mistakes: a non-numeric id or an invalid body (validation errors are
 *    accumulated in `details`, one message per problem).
 */
let baseUrl = '';
let close: () => Promise<void>;

const validProduct = { name: 'Arroz 500 g', price: 3200, category: 'Hogar', stock: 40 };

beforeEach(async () => {
  ({ baseUrl, close } = await startTestServer());
});

afterEach(async () => {
  await close();
});

describe('GET /api/products', () => {
  it('returns the seed list with 200', async () => {
    const response = await request(baseUrl).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(8);
  });

  it('filters by partial, case-insensitive name and by exact category', async () => {
    const bySearch = await request(baseUrl).get('/api/products?search=AGUA');
    const byCategory = await request(baseUrl).get('/api/products?category=Aseo');
    const combined = await request(baseUrl).get('/api/products?search=jabón&category=Aseo');
    const none = await request(baseUrl).get('/api/products?category=aseo');

    expect(bySearch.body.map((p: { id: number }) => p.id)).toEqual([1]);
    expect(byCategory.body).toHaveLength(2);
    expect(combined.body.map((p: { id: number }) => p.id)).toEqual([7]);
    expect(none.status).toBe(200); // category is an exact match, so "aseo" finds nothing
    expect(none.body).toEqual([]);
  });
});

describe('GET /api/products/:id', () => {
  it('returns the product with 200', async () => {
    const response = await request(baseUrl).get('/api/products/3');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 3,
      name: 'Gaseosa cola 1,5 L',
      price: 4800,
      category: 'Bebidas',
      stock: 4,
    });
  });

  it('returns 404 when the product does not exist', async () => {
    const response = await request(baseUrl).get('/api/products/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Producto no encontrado', details: ['id 999'] });
  });

  it('returns 400 when the id is not numeric', async () => {
    const response = await request(baseUrl).get('/api/products/abc');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Identificador inválido');
  });
});

describe('POST /api/products', () => {
  it('returns 201 with the created product and an incremental id', async () => {
    const first = await request(baseUrl).post('/api/products').send(validProduct);
    const second = await request(baseUrl).post('/api/products').send(validProduct);

    expect(first.status).toBe(201);
    expect(first.body).toEqual({ id: 9, ...validProduct });
    expect(second.body.id).toBe(10);

    const fetched = await request(baseUrl).get('/api/products/9');
    expect(fetched.status).toBe(200);
  });

  it('trims the name and ignores an id sent in the body', async () => {
    const response = await request(baseUrl)
      .post('/api/products')
      .send({ ...validProduct, id: 1, name: '  Arroz 500 g  ' });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(9);
    expect(response.body.name).toBe('Arroz 500 g');
  });

  it('returns 400 with every validation problem in details', async () => {
    const response = await request(baseUrl)
      .post('/api/products')
      .send({ name: '   ', price: 0, category: 'Ropa', stock: -1 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Datos de producto inválidos',
      details: [
        'name es obligatorio',
        'price debe ser un número mayor que 0',
        'category debe ser una de: Bebidas, Snacks, Aseo, Hogar',
        'stock debe ser un entero mayor o igual que 0',
      ],
    });
  });

  it('rejects a name over 60 characters, a text price and a decimal stock', async () => {
    const response = await request(baseUrl)
      .post('/api/products')
      .send({ name: 'x'.repeat(61), price: '12', category: 'Snacks', stock: 2.5 });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual([
      'name no puede superar 60 caracteres',
      'price debe ser un número mayor que 0',
      'stock debe ser un entero mayor o igual que 0',
    ]);
  });

  it('returns 400 (not 500) when the body is not valid JSON', async () => {
    // Handled by the central error handler (see the header comment).
    const response = await request(baseUrl)
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send('{"name": ');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'El cuerpo no es un JSON válido', details: [] });
  });

  it('returns 400 when there is no body at all', async () => {
    const response = await request(baseUrl).post('/api/products');

    expect(response.status).toBe(400);
    expect(response.body.details).toHaveLength(4);
  });
});

describe('PUT /api/products/:id', () => {
  it('returns 200 with the updated product', async () => {
    const response = await request(baseUrl).put('/api/products/1').send(validProduct);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, ...validProduct });
  });

  it('returns 404 when the product does not exist', async () => {
    const response = await request(baseUrl).put('/api/products/999').send(validProduct);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto no encontrado');
  });

  it('returns 400 for a non-numeric id and for invalid data', async () => {
    const badId = await request(baseUrl).put('/api/products/abc').send(validProduct);
    const badBody = await request(baseUrl)
      .put('/api/products/1')
      .send({ ...validProduct, price: -5 });

    expect(badId.status).toBe(400);
    expect(badBody.status).toBe(400);
    expect(badBody.body.details).toEqual(['price debe ser un número mayor que 0']);
  });
});

describe('DELETE /api/products/:id', () => {
  it('returns 204 without a body, then 404 on the same id', async () => {
    const deleted = await request(baseUrl).delete('/api/products/2');
    const again = await request(baseUrl).get('/api/products/2');

    expect(deleted.status).toBe(204);
    expect(deleted.text).toBe('');
    expect(again.status).toBe(404);
  });

  it('returns 404 for a missing product and 400 for a non-numeric id', async () => {
    const missing = await request(baseUrl).delete('/api/products/999');
    const badId = await request(baseUrl).delete('/api/products/abc');

    expect(missing.status).toBe(404);
    expect(badId.status).toBe(400);
  });

  it('does not reuse the id of a deleted product', async () => {
    await request(baseUrl).delete('/api/products/8');
    const created = await request(baseUrl).post('/api/products').send(validProduct);

    expect(created.body.id).toBe(9);
  });
});

describe('unknown routes', () => {
  it('returns 404 with the uniform error format', async () => {
    const response = await request(baseUrl).get('/api/no-existe');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Ruta no encontrada',
      details: ['GET /api/no-existe'],
    });
  });
});