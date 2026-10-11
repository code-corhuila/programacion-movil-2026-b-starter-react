# Screen — Product Detail

- **Route:** `/productos/:id`
- **Feature:** Product catalog
- **Status:** In progress

---

## Purpose

Display all information for a single product selected from the product list. The screen also allows the user to edit or delete the product.

---

## Main UI elements

- Product name.
- Product identifier.
- Category.
- Formatted price.
- Stock quantity.
- Stock label.
- Edit button.
- Delete button.
- Simple delete confirmation shown on the screen.

---

## Data

The product identifier is read from the route using React Router.

Example:

`const productId = Number(useParams<{ id: string }>().id);`

The product is obtained from:

`GET /api/products/:id`

The page stores the product, loading state and error state using React `useState`.

The request is executed when the page loads using `useEffect`.

---

## States

### Loading

Displayed while the selected product is being requested.

### Loaded

Displays all product fields:

- id
- name
- price
- category
- stock

The product view uses `toProductView` to obtain the formatted price and stock label.

### Not found

Displayed when the API returns a 404 response because the product does not exist.

### Error

Displayed when another API or network error occurs.

---

## Actions

### Edit

Navigates to:

`/productos/:id/editar`

### Delete

The user must confirm the delete action before the request is sent.

The request uses:

`DELETE /api/products/:id`

If the deletion succeeds with HTTP 204, the application navigates back to:

`/productos`

---

## Stock labels

- `0` → `Agotado`
- `< 5` → `Pocas unidades`
- `>= 5` → `Disponible`

---

## Acceptance criteria

- [ ] Product data is loaded using its route id.
- [ ] All product fields are displayed.
- [ ] Price is formatted using `formatCOP`.
- [ ] Correct stock label is displayed.
- [ ] Loading state is implemented.
- [ ] Product-not-found error is handled.
- [ ] General API errors are handled.
- [ ] Edit button opens the edit form.
- [ ] Delete action requires confirmation.
- [ ] Successful deletion returns to the product list.