# ADR-001 — State management for the product catalog

- **Status:** Accepted
- **Date:** 2026-10-11

## Context

The product catalog needs to manage loading states, API errors, search text, category filters, form values and validation errors.

The application is small and the state used by each screen mainly belongs to that screen. There is no requirement for authentication state, shared shopping cart state or complex synchronization between unrelated screens.

The starter and the partial exam require the use of React with `useState` and `useEffect`.

## Decision

Use local component state with React `useState` and `useEffect`.

Each page will own the state that it needs.

Examples:

- Product list: products, loading, error, search text and selected category.
- Product detail: product, loading, error and delete confirmation.
- Product form: form values, validation errors, server errors, loading and submission state.

Remote data will be requested from the Express API when required.

No external global state library such as Redux or Zustand will be used.

## Consequences

### Positive consequences

- The solution stays simple and easy to understand.
- It follows the technologies required by the partial exam.
- State is kept close to the UI that uses it.
- No additional dependency is required.
- Components are easier to test independently.

### Negative consequences

- Some API loading logic may be repeated between pages.
- If the application grows significantly, shared state could become harder to coordinate.
- Products may be requested again when navigating between screens.

## Alternatives considered

### Redux

Rejected because the application scope is small and Redux would add unnecessary complexity and dependencies.

### Zustand

Rejected because global state is not necessary for the current product catalog requirements.

### React Context

Not selected because the current state does not need to be shared globally across the application.