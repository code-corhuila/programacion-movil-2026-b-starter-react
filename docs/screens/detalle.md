# Screen — Detalle de producto

- **Route:** `/productos/:id`
- **Feature:** [Productos](../features/productos.md)
- **Component:** `ProductDetailPage` (`src/features/products/presentation/ProductDetailPage.tsx`)
- **Design reference:** N/A (componentes estándar de Ionic)

---

## Purpose

Mostrar toda la información de un producto y ofrecer las dos acciones sobre él: editarlo o eliminarlo.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` + `IonBackButton` (`defaultHref="/productos"`) + `IonTitle` | Título «Detalle del producto». |
| Body | Campos del `ProductView` | Nombre, categoría, precio (`priceLabel`), stock numérico y `stockLabel`, con aviso visible si `isLowStock` o `isOutOfStock`. |
| CTA principal | `IonButton` «Editar» | Navega a `/productos/:id/editar`. |
| CTA destructiva | `IonButton` «Eliminar» (`color="danger"`) | Activa la confirmación en pantalla. |
| Confirmación | Bloque condicional con «¿Eliminar este producto?», `IonButton` «Confirmar» y `IonButton` «Cancelar» | Visible solo si `isConfirmingDelete` es `true`. |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | `getProduct(Number(id))` en curso | Texto «Cargando producto…»; sin botones de acción. |
| Loaded | La API responde 200 | Campos del producto y botones Editar / Eliminar. |
| Not found | `ApiError` con `status = 404` | «No encontramos ese producto.» y botón para volver a la lista. |
| Error | Red caída o 5xx | Mensaje de `getErrorMessage` + botón «Reintentar». |
| Confirmando eliminación | `isConfirmingDelete = true` | Aparece el aviso con «Confirmar» y «Cancelar»; «Eliminar» se oculta. |
| Eliminando | `deleteProduct` en curso | Botones de confirmación deshabilitados para evitar doble envío. |
| Error al eliminar | `deleteProduct` lanza `ApiError` | Mensaje de error en pantalla; el producto sigue visible y se puede reintentar. |
| Offline | Sin conexión con la API | Se trata como Error (sin datos en caché). |

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Abrir la pantalla | Carga el producto | `getProduct(Number(id))` → `GET /api/products/:id` |
| Tocar «Editar» | Navega a `/productos/:id/editar` | — |
| Tocar «Eliminar» | Muestra la confirmación | `isConfirmingDelete = true` |
| Tocar «Cancelar» | Oculta la confirmación | `isConfirmingDelete = false` |
| Tocar «Confirmar» | Elimina y regresa a la lista | `deleteProduct(id)` → `DELETE /api/products/:id` → `history.push('/productos')` |
| Tocar «Reintentar» | Repite la carga | `getProduct(Number(id))` |
| Tocar el botón atrás | Regresa a la lista | `IonBackButton` |

---

## Accessibility

- [ ] «Editar», «Eliminar», «Confirmar» y «Cancelar» tienen texto visible como etiqueta.
- [ ] Objetivos táctiles ≥ 44×44 pt, con separación entre «Confirmar» y «Cancelar».
- [ ] El estado de stock se comunica con texto, no solo con color.
- [ ] El texto escala con el tamaño de fuente del sistema.
- [ ] Contraste conforme a WCAG AA (incluido el color de peligro del botón Eliminar).
