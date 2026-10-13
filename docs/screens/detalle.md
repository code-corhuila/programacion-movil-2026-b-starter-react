# Pantalla de detalle de producto

- **Route:** `/productos/:id`
- **Feature:** Catálogo de productos
- **Design reference:** N/A (sin mockup suministrado)

## Purpose
Mostrar todos los datos de un producto y permitir editarlo o solicitar su eliminación.

## UI regions

| Region | Component | Notes |
|---|---|---|
| Header | `IonHeader`, `IonToolbar` | Título y navegación |
| Body | `IonContent` | Nombre, ID, precio, categoría y stock |
| Feedback | Mensaje o indicador | Carga, error o producto inexistente |
| Footer / CTA | `IonButton` | Editar y Eliminar |

## States

| State | Trigger | UI |
|---|---|---|
| Loading | Consulta en curso | Indicador de carga |
| Loaded | Producto encontrado | Todos los campos |
| Empty | ID inexistente | Mensaje de no encontrado |
| Error | Fallo de petición | Mensaje y opción de volver |
| Offline | Sin conectividad | Mensaje de error de conexión |

## Actions

| User action | Result | Use case / event |
|---|---|---|
| Editar | Abre `/productos/:id/editar` | EditProduct |
| Eliminar | Solicita confirmación | ConfirmDeleteProduct |
| Confirmar eliminación | Elimina y vuelve a la lista | DeleteProduct |
| Volver | Regresa al catálogo | BackToList |

## Accessibility
- [ ] Todos los controles tienen etiquetas accesibles.
- [ ] Los objetivos táctiles cumplen el tamaño recomendado.
- [ ] El texto admite escalado.
- [ ] El contraste cumple WCAG AA.
