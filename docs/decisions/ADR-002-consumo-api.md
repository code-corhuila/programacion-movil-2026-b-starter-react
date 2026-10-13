# ADR-002 — Consumo de la API

- **ID:** ADR-002
- **Date:** 2026-10-12
- **Status:** Accepted
- **Authors:** Estudiante

## Context
La aplicación Ionic necesita consultar y modificar productos mediante una API Express. Los fallos de conexión y las respuestas HTTP no exitosas deben comunicarse de forma comprensible.

**Known constraints:**
- Usar `fetch` y la configuración `API_URL` del proyecto.
- Mantener el formato de errores `{ error, details }`.

## Decision
**We decided:** centralizar las peticiones en `data/products-api.ts`, utilizar `API_URL`, y representar respuestas HTTP no exitosas mediante `ApiError`. Las páginas traducen esos errores en mensajes y estados visuales.

**Justification:**
Centralizar el acceso evita duplicar la construcción de URLs y el manejo de respuestas.

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|---|---|---|---|
| `fetch` centralizado | Nativo, sencillo y suficiente | Requiere comprobar respuestas | Elegido |
| Peticiones `fetch` en cada página | Inicio rápido | Duplica lógica y manejo de errores | Se descarta por duplicación |
| Biblioteca HTTP externa | Facilita funciones avanzadas | Añade dependencia | No es necesaria para el alcance |

## Consequences
**Positive:**
- Acceso a API uniforme.
- Las páginas pueden distinguir errores y mostrar reintentos.

**Negative / Trade-offs:**
- Hay que mantener correctamente `API_URL` en cada entorno.

**Impact on the system:**
- Affected features/screens: lista, detalle y formulario.
- Documents to update: endpoints y README.

## References
- API: `/api/products`.
- Related to: ADR-001.
