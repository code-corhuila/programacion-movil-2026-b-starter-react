# Screen — Lista de productos

- **Route:** `/productos`
- **Feature:** [Productos](../features/productos.md)
- **Component:** `ProductListPage` (`src/features/products/presentation/ProductListPage.tsx`)
- **Design reference:** N/A (se usan los componentes estándar de Ionic)

---

## Purpose

Mostrar el catálogo completo y permitir localizar productos por nombre o por categoría. Es el punto de entrada de la app: desde aquí se abre un detalle o se crea un producto.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` + `IonTitle` | Título «Productos». |
| Búsqueda | `IonInput` | Filtra por nombre mientras se escribe; sin distinguir mayúsculas. |
| Filtro de categoría | Cinco `IonButton`: «Todas», «Bebidas», «Snacks», «Aseo», «Hogar» | Una variable de estado `category`; el botón activo se muestra relleno (`fill="solid"`), los demás en contorno. «Todas» = cadena vacía. |
| Body | `IonList` con un `ProductCard` por producto | Cada tarjeta muestra nombre, categoría, precio (`formatCOP`) y etiqueta de stock; resalta «Pocas unidades» y «Agotado». |
| Estados | `EmptyState` | Vacío, sin resultados y error. |
| CTA | `IonButton` «Nuevo producto» | Navega a `/productos/nuevo`. |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | `status = 'loading'` al abrir, al reintentar o al volver a la pantalla | Texto «Cargando productos…». |
| Loaded | `getProducts()` responde con al menos un producto y los filtros coinciden | Lista de `ProductCard`. |
| Empty | La API devuelve `[]` y no hay filtros activos | `EmptyState`: «No hay productos», con acción «Nuevo producto». |
| Sin resultados | Hay productos, pero `filterProducts` devuelve `[]` | `EmptyState`: «Sin resultados», con acción «Limpiar filtros» (búsqueda vacía y categoría «Todas»). |
| Error | `getProducts()` lanza `ApiError` (red o 5xx) | `EmptyState`: «No se pudo cargar» + mensaje de `getErrorMessage` + botón «Reintentar». |
| Offline | Sin conexión con la API | Se trata como Error (`ApiError.isNetworkError`); no hay datos en caché. |

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Escribir en el buscador | Se actualiza `search` y la lista visible se recalcula con `filterProducts` | Filtrado en memoria, sin nueva petición |
| Tocar un botón de categoría | Se actualiza `category` y se recalcula la lista | Filtrado en memoria |
| Tocar una tarjeta | Navega a `/productos/:id` | `onSelect(id)` → `history.push` |
| Tocar «Nuevo producto» | Navega a `/productos/nuevo` | — |
| Tocar «Reintentar» | Vuelve a `loading` y repite la petición | `getProducts()` |
| Volver desde detalle o formulario | Recarga la lista (refleja altas, cambios y bajas) | `useIonViewWillEnter` → `getProducts()` |

---

## Accessibility

- [ ] El buscador y los botones de categoría tienen etiqueta accesible (`label` / texto visible).
- [ ] Objetivos táctiles ≥ 44×44 pt (botones de categoría y tarjetas).
- [ ] El aviso de stock no depende solo del color: incluye texto («Pocas unidades», «Agotado»).
- [ ] El texto escala con el tamaño de fuente del sistema.
- [ ] Contraste conforme a WCAG AA.
