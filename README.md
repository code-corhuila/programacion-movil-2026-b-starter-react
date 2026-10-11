# Catálogo de productos · Starter Ionic React (versión 2)

Parcial práctico del corte 2 · Programación Móvil · CORHUILA 2026-B (modalidad individual).

Este repositorio es el punto de partida. El proyecto tiene tres piezas que se construyen durante el parcial, siguiendo el [Mobile Governance Framework](https://github.com/jesusarielgb-works/mobile-governance-framework):

- **API Express** (`server/`): CRUD de productos con validación, filtros y manejo de errores.
- **App Ionic React** (`src/`): lista con búsqueda y filtro, detalle, y formulario de crear y editar, organizada por capas.
- **Ejercicio Kotlin** (`kotlin/Product.kt`): modelo y funciones básicas, con lo visto en la semana 7.

Además, la **documentación** (`docs/`) se escribe antes del código, a partir de las plantillas del framework.

> El enunciado oficial es el PDF de la actividad en Moodle. Este README es un resumen; si algo difiere, manda el PDF.

## Cómo ejecutar

Requisito: Node.js 22.12 o superior (`node --version`).

```bash
npm install        # instala dependencias (una sola vez)
npm run server     # arranca la API en http://localhost:3000
npm run dev        # arranca la app en http://localhost:5173 (en otra terminal)
npm test           # corre las pruebas (Vitest)
npm run lint       # revisión de estilo del código
npm run build      # revisión de tipos y compilación para producción
```

La app y la API se ejecutan al mismo tiempo, cada una en su terminal. La app lee la dirección de la API de la variable `VITE_API_URL`: copie `.env.example` como `.env` si necesita cambiarla. El archivo `.env` está ignorado por Git; nunca se versiona.

Rutas de la app: `/productos` (lista), `/productos/nuevo`, `/productos/:id` (detalle) y `/productos/:id/editar`.

La API implementa el CRUD completo de `/api/products`, incluyendo filtros, validación y manejo uniforme de errores. La aplicación Ionic consume estos endpoints y permite listar, buscar, filtrar, crear, consultar, editar y eliminar productos.

## Flujo de entrega

1. Haga un **fork** de este repositorio a su cuenta de GitHub y clónelo.
2. Cree una rama de funcionalidad: `git switch -c feature/productos`.
3. Trabaje la lista de [TODO.md](./TODO.md), en orden, con commits pequeños en formato [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): resumen` (por ejemplo, `docs(productos): describe la funcionalidad` o `feat(api): agrega el endpoint de lista`).
4. Los documentos de `docs/` van **antes** que el código: el primer commit de código debe ser posterior al commit de documentación.
5. Abra un **Pull Request hacia el `main` de su propio fork** (no hacia el repositorio original), con una descripción de lo hecho y el checklist de `docs/definition-of-done.md` marcado.
6. Pegue el **enlace del PR** en la actividad de Moodle (texto en línea) antes del cierre: antes del cierre: lunes 12 de octubre de 2026, 11:59 p. m.

## Qué se evalúa (5,0)

| Parte | Puntos |
|---|---|
| 1. Documentar antes de codificar | 0,75 |
| 2. API Express | 1,0 |
| 3. App Ionic | 1,5 |
| 4. Kotlin | 0,5 |
| 5. Calidad | 0,5 |
| 6. Git y entrega | 0,25 |
| 7. Inglés | 0,5 |

El detalle de cada criterio está en [TODO.md](./TODO.md).

## Contrato de la API (resumen)

Recurso `/api/products` con `{ id: number, name: string, price: number, category: string, stock: integer }`. Los datos semilla están en `server/data/products.json` y se guardan en memoria (se reinician al reiniciar el servidor).

| Método y ruta | Éxito | Errores |
|---|---|---|
| `GET /api/products?search=&category=` | 200 + arreglo | — |
| `GET /api/products/:id` | 200 + objeto | 400 (id no numérico) · 404 |
| `POST /api/products` | 201 + objeto creado | 400 |
| `PUT /api/products/:id` | 200 + objeto actualizado | 400 · 404 |
| `DELETE /api/products/:id` | 204 sin cuerpo | 400 · 404 |

Validación: `name` obligatorio (máximo 60 caracteres), `price` número mayor que 0, `category` una de `Bebidas`, `Snacks`, `Aseo` o `Hogar`, y `stock` entero mayor o igual que 0. Todo error usa el formato `{ "error": "mensaje", "details": ["..."] }`; una ruta desconocida responde 404 con ese formato, y un error inesperado, 500.

## Estructura

```text
docs/                         plantillas del framework (se copian y se llenan)
  features/ screens/ decisions/ api/ definition-of-done.md
kotlin/Product.kt             ejercicio Kotlin (esqueleto)
server/
 app.js                      createApp(): CRUD de productos, filtros, validación y piezas ya dadas
  index.js                    arranque en el puerto 3000
  data/products.json          8 productos semilla
src/app/                      arranque, rutas y tema
src/features/products/        funcionalidad organizada por capas del framework
  data/                       config.ts (API_URL), api-error.ts (ApiError), products-api.ts (cliente fetch)
  domain/product.ts           tipos, formatCOP (dado), validateProduct, toProductView, filterProducts
  presentation/               lista, detalle, formulario, EmptyState y ProductCard con props tipadas
  __tests__/                  test-server.ts (helper dado), pruebas de ejemplo y espacio para las suyas
```

Capas (framework, `01-architecture/layers-and-state`): `presentation` depende de `domain` y de `data`; `data` depende de `domain`; `domain` no depende de nada. El estado de cada pantalla puede vivir en la misma página con `useState` y `useEffect`.

## Qué ya viene resuelto

Para concentrar el parcial en lo trabajado en clase, algunas piezas vienen hechas y con comentarios en español. Se usan y se explican (ADR-002 y la sección «API error handling»), pero no se piden escritas:

- **Servidor:** `express.json()`, `cors()`, `parseId()`, el manejador 404 de rutas desconocidas y el manejador central de errores (500), en `server/app.js`.
- **Cliente:** `API_URL` (`data/config.ts`), la clase `ApiError` y `getErrorMessage` (`data/api-error.ts`), y `getProducts` resuelta como ejemplo (con la función `request`) en `data/products-api.ts`.
- **Dominio:** `formatCOP()`.
- **Presentación:** `EmptyState` como modelo de componente con props tipadas; el esqueleto de la lista (carga con `useEffect` e `IonItem`/`IonLabel`) y el campo `IonInput` del formulario.
- **Pruebas:** el helper `startTestServer()` y un ejemplo de prueba de la API.

## State management decision

The product pages use local state with React `useState` and `useEffect`. This approach keeps each screen responsible for its own loading, error, filters, form values and validation state. A global state library is not necessary because the product catalog is small and data can be refreshed from the REST API when needed. This solution keeps the application simple and follows the architecture defined for the assignment.

## API error handling

The API returns errors with a consistent `{ error, details }` structure and the appropriate HTTP status code. The client uses `ApiError` to distinguish network failures from API responses such as 400, 404 and 500. Validation messages returned in `details` are displayed to the user when the server rejects a product form. Network and loading errors are also shown in the interface so the user can understand what happened and retry when appropriate.
---

Las plantillas de `docs/` provienen del Mobile Governance Framework (licencia MIT; ver `docs/LICENSE-mobile-governance-framework.txt`).
