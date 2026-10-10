# Screen — Product List

- **Route:** `/productos`
- **Feature:** Product Catalog
- **Design reference:** Layout specification below; Ionic components from the starter.

---

## Purpose

Allow users to browse products, search by name, filter by category, open product details, and access the creation form.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | IonHeader / IonToolbar / IonTitle | Display Productos. |
| Search | IonSearchbar | Search product names without case sensitivity. |
| Categories | Five IonButton components | Todas, Bebidas, Snacks, Aseo, and Hogar. Indicate the selected category. |
| Body | ProductCard components | Typed props; display name, formatted price, category, and stock label. |
| Feedback | Loading indicator / EmptyState / error message | Distinguish loading, empty catalog, no results, and request failure. |
| Primary action | IonButton | Nuevo producto opens `/productos/nuevo`. |

The search and category controls appear above the cards. Category buttons wrap on narrow screens.

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | Initial request or retry is pending | Loading indicator. |
| Loaded | API returns products and filters have matches | Product cards. |
| Empty | API returns an empty array | Empty catalog message and create action. |
| No results | Catalog contains products but filters match none | No results message suggesting a change to the filters. |
| Error | Request fails | Error message and Reintentar button. |
| Offline | API cannot be reached because of connectivity | Connection error and retry action; no cached catalog is available. |

Determine the empty catalog state from the original products array and the no results state from the filtered array.

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Open the page | Load products from the API | LoadProducts |
| Enter search text | Apply name and selected category filters with `filterProducts` | FilterProducts |
| Select a category | Apply category and current search filters with `filterProducts` | FilterProducts |
| Select Todas | Remove the category restriction and keep the search text | FilterProducts |
| Open a product | Navigate to `/productos/:id` | ViewProduct |
| Select Nuevo producto | Navigate to `/productos/nuevo` | CreateProduct |
| Select Reintentar | Request products again | LoadProducts |
| Return after a successful mutation | Refresh the catalog to reflect changes | LoadProducts |

Filtering is performed locally on products loaded from the API. The API also supports its own search and category query parameters.

---

## State and data

- Use `useState` for products, search text, selected category, loading, and request error.
- Use `useEffect` to load data when the page becomes active through the chosen routing implementation.
- Derive filtered products using `filterProducts`; do not store a second mutable copy of the catalog.
- Use `toProductView` to obtain the formatted price and stock label.
- Read data through `getProducts` in the data layer.
- Keep HTTP requests outside ProductCard.

---

## Accessibility

Planned checks; mark only after verification.

- [ ] All interactive elements have accessible labels.
- [ ] Touch targets meet the template minimum of 44×44 pt / 48×48 dp.
- [ ] Text remains readable when the browser font size increases.
- [ ] Text and controls meet WCAG AA contrast requirements.
- [ ] The active category is identified beyond color alone.
- [ ] Loading and error feedback are announced with appropriate status or alert semantics.

---

## Verification

- Load the initial eight products.
- Search using uppercase and lowercase text.
- Combine a search with each category.
- Verify Todas removes only the category filter.
- Use an unmatched search to verify the no results state.
- Verify an empty API response produces the empty catalog state.
- Stop the API, verify the error state, restart it, and retry.
- Open a product detail and the creation form.
- Return after creating, editing, or deleting a product and verify refreshed data.