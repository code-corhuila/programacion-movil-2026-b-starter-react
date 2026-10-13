# Pantalla de formulario de producto

- **Route:** `/productos/nuevo` y `/productos/:id/editar`
- **Feature:** Catálogo de productos
- **Design reference:** N/A (sin mockup suministrado)

## Purpose
Crear un producto nuevo o modificar los datos de uno existente.

## UI regions

| Region | Component | Notes |
|---|---|---|
| Header | `IonHeader`, `IonToolbar` | Crear producto o Editar producto |
| Body | `IonInput` | Nombre, precio y stock |
| Category | `IonSelect` | Categorías permitidas |
| Feedback | Mensajes de validación | Errores por campo y del servidor |
| Footer / CTA | `IonButton` | Guardar y Cancelar |

## States

| State | Trigger | UI |
|---|---|---|
| Loading | Carga del producto para editar | Indicador de carga |
| Loaded | Campos listos | Formulario |
| Empty | No aplica al formulario | N/A |
| Error | Fallo al cargar o guardar | Mensaje de error |
| Validation | Campos inválidos | Errores junto a los campos |
| Saving | Envío en curso | Indicador y botón deshabilitado |

## Actions

| User action | Result | Use case / event |
|---|---|---|
| Escribir campo | Actualiza estado y valida | UpdateForm |
| Guardar | Valida y envía POST o PUT | SaveProduct |
| Cancelar | Vuelve sin guardar | CancelForm |

## Accessibility
- [ ] Todos los controles tienen etiquetas accesibles.
- [ ] Los objetivos táctiles cumplen el tamaño recomendado.
- [ ] El texto admite escalado.
- [ ] El contraste cumple WCAG AA.
