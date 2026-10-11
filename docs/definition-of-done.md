# Definition of Done — Product Catalog

A product catalog story is considered Done only when all applicable items below are satisfied.

## Documentation

- [x] The feature is documented in `docs/features/productos.md`.
- [x] Product list, detail and form screens are documented.
- [x] State management decision is documented in `ADR-001-estado.md`.
- [x] API consumption and error handling are documented in `ADR-002-consumo-api.md`.
- [x] Product endpoints are documented.
- [x] Product entity and persistence strategy are documented.
- [x] Documentation was committed before the first implementation commit.

## API

- [x] `GET /api/products` returns all products.
- [x] Search by product name is case-insensitive.
- [x] Category filtering works correctly.
- [x] `GET /api/products/:id` returns the requested product.
- [x] `POST /api/products` creates a valid product.
- [x] `PUT /api/products/:id` updates a valid product.
- [x] `DELETE /api/products/:id` returns HTTP 204 without a response body.
- [x] Invalid numeric input returns the required HTTP 400 response.
- [x] Missing products return HTTP 404.
- [x] POST and PUT validate all product fields.
- [x] Validation errors use the `{ error, details }` format.
- [x] Unexpected errors are handled by the provided server error handler.

## Ionic application

- [x] The application follows `data`, `domain`, `presentation` and `__tests__` layers.
- [x] The product list consumes the Express API.
- [x] The list includes search by name.
- [x] The list includes the five category buttons.
- [x] Loading state is implemented.
- [x] Empty state is implemented.
- [x] No-results state is implemented.
- [x] Error state includes a `Reintentar` action.
- [x] `ProductCard` uses typed props.
- [x] Product detail displays every product field.
- [x] Create product works against the API.
- [x] Edit product works against the API.
- [x] Delete requires confirmation.
- [x] Successful deletion returns to the product list.
- [x] Client-side validation uses `validateProduct`.
- [x] Server validation messages from `details` are displayed.
- [x] `toProductView` formats price and stock labels correctly.

## Error and network states

- [x] Loading states are visible while requests are running.
- [x] HTTP 400 validation errors are shown appropriately.
- [x] HTTP 404 product-not-found errors are distinguished.
- [x] Network or server failures produce a visible error state.
- [x] Offline caching is N/A for this exam; lack of connectivity is handled as an error state.

## Kotlin

- [x] `kotlin/Product.kt` compiles.
- [x] `Product` uses `val` and `var` appropriately.
- [x] `stock` accepts `null`.
- [x] `stockLabel` handles null and all required stock ranges.
- [x] `applyDiscount` calculates the discounted price.
- [x] `main()` prints three products with their stock labels and 10% discounted prices.

## Tests and quality

- [x] At least two new domain unit tests pass.
- [x] At least two new API tests pass.
- [x] `npm test` passes.
- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] `.env` is ignored by Git.
- [x] `.env.example` remains in the repository.
- [x] No secrets or credentials are committed.

## Git and delivery

- [x] Work is developed on `feature/catalogo-productos`.
- [x] At least six Conventional Commits are present.
- [x] README explains `npm run server` and `npm run dev`.
- [x] README contains the required English sections.
- [ ] A Pull Request is opened toward `main` of the student's own fork.
- [ ] The Pull Request contains a description and completed checklist.