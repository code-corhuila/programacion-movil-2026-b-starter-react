# Feature — Product Catalog

- **Owner:** Juan Jose Guzman Bohorquez
- **Status:** Planned
- **Related stories:** HU-PROD-001 List and filter products; HU-PROD-002 View product details; HU-PROD-003 Create products; HU-PROD-004 Edit products; HU-PROD-005 Delete products.

---

## Purpose

Allow users to manage a product catalog through an Ionic React application connected to an Express API. Users can search, filter, view, create, edit, and delete products.

---

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Product list | `/productos` | List products and filter by name and category. |
| Product detail | `/productos/:id` | Display all product fields and offer edit and delete actions. |
| Create product | `/productos/nuevo` | Create a product using a validated form. |
| Edit product | `/productos/:id/editar` | Update a product using the same form screen. |

Screen specifications: `../screens/lista.md`, `../screens/detalle.md`, and `../screens/formulario.md`.

---

## State

- **Pattern:** Local page state with React `useState` and `useEffect`.
- **State objects:** Products, selected product, search text, selected category, form values, validation errors, loading status, request error, saving status, and delete confirmation.
- **Updates:** Replace state values rather than mutate existing arrays or objects.
- **Key transitions:**
  - List: loading → loaded, empty, or error.
  - Filters: loaded → matching products or no results.
  - Detail: loading → loaded, not found, or error.
  - Form: editing → validation errors or saving → success or API error.
  - Delete: loaded → confirmation → deleting → list or error.

---

## Data

- **Use cases:** LoadProducts, ViewProduct, CreateProduct, UpdateProduct, DeleteProduct, and FilterProducts.
- **Data access:** HTTP client functions in `src/features/products/data/`.
- **Remote sources / endpoints:**
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
- **Domain:** Product type, `validateProduct`, `toProductView`, `filterProducts`, and `formatCOP`.
- **Local persistence:** None. The API keeps products in memory, initialized from eight products in `server/data/products.json`. Changes are lost when the server restarts.
- **Endpoint contract:** `../api/products-endpoints.md`.
- **Entity specification:** `../api/product-entity.md`.

---

## Acceptance criteria

1. The list loads products from the API.
2. Search matches product names without case sensitivity.
3. Category buttons are Todas, Bebidas, Snacks, Aseo, and Hogar.
4. Search and category filters work together through `filterProducts`.
5. The list distinguishes loading, an empty catalog, no filter results, and request errors with a retry action.
6. Each product is displayed using a ProductCard with typed props.
7. The detail displays id, name, price, category, and stock.
8. Create and edit share a form with inline validation.
9. Name is a non-empty string with a maximum of 60 characters.
10. Price is a number greater than zero.
11. Category is Bebidas, Snacks, Aseo, or Hogar.
12. Stock is an integer greater than or equal to zero.
13. The form displays server validation messages from `details`.
14. Deletion requires an on-screen confirmation and returns to the list after success.
15. Prices use COP formatting. Stock labels are Agotado for zero, Pocas unidades for 1–4, and Disponible for 5 or more.
16. Successful creation and editing are reflected when returning to the list.

---

## Edge cases & states

Planned behavior; these items will be checked after verification.

- [ ] Loading: show a loading indicator while requests are pending.
- [ ] Empty: show an empty catalog message and a create action.
- [ ] No results: show a distinct message when filters match no products.
- [ ] Error / retry: show the request error and allow another attempt.
- [ ] Offline: show a connection error; no offline cache is available.
- [ ] Not found: show a clear message when a product does not exist.
- [ ] Invalid input: show validation messages and prevent submission.
- [ ] Failed mutation: preserve form values or product details and show the error.
- Permission denied: N/A; authentication and device permissions are outside scope.

---

## Decisions

- [ADR-001 — Local page state](../decisions/ADR-001-estado.md)
- [ADR-002 — API consumption](../decisions/ADR-002-consumo-api.md)

---

## Tests

- **Unit:** Validate valid and invalid product inputs, stock labels, COP formatting, and combined filters.
- **API integration:** Use `startTestServer()` to verify successful requests, invalid input, missing products, and the supplied 404 handler.
- **UI verification:** Manually verify loading, empty, no results, error/retry, inline validation, and delete confirmation.
- **Critical flow:** Create a product, find it in the list, open its detail, edit it, and delete it.