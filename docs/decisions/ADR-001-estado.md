# ADR-001 — Local Page State with React Hooks

- **ID:** ADR-001
- **Date:** 2026-10-10
- **Status:** Accepted
- **Authors:** Juan Jose Guzman Bohorquez

---

## Context

The product catalog includes a list, a detail page, and a reusable create/edit form. Each page needs to manage loading, data, user input, and errors.

A state management approach must be selected before implementation so that page behavior and data responsibilities remain consistent.

**Known constraints:**

- The application uses the Ionic React starter.
- The assignment requires state to live in each page using `useState` and `useEffect`.
- The catalog is small and does not require shared global state.
- Products are stored in memory by the API.
- The implementation must separate data, domain, and presentation responsibilities.

---

## Decision

**We decided:** Manage state locally in each page with `useState` and use `useEffect` for loading data in response to page activation or route changes.

**Justification:**

Local state matches the assignment and keeps each page understandable. A global store would add dependencies and coordination that this catalog does not need.

Pages will call the HTTP client in the data layer and pure functions in the domain layer. Arrays and objects will be replaced when updated rather than mutated directly.

Filtered products will be derived from the loaded products, search text, and selected category instead of maintained as a separate state copy.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| Local state with React hooks | Simple, no extra dependency, matches the assignment | Pages must explicitly refresh data after mutations | Chosen |
| React Context with shared state | Shares data across pages | Adds provider logic and couples page updates | Shared global state is unnecessary for this scope |
| External global store | Centralized state and additional tooling | Extra dependency and setup | Adds complexity and does not match the required local page approach |

---

## Consequences

**Positive:**

- Each page owns its loading, error, and interaction states.
- No additional state management library is required.
- Domain functions can be tested independently from React.
- The implementation follows the required page-level state approach.

**Negative / Trade-offs:**

- Returning to a page may require another API request.
- Local state does not provide a shared cache.
- Similar loading and error handling may appear in multiple pages.
- Asynchronous requests must avoid applying stale results after navigation.

**Impact on the system:**

- Affected features/screens: Product list, product detail, and create/edit form.
- List state: Products, search, category, loading, and error.
- Detail state: Product, loading, errors, confirmation, and deleting.
- Form state: Values, interacted fields, validation errors, loading, saving, and server errors.
- Data must refresh after successful creation, editing, or deletion.
- Page activation must be considered because Ionic navigation may retain mounted pages.
- Documents to update: Feature specification, screen specifications, and the README section State management decision.

---

## References

- [Product Catalog](../features/productos.md)
- [Product List](../screens/lista.md)
- [Product Detail](../screens/detalle.md)
- [Product Form](../screens/formulario.md)
- Related to: [ADR-002 — API consumption](ADR-002-consumo-api.md)