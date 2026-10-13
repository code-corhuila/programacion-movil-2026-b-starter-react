# Screen — Formulario de producto (crear y editar)

- **Routes:** `/productos/nuevo` (crear) · `/productos/:id/editar` (editar)
- **Feature:** [Productos](../features/productos.md)
- **Component:** `ProductFormPage` (`src/features/products/presentation/ProductFormPage.tsx`)
- **Design reference:** N/A (componentes estándar de Ionic)

---

## Purpose

Capturar los datos de un producto para crearlo o modificarlo. Una sola pantalla atiende ambas rutas: si la ruta trae `id`, está en modo edición (`isEditing = true`) y precarga los campos.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` + `IonBackButton` + `IonTitle` | Título «Nuevo producto» o «Editar producto» según `isEditing`. |
| Campo Nombre | `IonInput` (texto) | Obligatorio, máximo 60 caracteres. |
| Campo Precio | `IonInput` (`type="number"`) | Número mayor que 0. |
| Campo Categoría | Cuatro `IonButton`, uno por elemento de `CATEGORIES` | Selección única; el seleccionado se muestra relleno. |
| Campo Stock | `IonInput` (`type="number"`) | Entero mayor o igual que 0. |
| Mensajes de campo | Texto de error bajo cada campo | Provienen de `validateProduct().errors`. |
| Error del servidor | Bloque de texto con `error` y la lista de `details` | Solo si la API responde 400. |
| CTA | `IonButton` «Guardar» | Deshabilitado mientras `isSaving`. |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Cargando datos (solo edición) | `getProduct(Number(id))` en curso | Texto «Cargando producto…»; formulario oculto. |
| Editando | Datos listos (o formulario vacío en modo crear) | Campos habilitados y «Guardar» activo. |
| Error de validación local | `validateProduct()` devuelve `isValid = false` al pulsar «Guardar» | Mensaje bajo cada campo inválido; no se envía nada a la API. |
| Guardando | `createProduct` / `updateProduct` en curso | «Guardar» deshabilitado. |
| Rechazo del servidor | `ApiError` 400 | Se muestran `error` y cada `details`; los datos escritos se conservan. |
| No encontrado (solo edición) | `getProduct` o `updateProduct` responden 404 | «No encontramos ese producto.» y botón para volver a la lista. |
| Error de red / 5xx | `ApiError` sin status o 5xx | Mensaje de `getErrorMessage`; los datos escritos se conservan para reintentar. |
| Guardado | La API responde 201 (crear) o 200 (editar) | Navega a `/productos`. |

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Escribir en un campo | Actualiza su variable de estado | `onIonInput` |
| Elegir categoría | Actualiza `category` | `setCategory` |
| Tocar «Guardar» | Valida; si es válido, envía; si no, muestra los errores por campo | `validateProduct()` → `createProduct()` o `updateProduct(id, …)` |
| Guardado exitoso | Regresa a la lista, que se recarga | `history.push('/productos')` |
| Tocar el botón atrás | Descarta los cambios y regresa | `IonBackButton` |

**Reglas de validación en línea** (las mismas de la API; ver [product-entity.md](../api/product-entity.md)):

| Campo | Mensaje mostrado |
|-------|------------------|
| `name` | «El nombre es obligatorio.» / «El nombre no puede superar 60 caracteres.» |
| `price` | «El precio debe ser un número mayor que 0.» |
| `category` | «Seleccione una categoría.» |
| `stock` | «El stock debe ser un entero mayor o igual que 0.» |

---

## Accessibility

- [ ] Cada campo tiene `label` visible (no solo placeholder).
- [ ] Los errores se muestran junto al campo y en texto, no solo con color.
- [ ] Objetivos táctiles ≥ 44×44 pt (incluidos los botones de categoría).
- [ ] El teclado numérico se muestra en precio y stock.
- [ ] El texto escala con el tamaño de fuente del sistema y el contraste cumple WCAG AA.
