# Screen — Product List

- **Route:** `/productos`
- **Feature:** Product catalog
- **Status:** In progress

---

## Purpose

Display the complete product catalog obtained from the Express API. The user can search products by name, filter them by category and open the detail of a selected product.

---

## Main UI elements

- Page title: `Productos`
- Search input for product name.
- Five category buttons:
  - Todas
  - Bebidas
  - Snacks
  - Aseo
  - Hogar
- Product cards using the reusable `ProductCard` component.
- Button to create a new product.
- Retry button when the API request fails.

---

## Data

The page loads products from:

`GET /api/products`

The page stores the products in local React state.

The search text and selected category are also stored in local state.

Filtering is performed using the domain function:

`filterProducts(products, search, category)`

---

## States

### Loading

Displayed while products are being requested from the API.

### Loaded

Displayed when products are successfully returned.

Each product is rendered using `ProductCard`.

### Empty

Displayed when the API returns an empty product array.

The page informs the user that there are no products available.

### No results

Displayed when products exist but the selected search text or category does not match any product.

### Error

Displayed when the API request fails.

The page shows the error message and a `Reintentar` button that executes the request again.

---

## Navigation

Selecting a product navigates to:

`/productos/:id`

The new product action navigates to:

`/productos/nuevo`

---

## Components

### ProductCard

Receives typed props representing the product information.

It displays:

- Name
- Category
- Formatted price
- Stock label

The formatted view data is obtained through `toProductView`.

---

## Acceptance criteria

- [ ] Products are loaded from the API.
- [ ] Search works by product name.
- [ ] Search is case-insensitive.
- [ ] Category filtering works.
- [ ] The five required category buttons are visible.
- [ ] Loading state is visible.
- [ ] Empty state is visible when there are no products.
- [ ] No-results state is visible when filters return no matches.
- [ ] Error state includes a retry action.
- [ ] Product cards use typed props.
- [ ] Selecting a product opens its detail page.