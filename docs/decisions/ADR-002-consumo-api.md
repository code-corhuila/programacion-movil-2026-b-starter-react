# ADR-002 — API Consumption through the Data Layer

- **ID:** ADR-002
- **Date:** 2026-10-10
- **Status:** Accepted
- **Authors:** Juan Jose Guzman Bohorquez

---

## Context

The Ionic application must consume an Express API to list, retrieve, create, update, and delete products.

The starter already provides API_URL, ApiError, and getProducts as an HTTP client example. It also includes Express JSON parsing, CORS, parseId, and 404 and 500 handlers.

A consistent approach is needed to reuse these elements and keep HTTP details outside presentation components.

**Known constraints:**

- Use the supplied starter utilities and be able to explain them.
- Keep HTTP functions in the data layer.
- Use the API contract defined by the assignment.
- Errors have the structure `{ "error": "message", "details": [] }`.
- DELETE returns 204 without a response body.
- No authentication or persistent database is required.

---

## Decision

**We decided:** Use fetch in the data layer, following the supplied getProducts example and using API_URL and ApiError for consistent configuration and HTTP error handling.

**Justification:**

This approach extends the starter without adding an HTTP library. Pages receive products or errors while the data layer manages URLs, HTTP methods, headers, and response parsing.

The domain layer contains product types, validation, filtering, and view transformations. Presentation components handle user interaction and display feedback.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| fetch in the data layer | Built in; follows the starter; keeps HTTP logic separate | Requires explicit status checks and response parsing | Chosen |
| fetch directly inside each page | Quick initial implementation | Repeats HTTP logic and mixes responsibilities | Does not respect the required layer separation |
| Axios in the data layer | Provides additional HTTP conveniences | Adds a dependency and differs from the supplied example | Unnecessary for this scope |

---

## Consequences

**Positive:**

- All product requests use the same API configuration.
- HTTP errors can be distinguished through ApiError.
- Pages can display validation details and not found states.
- Domain functions remain independent of HTTP and Ionic.
- No additional HTTP dependency is needed.

**Negative / Trade-offs:**

- fetch does not reject automatically for HTTP error statuses.
- Each request must check response.ok before treating it as successful.
- Network failures must be handled separately from HTTP responses.
- A 204 response must not be parsed as JSON.
- No offline cache is provided.

**Impact on the system:**

- Data functions: getProducts, getProduct, createProduct, updateProduct, and deleteProduct.
- POST and PUT send JSON with the Content-Type header.
- HTTP failures use ApiError with the status and server details.
- A 400 response displays validation feedback.
- A 404 response displays a missing product or route message.
- A 500 response displays a server error.
- Network failures display a connection error without assuming the device is offline.
- Failed form submissions preserve the entered values.
- Documents to update: Endpoint specification, screen specifications, and the README section API error handling.

---

## Supplied server utilities

- **express.json():** Parses incoming JSON request bodies so handlers can read req.body.
- **CORS:** Allows the browser app to request the API across different origins, such as ports 5173 and 3000.
- **parseId:** Validates and converts route identifiers according to the supplied implementation; invalid identifiers produce 400 responses.
- **404 handler:** Responds when no registered route matches the request.
- **500 handler:** Handles unexpected errors forwarded through Express error handling.

A missing product must also produce a 404 response from its resource handler. This is different from requesting an unknown route.

The supplied handlers will be inspected and retained during implementation.

---

## Verification plan

- Test an invalid POST and verify 400 with accumulated details.
- Test a nonexistent product and verify 404.
- Request an unknown route using startTestServer() to exercise the supplied 404 handler.
- Explain that handler test in English in the README.
- Verify successful DELETE returns 204 with an empty body.
- Verify the app distinguishes HTTP errors from connection failures.

---

## References

- [Product Catalog](../features/productos.md)
- [Endpoint Specification](../api/products-endpoints.md)
- [Product Entity](../api/product-entity.md)
- Related to: [ADR-001 — Local page state](ADR-001-estado.md)