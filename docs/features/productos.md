# Feature — Productos

- **Owner:** Andres Felipe Gomez Anacona
- **Status:** In progress
- **Related stories:** CRUD de productos (Parcial C2, Parte 3)

---

## Purpose

Permitir que una persona consulte, busque, cree, edite y elimine productos de un catálogo desde el celular, con datos servidos por una API Express que guarda todo en memoria.

---

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Lista de productos | `/productos` | Ver el catálogo, buscar por nombre, filtrar por categoría y ir a crear o a un detalle. |
| Detalle de producto | `/productos/:id` | Ver todos los campos de un producto, ir a editarlo o eliminarlo. |
| Nuevo producto | `/productos/nuevo` | Crear un producto con validación en línea. |
| Editar producto | `/productos/:id/editar` | Modificar un producto existente (mismo formulario, campos precargados). |

> `:id` está restringido a dígitos en `App.tsx` (`:id(\d+)`) para que `/productos/nuevo` no active la ruta de detalle.
> Especificaciones: [lista](../screens/lista.md) · [detalle](../screens/detalle.md) · [formulario](../screens/formulario.md).

---

## State

- **Pattern:** estado local por pantalla con `useState` + `useEffect` (sin store global). Ver [ADR-001](../decisions/ADR-001-estado.md).
- **State object(s):**
  - Lista: `products: Product[]`, `status: 'loading' | 'ready' | 'error'`, `errorMessage: string`, `search: string`, `category: string`.
  - Detalle: `product: Product | null`, `status`, `errorMessage`, `isConfirmingDelete: boolean`.
  - Formulario: `name`, `price`, `category`, `stock` (campos controlados), `errors: Partial<Record<ProductField, string>>`, `serverError`, `serverDetails: string[]`, `isSaving: boolean`.
- **Key transitions:**
  - Lista: `loading → ready` (éxito) · `loading → error` (fallo) · `error → loading` (Reintentar) · `ready → loading` (al volver a la pantalla, con `useIonViewWillEnter`).
  - Detalle: `loading → ready | error`; `ready → isConfirmingDelete → (confirmar) eliminado → navega a /productos`.
  - Formulario: `editando → validando → guardando → navega a /productos`; si falla la validación local o el servidor responde 400, vuelve a `editando` mostrando los mensajes.
- **Derivados (no se guardan en estado):** la lista visible se calcula con `filterProducts(products, { search, category })` y cada producto se presenta con `toProductView()`.

---

## Data

- **Capas:** `presentation → domain` y `presentation → data`; `data → domain`; `domain` no depende de nada.
- **Domain:** tipos `Product`, `ProductInput`, `ProductView`; `validateProduct`, `toProductView`, `filterProducts`, `formatCOP`.
- **Data:** `products-api.ts` (`getProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`), `ApiError`, `getErrorMessage`, `API_URL`.
- **Remote sources / endpoints:** ver [products-endpoints.md](../api/products-endpoints.md):
  - `GET /api/products?search=&category=`
  - `GET /api/products/:id`
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
- **Local persistence:** N/A. La app no cachea; el servidor guarda en memoria y se reinicia con los datos semilla (`server/data/products.json`, 8 productos) al reiniciar.

---

## Edge cases & states

- [x] **Loading:** indicador de carga en lista y detalle; botón «Guardar» deshabilitado mientras `isSaving`.
- [x] **Empty:** la API no tiene productos → `EmptyState` con acción «Nuevo producto».
- [x] **Sin resultados:** hay productos pero el buscador/categoría no coinciden con ninguno → `EmptyState` con acción para limpiar filtros.
- [x] **Error / retry:** servidor caído o error 5xx → mensaje de `getErrorMessage` y botón «Reintentar».
- [x] **No encontrado:** `GET /:id` o `PUT /:id` responde 404 (p. ej. el producto fue eliminado) → mensaje «No encontramos ese producto.» y regreso a la lista.
- [x] **Validación:** el formulario muestra el error junto a cada campo; si el servidor responde 400, muestra `error` y cada elemento de `details`.
- [x] **Stock:** `stock = 0` → «Agotado»; `1–4` → «Pocas unidades» con aviso visible; `≥ 5` → «Disponible».
- [x] **Doble envío:** se ignora un segundo toque en «Guardar» o «Confirmar» mientras hay una petición en curso.
- [ ] **Offline:** fuera de alcance. Sin conexión se trata como error de red (`ApiError` con `status = null`).
- [ ] **Permission denied:** no aplica (la API no tiene autenticación).

---

## Decisions

- [ADR-001 — Manejo de estado](../decisions/ADR-001-estado.md)
- [ADR-002 — Consumo de la API](../decisions/ADR-002-consumo-api.md)

---

## Tests

- **Unit (domain):** `validateProduct` (nombre vacío o de más de 60 caracteres, precio ≤ 0 o no finito, categoría fuera de lista, stock negativo o decimal), `toProductView` (formato de precio y etiquetas de stock en 0, 4 y 5), `filterProducts` (búsqueda sin distinguir mayúsculas, categoría exacta, texto vacío, no muta el original).
- **API (Vitest + `startTestServer()`):** `POST` inválido → 400 con `details`; `GET /:id` inexistente → 404; `GET /:id` no numérico → 400; `POST` válido → 201 e id incremental; `DELETE` → 204 y luego 404; ruta desconocida → 404 con formato `{ error, details }`.
- **Widget/UI:** no previsto en este parcial; la verificación de pantallas es manual (lista con servidor apagado para ver el estado de error, crear, editar y eliminar de punta a punta).
