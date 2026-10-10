# Definition of Done — Product Catalog

The catalog is ready for submission only when the applicable checks below have been verified.

Unchecked items are pending. Mark them only after implementation and verification.

---

## Documentation before implementation

- [ ] Product feature specification completed.
- [ ] List, detail, and reusable form screen specifications completed.
- [ ] ADR-001 documents the local state decision.
- [ ] ADR-002 documents API consumption and supplied utilities.
- [ ] All five endpoints and the Product entity documented.
- [ ] This checklist adapted to the assignment.
- [ ] Documentation-only commit recorded before the first implementation commit.
- [ ] Starter templates and framework license retained.

---

## Express API

- [ ] GET /api/products returns 200 with an array.
- [ ] Search matches names without case sensitivity.
- [ ] Category filtering uses exact matching.
- [ ] Search and category filters work together.
- [ ] GET /api/products/:id returns the requested product.
- [ ] POST creates a product with an incremental id and returns 201.
- [ ] PUT updates a product and returns 200.
- [ ] DELETE removes a product and returns 204 without a body.
- [ ] POST and PUT enforce all four field validation rules.
- [ ] Validation collects one details message per problem.
- [ ] Invalid identifiers return 400.
- [ ] Missing products return 404.
- [ ] Errors use the error and details structure.
- [ ] Supplied express.json(), CORS, parseId, 404, and 500 handlers retained and understood.
- [ ] Runtime changes do not rewrite the initial JSON dataset.

---

## Ionic application

- [ ] Data, domain, presentation, and __tests__ folders follow the required structure.
- [ ] State lives in each page using useState and useEffect.
- [ ] HTTP client implements getProduct, createProduct, updateProduct, and deleteProduct.
- [ ] List loads products from the API.
- [ ] Search and five category buttons use filterProducts.
- [ ] Loading, empty catalog, no results, and error/retry states verified.
- [ ] ProductCard uses typed props.
- [ ] Detail displays all product fields.
- [ ] Editing loads the existing product into the reusable form.
- [ ] Creation and editing use inline validateProduct feedback.
- [ ] Server validation details are displayed.
- [ ] Failed saves preserve entered values.
- [ ] Deletion requires an on-screen confirmation.
- [ ] Successful deletion returns to the list.
- [ ] Returning after mutations displays fresh data.
- [ ] toProductView formats COP prices and stock labels correctly.
- [ ] Connection failures display useful feedback.
- [ ] Inputs have accessible labels and errors are readable.
- [ ] Keyboard navigation and a narrow viewport manually checked.

---

## Kotlin

- [ ] kotlin/Product.kt defines id, name, price, category, and nullable stock.
- [ ] val and var are used according to property responsibilities.
- [ ] stockLabel handles null, zero, low stock, and available stock.
- [ ] applyDiscount calculates the discounted price.
- [ ] main prints three products with labels and a 10 percent discount.
- [ ] Code compiles and runs in Kotlin Playground.

---

## Quality

- [ ] At least two new domain unit tests pass.
- [ ] At least two new API tests using startTestServer() pass.
- [ ] A new test exercises a supplied 404 or 500 handler.
- [ ] The handler test is explained in English.
- [ ] npm test passes.
- [ ] npm run lint passes.
- [ ] npm run build passes.
- [ ] Create → view → edit → delete flow manually verified.
- [ ] .env is ignored and .env.example is present.
- [ ] No secrets, node_modules, or generated build files are included in the submission.

---

## README and English

- [ ] README explains dependency installation and environment configuration.
- [ ] README explains npm run server and npm run dev.
- [ ] README explains testing, linting, and building.
- [ ] State management decision contains 3–5 sentences in English.
- [ ] API error handling contains 3–5 sentences in English.
- [ ] Documentation reflects the final implementation and actual verification.

---

## Git and submission

- [ ] Work is on feature/catalogo-productos or another allowed feature/feat branch.
- [ ] At least six meaningful Conventional Commits recorded.
- [ ] Documentation commit precedes implementation commits.
- [ ] Branch pushed to the personal fork.
- [ ] Pull Request targets main in the personal fork.
- [ ] PR includes a description and the verified checklist.
- [ ] PR link submitted as online text in the Moodle partial activity before the deadline.

---

## Scope adaptations from the framework template

- Native Android and iOS packaging is outside this assignment; verification covers the Ionic web app and a narrow viewport.
- Automated domain and API tests are required; UI flows are verified manually.
- Authentication, device permissions, analytics, crash reporting, offline persistence, and multilingual localization are outside scope.
- User-facing text is in Spanish; the required README explanations are in English.
- Delivery requires an open PR toward main in the personal fork. A completed merge or external reviewer approval is not a submission prerequisite.