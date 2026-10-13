# Products API — Endpoint Integration

- **Feature:** Catálogo de productos
- **Base path:** `/api/products`
- **Authentication:** No requerida en este ejercicio.
- **Content-Type:** `application/json` para POST y PUT.

## 1. List products

- **Method + path:** `GET /api/products`
- **Parameters:** Query opcionales `search` (contiene, sin distinguir mayúsculas) y `category` (coincidencia exacta).
- **Body:** N/A.
- **Success:** `200 OK`, array de productos.
- **Errors:** Si no hay coincidencias, `200 OK` con `[]`.
- **App behavior:** Mostrar la lista, el estado vacío o el mensaje de que no hay resultados.

## 2. Get product

- **Method + path:** `GET /api/products/:id`
- **Parameters:** `id` numérico en la ruta.
- **Body:** N/A.
- **Success:** `200 OK`, objeto Product.
- **Errors:** `400` para ID no numérico; `404` para producto inexistente.
- **App behavior:** Mostrar el detalle o un mensaje de producto no encontrado.

## 3. Create product

- **Method + path:** `POST /api/products`
- **Parameters:** Ninguno.
- **Body:**
  ```json
  {
    "name": "Agua",
    "price": 2500,
    "category": "Bebidas",
    "stock": 10
  }
  ```
- **Success:** `201 Created`, producto creado con ID incremental.
- **Errors:** `400 Bad Request` con `{ "error": "mensaje", "details": ["..."] }` si la validación falla.
- **App behavior:** Validar campos, mostrar errores y regresar al catálogo al crear correctamente.

## 4. Update product

- **Method + path:** `PUT /api/products/:id`
- **Parameters:** `id` numérico en la ruta.
- **Body:** Objeto con `name`, `price`, `category` y `stock`, con las mismas reglas de validación que POST.
- **Success:** `200 OK`, producto actualizado.
- **Errors:** `400` para ID inválido o cuerpo incorrecto; `404` si no existe.
- **App behavior:** Mostrar los errores o volver al detalle al guardar correctamente.

## 5. Delete product

- **Method + path:** `DELETE /api/products/:id`
- **Parameters:** `id` numérico en la ruta.
- **Body:** N/A.
- **Success:** `204 No Content`, sin cuerpo.
- **Errors:** `400` para ID inválido; `404` si no existe.
- **App behavior:** Solicitar confirmación y volver a la lista después de eliminar.

## DTO to domain mapping

| API field | Domain field | Transform |
|---|---|---|
| `id` | `id` | Número |
| `name` | `name` | Texto |
| `price` | `price` | Número positivo; presentación COP |
| `category` | `category` | Una categoría permitida |
| `stock` | `stock` | Entero no negativo |

## Validation rules

- `name`: texto obligatorio, no vacío, máximo 60 caracteres.
- `price`: número mayor que cero.
- `category`: Bebidas, Snacks, Aseo u Hogar.
- `stock`: entero mayor o igual a cero.

## Error handling

Las respuestas de error usan `{ "error": "mensaje", "details": ["detalle"] }`. El cliente convierte las respuestas HTTP no exitosas en `ApiError` y presenta mensajes comprensibles. Los errores de conexión se manejan como fallos de red.

## Caching / offline

- **Strategy:** Online-only.
- **Cached entity:** N/A (almacenamiento en memoria).
- **TTL / invalidation:** N/A (almacenamiento en memoria).
