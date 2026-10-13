# ADR-001 — Manejo de estado con useState y useEffect

- **ID:** ADR-001
- **Date:** 2026-10-09
- **Status:** Accepted
- **Authors:** [Su nombre]

---

## Context

La app de productos tiene cuatro pantallas (lista, detalle, crear y editar) que leen y modifican datos de una API. Hay que decidir dónde vive el estado y cómo se sincroniza con el servidor. Sin esa decisión cada pantalla resolvería la carga, los errores y el refresco a su manera.

**Known constraints:**
- Parcial individual de 6 a 8 horas; solo se usa lo visto en las semanas 6 a 9.
- Datos pequeños (8 productos semilla), un solo recurso y sin autenticación.
- Ionic mantiene las páginas en memoria al navegar, así que volver a la lista no la vuelve a montar.
- El framework de gobierno separa `presentation`, `domain` y `data`; el estado de pantalla pertenece a `presentation`.

---

## Decision

**We decided:** manejar el estado de cada pantalla de forma local con `useState` y `useEffect` de React, sin librería de estado global.

**Justification:**
- Ninguna información se comparte entre pantallas en tiempo real: la fuente de verdad es la API y cada pantalla la consulta al entrar.
- `useState` guarda `products`, `status` (`'loading' | 'ready' | 'error'`), `errorMessage`, `search` y `category`. El estado de carga es una sola variable con tres valores, para que no existan combinaciones imposibles (por ejemplo, «cargando» y «error» a la vez).
- `useEffect` con `[]` carga los datos al montar la pantalla; `useIonViewWillEnter` los recarga al volver, lo que cubre altas, ediciones y bajas hechas en otra pantalla.
- La lista visible no se guarda: se deriva en cada render con `filterProducts(products, { search, category })`. Así no hay dos copias que sincronizar.
- La lógica de reglas (`validateProduct`, `toProductView`, `filterProducts`) queda en `domain` como funciones puras, por lo que se prueba sin React.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| `useState` + `useEffect` en cada página — chosen | Cero dependencias; cada pantalla se entiende por sí sola; alcanza para el tamaño del problema | Algo de código repetido de carga y error entre páginas | — (chosen) |
| Hook propio (`useProducts`) | Elimina repetición; la página queda más corta | Abstracción adicional que el parcial no exige | Se acepta como evolución, no hace falta ahora |
| Context API / `useReducer` global | Estado compartido y transiciones explícitas | Complejidad sin datos compartidos que lo justifiquen | Sobredimensionado |
| Redux Toolkit / Zustand / React Query | Caché, reintentos e invalidación integrados | Dependencia nueva, curva de aprendizaje, fuera de lo visto en clase | Fuera de alcance y de tiempo |

---

## Consequences

**Positive:**
- Implementación simple, fácil de explicar y de depurar.
- Los cuatro estados de la lista (cargando, vacío, sin resultados, error) salen de variables explícitas y de un valor derivado.
- Sin estado duplicado, la lista no queda desactualizada respecto al filtro.

**Negative / Trade-offs:**
- Cada pantalla repite el patrón de carga y manejo de error.
- No hay caché: cada entrada a una pantalla hace una petición nueva.
- Si el servidor tarda, la persona ve «Cargando…» cada vez que vuelve a la lista.
- Una condición de carrera es posible si se cambian los filtros mientras llega una respuesta; en la lista se evita con una referencia (`isLoadingRef`) que impide dos cargas simultáneas.

**Si la app creciera** (más recursos, datos compartidos entre pantallas, necesidad de caché u offline): primero extraer un hook por funcionalidad (`useProducts`) y, si hace falta caché e invalidación, adoptar una librería de datos remotos como TanStack Query. Esta decisión se revisaría en un ADR nuevo.

**Impact on the system:**
- Affected features/screens: lista, detalle y formulario de [Productos](../features/productos.md).
- Documents to update: [productos.md](../features/productos.md) (sección State) y la sección «State management decision» del README.

---

## References

- Mobile Governance Framework: `01-architecture/layers-and-state`.
- Related to: [ADR-002](./ADR-002-consumo-api.md).
