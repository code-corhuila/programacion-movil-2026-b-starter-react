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

describe('API de productos', () => {
  it('responde 404 con el formato de error en una ruta desconocida', async () => {
    const response = await fetch(`${baseUrl}/api/no-existe`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: expect.any(String),
      details: expect.any(Array),
    });
  });

  it('responde 400 cuando los datos del producto son inválidos', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        price: 0,
        category: 'Otra',
        stock: -1,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toEqual(expect.any(String));
    expect(body.details.length).toBeGreaterThan(0);
  });

  it('responde 404 cuando el producto no existe', async () => {
    const response = await fetch(`${baseUrl}/api/products/9999`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toEqual(expect.any(String));
    expect(body.details).toEqual(expect.any(Array));
  });
});
