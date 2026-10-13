# Entity — Product

- **Store:** N/A, almacenamiento en memoria (arreglo en `createApp()`, inicializado desde `server/data/products.json`)
- **Table/collection:** N/A (almacenamiento en memoria)
- **Schema version introduced:** N/A (almacenamiento en memoria)
- **Tipos:** `Product` y `ProductInput` en `src/features/products/domain/product.ts`
- **Recurso HTTP:** `/api/products` — ver [products-endpoints.md](./products-endpoints.md)

---

## Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | number (entero) | Sí (lo asigna el servidor) | Incremental. No se envía en `POST`; en `PUT` manda el de la ruta. No se reutiliza tras un `DELETE`. |
| `name` | string | Sí | Sin espacios sobrantes en los extremos; no vacío; máximo 60 caracteres. |
| `price` | number | Sí | Mayor que 0. Se interpreta como pesos colombianos (COP). |
| `category` | string | Sí | Una de: `Bebidas`, `Snacks`, `Aseo`, `Hogar`. |
| `stock` | number (entero) | Sí | Mayor o igual que 0. |

Ejemplo:
```json
{ "id": 1, "name": "Agua mineral 600 ml", "price": 1800, "category": "Bebidas", "stock": 120 }
```

---

## Validation rules

Se aplican en el servidor (POST y PUT) y, con las mismas reglas, en el cliente con `validateProduct()`.

| Field | Rule | Mensaje de la API (`details`) |
|-------|------|-------------------------------|
| `name` | Texto, no vacío tras quitar espacios, ≤ 60 caracteres | `name es obligatorio` · `name no puede superar 60 caracteres` |
| `price` | Número finito y > 0 (un texto como `"12"` no es válido) | `price debe ser un número mayor que 0` |
| `category` | Debe pertenecer a `CATEGORIES` | `category debe ser una de: Bebidas, Snacks, Aseo, Hogar` |
| `stock` | Entero y ≥ 0 (`2.5` y `-1` no son válidos) | `stock debe ser un entero mayor o igual que 0` |

Si hay varios problemas, `details` incluye un mensaje por cada uno y la respuesta es `400`.

---

## Derived values (solo en la app)

`toProductView()` produce el `ProductView` que se muestra en pantalla:

| Campo de vista | Regla |
|----------------|-------|
| `priceLabel` | `formatCOP(price)` → p. ej. `$ 1.800`, `$ 189.900` |
| `stockLabel` | `Agotado` si `stock = 0` · `Pocas unidades` si `0 < stock < 5` · `Disponible` si `stock ≥ 5` |
| `isOutOfStock` | `stock === 0` |
| `isLowStock` | `0 < stock < LOW_STOCK_THRESHOLD` (umbral = 5) |

---

## Indexes

N/A (almacenamiento en memoria). La búsqueda recorre el arreglo completo.

---

## Relationships

N/A. `Product` es una entidad independiente; `category` es un valor de una lista fija, no una entidad relacionada.

---

## Sync

- **Synced?** N/A (almacenamiento en memoria)
- **Conflict policy:** N/A (almacenamiento en memoria). Con escrituras simultáneas gana la última recibida.

---

## Persistence & migration notes

N/A, almacenamiento en memoria. Los datos creados, editados o eliminados se pierden al reiniciar el servidor, que vuelve a cargar los 8 productos semilla. No hay migraciones ni versionado de esquema.
