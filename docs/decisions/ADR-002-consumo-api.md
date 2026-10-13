# ADR-002 — Consumo de la API con fetch y ApiError

- **ID:** ADR-002
- **Date:** 2026-10-09
- **Status:** Accepted
- **Authors:** [Su nombre]

---

## Context

La app debe hablar con la API Express (`/api/products`, puerto 3000) desde un origen distinto (Vite, puerto 5173). Se necesita decidir qué cliente HTTP usar, dónde se configura la dirección base y cómo se representan los errores para que las pantallas no tengan que interpretar excepciones de bajo nivel ni códigos HTTP.

**Known constraints:**
- La API responde errores con un formato uniforme: `{ "error": "mensaje", "details": ["..."] }`.
- Hay dos fallos de naturaleza distinta: la API no responde (red) y la API responde con un código no exitoso (400, 404, 500).
- El `DELETE` exitoso responde `204` sin cuerpo.
- Regla del framework: los errores de bajo nivel se traducen a errores propios antes de llegar a la interfaz.
- La dirección de la API cambia entre entornos y no debe quedar escrita en las pantallas.

---

## Decision

**We decided:** usar la función nativa `fetch` encapsulada en un único helper `request<T>()` en la capa `data`, con la dirección base `API_URL` (desde `VITE_API_URL`) y la clase `ApiError` como único tipo de error que sale de esa capa.

**Justification:**
- `fetch` ya está en el navegador y en Node 22: no agrega dependencias ni peso al bundle.
- `request()` concentra el manejo de errores en un solo punto:
  1. Si `fetch` lanza una excepción, la API no respondió → `ApiError` con `status = null` (`isNetworkError = true`).
  2. Si `response.ok` es `false`, se lee el cuerpo `{ error, details }` y se lanza `ApiError(error, status, details)`. Si el cuerpo no es JSON, se usa «Error {status}».
  3. Si el estado es `204`, se devuelve `undefined`; en otro caso se devuelve el JSON.
- Las cinco funciones de `products-api.ts` (`getProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`) solo arman la ruta, el método y el cuerpo, y delegan en `request()`.
- Las pantallas capturan el error y lo traducen con `getErrorMessage(error)`:
  - red → «No fue posible conectar con el servidor. Verifique que la API esté en ejecución.»
  - 404 → «No encontramos ese producto.»
  - otros `ApiError` → el mensaje del servidor.
  - cualquier otro error → «Ocurrió un error inesperado. Intente de nuevo.»
- El formulario además lee `error.details` cuando el servidor responde 400 y muestra cada mensaje.
- `API_URL` vale `import.meta.env.VITE_API_URL` y, si no existe, `http://localhost:3000`. El archivo `.env` no se versiona; solo `.env.example`.

**Del lado del servidor** (ya dado en `createApp()`): `cors()` permite el origen de la app, `express.json()` lee el cuerpo, un manejador final responde `404` a rutas desconocidas y un manejador de errores central responde `400` si el JSON llega malformado y `500` ante cualquier excepción inesperada, siempre con el formato `{ error, details }`. Gracias a eso el cliente puede asumir un único formato de error.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| `fetch` + helper `request()` + `ApiError` — chosen | Sin dependencias; un solo punto de error; separa red de respuesta no exitosa | `fetch` no falla en 4xx/5xx, hay que revisar `response.ok` a mano; sin reintentos ni cancelación automáticos | — (chosen) |
| Axios | Rechaza en 4xx/5xx por defecto; interceptores | Dependencia adicional para 5 llamadas simples | Costo mayor que el beneficio |
| `fetch` directo en cada pantalla | Ninguna capa extra | Duplica el manejo de errores, mezcla HTTP con UI y viola la regla de capas | Rompe la arquitectura |
| Mostrar el código HTTP crudo a la persona | Menos código | Mensajes incomprensibles | Mala experiencia de usuario |

---

## Consequences

**Positive:**
- Las pantallas no conocen HTTP: reciben datos o un `ApiError`.
- Distinguir «sin conexión» de «el servidor rechazó la petición» permite mensajes distintos y un botón «Reintentar» pertinente.
- Cambiar de servidor solo exige cambiar `VITE_API_URL`.
- Fácil de probar: la capa `data` se prueba contra `startTestServer()`.

**Negative / Trade-offs:**
- Sin timeout, reintentos automáticos ni cancelación: si la API se cuelga, la pantalla queda en «Cargando…» hasta que el navegador falle.
- Sin autenticación ni cabeceras globales; habría que añadirlas en `request()`.
- La traducción a mensajes está en español dentro de `getErrorMessage`; para internacionalizar habría que moverla a un catálogo de textos.

**Impact on the system:**
- Affected features/screens: todas las pantallas de [Productos](../features/productos.md).
- Documents to update: [products-endpoints.md](../api/products-endpoints.md) (columna «App behavior») y la sección «API error handling» del README.

---

## References

- MDN: [Using the Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch).
- Mobile Governance Framework: `01-architecture/layers-and-state`.
- Related to: [ADR-001](./ADR-001-estado.md).
