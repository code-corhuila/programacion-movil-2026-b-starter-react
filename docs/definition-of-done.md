# Definition of Done — Parcial C2 · Catálogo de productos

Una parte del parcial está **terminada solo si se cumplen todos los puntos que le aplican**. Copie esta lista en la descripción del Pull Request y marque lo cumplido; lo que no aplique, indíquelo con «N/A» y el motivo.

## Documentación (antes del código)

- [ ] `docs/features/productos.md` completo: propósito, pantallas con rutas, estado, datos, casos límite y pruebas.
- [ ] `docs/screens/` con las pantallas lista, detalle y formulario (regiones, estados y acciones).
- [ ] `docs/decisions/ADR-001-estado.md` y `ADR-002-consumo-api.md` con contexto, decisión, alternativas y consecuencias.
- [ ] `docs/api/products-endpoints.md` con los 5 endpoints (parámetros, cuerpo, éxito, errores y comportamiento de la app).
- [ ] `docs/api/product-entity.md` con campos y reglas; persistencia, índices y sincronización marcados «N/A, almacenamiento en memoria».
- [ ] Ninguna plantilla quedó con texto sin reemplazar (`[...]`, `NNN`, `YYYY-MM-DD`).
- [ ] El commit de documentación es anterior al primer commit de código.

## API Express (`server/app.js`)

- [ ] Los 5 endpoints responden con los códigos del contrato: 200, 201, 204, 400 y 404.
- [ ] `POST` y `PUT` validan `name`, `price`, `category` y `stock` y devuelven un mensaje en `details` por cada problema.
- [ ] `GET /api/products` filtra por `search` (sin distinguir mayúsculas) y por `category` (exacta).
- [ ] `id` no numérico → 400; `id` inexistente → 404; la creación asigna un id incremental.
- [ ] Todo error usa el formato `{ "error", "details" }`; se conservan los manejadores 404 y de errores dados.

## App Ionic (`src/features/products/`)

- [ ] `products-api.ts` implementa `getProduct`, `createProduct`, `updateProduct` y `deleteProduct` con el patrón de `request()`.
- [ ] `domain/product.ts` implementa `validateProduct`, `toProductView` y `filterProducts` según su contrato.
- [ ] Lista: buscador, filtro por categoría y los cuatro estados (cargando, vacío, sin resultados, error con «Reintentar»); se refresca al volver.
- [ ] `ProductCard` reutilizable con props tipadas, y aviso visible de stock bajo o agotado.
- [ ] Detalle: todos los campos, carga, error y «no encontrado», botón Editar y Eliminar con confirmación en pantalla.
- [ ] Formulario crear/editar: validación en línea y visualización de `error` y `details` del servidor.
- [ ] Las cuatro rutas funcionan: `/productos`, `/productos/nuevo`, `/productos/:id`, `/productos/:id/editar`.
- [ ] La app funciona de punta a punta contra la API (crear, editar y eliminar se reflejan en la lista).
- [ ] Hay manejo de carga y error en todas las pantallas; el estado offline se trata como error de red.

## Kotlin

- [ ] `kotlin/Product.kt` compila o corre en el Kotlin Playground: clase `Product`, `stockLabel`, `applyDiscount` y `main()` con tres productos.

## Calidad

- [ ] `npm test` pasa, con al menos 4 pruebas nuevas (2 o más unitarias y 2 o más de la API).
- [ ] `npm run lint` y `npm run build` no muestran errores ni advertencias nuevas.
- [ ] Sin cadenas de texto de usuario duplicadas o dispersas que deban centralizarse; nombres según `coding-standards` (PascalCase, camelCase, UPPER_SNAKE_CASE, `is/has/should`, carpetas en kebab-case).
- [ ] Accesibilidad básica revisada: etiquetas visibles, objetivos táctiles ≥ 44×44 pt, aviso de stock no solo por color.
- [ ] Ningún secreto en el repositorio: `.env` ignorado y solo `.env.example` versionado.
- [ ] Documentación actualizada si el código cambió algo ya documentado (feature, pantallas, ADR, API).

## Git y entrega

- [ ] Trabajo en una rama `feature/…` o `feat/…`, no directamente en `main`.
- [ ] Al menos 6 commits en formato Conventional Commits (`type(scope): resumen`, imperativo, ≤ 72 caracteres).
- [ ] Pull Request hacia el `main` de **mi propio fork**, con descripción y este checklist marcado.
- [ ] README con cómo ejecutar (`npm run server` y `npm run dev`).
- [ ] README con las secciones en inglés **State management decision** y **API error handling** (3 a 5 frases cada una).
- [ ] Enlace del PR pegado en Moodle antes del cierre (sábado 10 de octubre de 2026, 11:59 p. m.).

> Si algún punto aplicable no se cumple, la parte **no está terminada**: se queda abierta y se declara en el PR.
