# Pantalla de lista de productos

- **Route:** `/productos`
- **Feature:** Catálogo de productos
- **Design reference:** N/A (sin mockup suministrado)

## Purpose
Consultar productos, buscar por nombre, filtrar por categoría y abrir el detalle o el formulario de creación.

## UI regions

| Region | Component | Notes |
|---|---|---|
| Header | `IonHeader`, `IonToolbar` | Título Catálogo |
| Search | `IonInput` | Buscar por nombre |
| Filters | `IonButton` | Todas, Bebidas, Snacks, Aseo y Hogar |
| Body | `ProductCard` | Nombre, categoría, precio y stock |
| Feedback | `EmptyState` | Carga, vacío, sin resultados o error |
| Footer / CTA | `IonButton` | Crear producto |

## States

| State | Trigger | UI |
|---|---|---|
| Loading | Petición en curso | Indicador de carga |
| Loaded | Hay productos | Lista de tarjetas |
| Empty | API devuelve lista vacía | Mensaje de catálogo vacío |
| No results | Filtros sin coincidencias | Mensaje para cambiar filtros |
| Error | Fallo de red o HTTP | Mensaje y Reintentar |

## Actions

| User action | Result | Use case / event |
|---|---|---|
| Escribir búsqueda | Filtra por nombre | SearchProducts |
| Elegir categoría | Filtra por categoría | FilterProducts |
| Seleccionar tarjeta | Abre detalle | ViewProduct |
| Crear | Abre formulario nuevo | CreateProduct |
| Reintentar | Vuelve a consultar | ReloadProducts |

## Accessibility
- [ ] Todos los controles tienen etiquetas accesibles.
- [ ] Los objetivos táctiles cumplen el tamaño recomendado.
- [ ] El texto admite escalado.
- [ ] El contraste cumple WCAG AA.
