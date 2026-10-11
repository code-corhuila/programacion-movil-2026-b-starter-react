# Definition of Done — Product Catalog

A product catalog story is considered Done only when all applicable items below are satisfied.

## Documentation

- [ ] The feature is documented in `docs/features/productos.md`.
- [ ] Product list, detail and form screens are documented.
- [ ] State management decision is documented in `ADR-001-estado.md`.
- [ ] API consumption and error handling are documented in `ADR-002-consumo-api.md`.
- [ ] Product endpoints are documented.
- [ ] Product entity and persistence strategy are documented.
- [ ] Documentation was committed before the first implementation commit.

## API

- [ ] `GET /api/products` returns all products.
- [ ] Search by product name is case-insensitive.
- [ ] Category filtering works correctly.
- [ ] `GET /api/products/:id` returns the requested product.
- [ ] `POST /api/products` creates a valid product.
- [ ] `PUT /api/products/:id` updates a valid product.
- [ ] `DELETE /api/products/:id` returns HTTP 204 without a response body.
- [ ] Invalid numeric input returns the required HTTP 400 response.
- [ ] Missing products return HTTP 404.
- [ ] POST and PUT validate all product fields.
- [ ] Validation errors use the `{ error, details }` format.
- [ ] Unexpected errors are handled by the provided server error handler.

## Ionic application

- [ ] The application follows `data`, `domain`, `presentation` and `__tests__` layers.
- [ ] The product list consumes the Express API.
- [ ] The list includes search by name.
- [ ] The list includes the five category buttons.
- [ ] Loading state is implemented.
- [ ] Empty state is implemented.
- [ ] No-results state is implemented.
- [ ] Error state includes a `Reintentar` action.
- [ ] `ProductCard` uses typed props.
- [ ] Product detail displays every product field.
- [ ] Create product works against the API.
- [ ] Edit product works against the API.
- [ ] Delete requires confirmation.
- [ ] Successful deletion returns to the product list.
- [ ] Client-side validation uses `validateProduct`.
- [ ] Server validation messages from `details` are displayed.
- [ ] `toProductView` formats price and stock labels correctly.

## Error and network states

- [ ] Loading states are visible while requests are running.
- [ ] HTTP 400 validation errors are shown appropriately.
- [ ] HTTP 404 product-not-found errors are distinguished.
- [ ] Network or server failures produce a visible error state.
- [ ] Offline caching is N/A for this exam; lack of connectivity is handled as an error state.

## Kotlin

- [ ] `kotlin/Product.kt` compiles.
- [ ] `Product` uses `val` and `var` appropriately.
- [ ] `stock` accepts `null`.
- [ ] `stockLabel` handles null and all required stock ranges.
- [ ] `applyDiscount` calculates the discounted price.
- [ ] `main()` prints three products with their stock labels and 10% discounted prices.

## Tests and quality

- [ ] At least two new domain unit tests pass.
- [ ] At least two new API tests pass.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `.env` is ignored by Git.
- [ ] `.env.example` remains in the repository.
- [ ] No secrets or credentials are committed.

## Git and delivery

- [ ] Work is developed on `feature/catalogo-productos`.
- [ ] At least six Conventional Commits are present.
- [ ] README explains `npm run server` and `npm run dev`.
- [ ] README contains the required English sections.
- [ ] A Pull Request is opened toward `main` of the student's own fork.
- [ ] The Pull Request contains a description and completed checklist.