# ADR-001 — Gestión del estado

- **ID:** ADR-001
- **Date:** 2026-10-12
- **Status:** Accepted
- **Authors:** Estudiante

## Context
Las páginas del catálogo necesitan representar datos recibidos de la API, formularios, carga y errores. La solución debe ajustarse al alcance del ejercicio y mantenerse fácil de comprender.

**Known constraints:**
- Ionic React y TypeScript.
- El estado de cada pantalla debe residir en la página mediante `useState` y `useEffect`, o en un hook propio.

## Decision
**We decided:** usar `useState` para el estado local y `useEffect` para cargar datos y reaccionar al ciclo de vida de las páginas.

**Justification:**
Este patrón es suficiente para las cuatro rutas y evita introducir dependencias de estado global innecesarias.

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|---|---|---|---|
| `useState` y `useEffect` | Sencillo y nativo de React | Puede repetir lógica | Elegido para el alcance actual |
| Context API | Comparte estado entre componentes | Añade complejidad global | No es necesario por ahora |
| Store externo | Adecuado para estados complejos | Dependencia y configuración extra | Fuera del alcance actual |

## Consequences
**Positive:**
- Estado explícito y fácil de probar.
- Menor complejidad de arquitectura.

**Negative / Trade-offs:**
- Puede repetirse lógica entre páginas.

**Impact on the system:**
- Affected features/screens: lista, detalle y formulario.
- Documents to update: documentación de funcionalidades y README.

## References
- React documentation: https://react.dev/
- Related to: ADR-002.
