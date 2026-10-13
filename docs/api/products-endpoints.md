# Endpoint Integration — Productos (`/api/products`)

- **Feature:** [Productos](../features/productos.md)
- **Base URL:** `API_URL` (por defecto `http://localhost:3000`)
- **Auth required:** No
- **Formato:** JSON (`Content-Type: application/json`) en peticiones con cuerpo y en respuestas
- **Entidad:** [`Product`](./product-entity.md)
- **Cliente:** `src/features/products/data/products-api.ts`

## Formato de error (todos los endpoints)

```json
{ "error": "Datos de producto inválidos", "details": ["price debe ser un número mayor que 0"] }
```

`error` es un mensaje corto y `details` es un arreglo de mensajes (puede ir vacío). Una ruta desconocida responde `404` y un fallo inesperado `500`, con el mismo formato.

## Resumen

| Método y ruta | Función del cliente | Éxito | Errores |
|---------------|--------------------|-------|---------|
| `GET /api/products` | `getProducts(query)` | 200 + arreglo | — |
| `GET /api/products/:id` | `getProduct(id)` | 200 + objeto | 400 · 404 |
| `POST /api/products` | `createProduct(input)` | 201 + objeto creado | 400 |
| `PUT /api/products/:id` | `updateProduct(id, input)` | 200 + objeto actualizado | 400 · 404 |
| `DELETE /api/products/:id` | `deleteProduct(id)` | 204 sin cuerpo | 400 · 404 |

---

## 1. Listar productos

**`GET /api/products`**

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `search` | query | string | No | El nombre contiene el texto, sin distinguir mayúsculas. Vacío = sin filtro. |
| `category` | query | string | No | Coincidencia exacta con la categoría. Una categoría inexistente devuelve `[]`. |

Los dos filtros se combinan con AND.

**Success (200):**
```json
[
  { "id": 1, "name": "Agua mineral 600 ml", "price": 1800, "category": "Bebidas", "stock": 120 },
  { "id": 3, "name": "Gaseosa cola 1,5 L", "price": 4800, "category": "Bebidas", "stock": 4 }
]
```

Sin coincidencias devuelve `200` con `[]` (no es un error).

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 5xx / red | Servidor no disponible | Estado de error con «Reintentar» |

---

## 2. Obtener un producto

**`GET /api/products/:id`**

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | integer | Yes | Solo dígitos. `abc`, `1.5` o `-2` no son válidos. |

**Success (200):**
```json
{ "id": 3, "name": "Gaseosa cola 1,5 L", "price": 4800, "category": "Bebidas", "stock": 4 }
```

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | `id` no numérico: `{ "error": "Identificador inválido", "details": ["El id debe ser numérico"] }` | Mensaje de error en el detalle |
| 404 | No existe: `{ "error": "Producto no encontrado", "details": ["id 99"] }` | «No encontramos ese producto.» y volver a la lista |
| 5xx / red | Servidor no disponible | Estado de error con «Reintentar» |

---

## 3. Crear un producto

**`POST /api/products`**

**Body:** todos los campos son obligatorios; el `id` no se envía (si llega, se ignora).
```json
{ "name": "Arroz 500 g", "price": 3200, "category": "Hogar", "stock": 40 }
```

**Success (201):** el objeto creado, con `id` incremental asignado por el servidor.
```json
{ "id": 9, "name": "Arroz 500 g", "price": 3200, "category": "Hogar", "stock": 40 }
```

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | Validación fallida o JSON malformado. `details` trae un mensaje por problema. | El formulario muestra `error` y cada `details`; conserva lo escrito |
| 5xx / red | Servidor no disponible | Mensaje de `getErrorMessage`; conserva lo escrito |

Ejemplo de 400:
```json
{
  "error": "Datos de producto inválidos",
  "details": [
    "name es obligatorio",
    "price debe ser un número mayor que 0",
    "category debe ser una de: Bebidas, Snacks, Aseo, Hogar",
    "stock debe ser un entero mayor o igual que 0"
  ]
}
```

---

## 4. Actualizar un producto

**`PUT /api/products/:id`**

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | integer | Yes | Solo dígitos. |

**Body:** reemplazo completo; mismos campos y reglas que en `POST`. El `id` del cuerpo, si llega, se ignora: manda el de la ruta.
```json
{ "name": "Arroz 500 g", "price": 3500, "category": "Hogar", "stock": 35 }
```

**Success (200):** el objeto ya actualizado.
```json
{ "id": 9, "name": "Arroz 500 g", "price": 3500, "category": "Hogar", "stock": 35 }
```

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | `id` no numérico o cuerpo inválido (con `details`) | Mensajes en el formulario |
| 404 | No existe un producto con ese `id` | «No encontramos ese producto.» y volver a la lista |
| 5xx / red | Servidor no disponible | Mensaje de `getErrorMessage`; conserva lo escrito |

---

## 5. Eliminar un producto

**`DELETE /api/products/:id`**

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | integer | Yes | Solo dígitos. |

**Body:** ninguno.

**Success (204):** sin cuerpo. `request()` devuelve `undefined`.

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | `id` no numérico | Mensaje de error en el detalle |
| 404 | No existe (p. ej. ya fue eliminado) | «No encontramos ese producto.» |
| 5xx / red | Servidor no disponible | Mensaje de error; el producto sigue visible |

Tras un `204` la app navega a `/productos`, que se recarga.

---

## Errores comunes (todos los endpoints)

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | JSON malformado en el cuerpo: `{ "error": "El cuerpo no es un JSON válido", "details": [] }` | Mensaje del servidor |
| 404 | Ruta desconocida: `{ "error": "Ruta no encontrada", "details": ["GET /api/xyz"] }` | No ocurre en uso normal |
| 500 | Error inesperado: `{ "error": "Error interno del servidor", "details": [] }` | Mensaje del servidor + «Reintentar» |
| sin respuesta | La API no está en ejecución | `ApiError` con `status = null`: «No fue posible conectar con el servidor…» |

---

## Caching / offline

- **Strategy:** online-only. No hay caché ni cola de escrituras.
- **Cached entity:** N/A (almacenamiento en memoria en el servidor; la app no guarda nada local).
- **TTL / invalidation:** N/A. La lista se vuelve a pedir cada vez que se entra a la pantalla.
