// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { startTestServer } from './test-server';

/**
 * Prueba de la API de EJEMPLO (ya viene dada). Patrón que se espera en las pruebas de la API:
 *  1. `startTestServer()` levanta la API en un puerto libre antes de cada prueba.
 *  2. `fetch` (el de Node, sin dependencias extra) llama a la API como lo haría la app.
 *  3. Se comprueba el código de estado y el cuerpo.
 *  4. `close()` cierra el servidor al terminar.
 */
let baseUrl = '';
let close: () => Promise<void>;

beforeEach(async () => {
  ({ baseUrl, close } = await startTestServer());
});

afterEach(async () => {
  await close();
});

describe('API de productos (ejemplo)', () => {
  it('arranca y responde 404 con el formato de error en una ruta desconocida', async () => {
    const response = await fetch(`${baseUrl}/api/no-existe`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: expect.any(String), details: expect.any(Array) });
  });
});

/**
 * TODO(Parte 5): agregue sus pruebas de la API aquí, con el mismo patrón. Mínimo dos, por ejemplo:
 * POST con datos inválidos → 400 con `details`, y GET de un id inexistente → 404.
 */
describe('POST /api/products', () => {
  it('responde 400 con { error, details } cuando los datos no validan', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        price: 0,
        category: 'Otra',
        stock: -1,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Datos inválidos');
    expect(Array.isArray(body.details)).toBe(true);
    expect(body.details.length).toBeGreaterThanOrEqual(4);
  });
});

describe('GET /api/products/:id', () => {
  it('responde 404 cuando el producto no existe', async () => {
    const response = await fetch(`${baseUrl}/api/products/9999`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: 'Producto no encontrado',
      details: ['No existe un producto con id 9999'],
    });
  });
});