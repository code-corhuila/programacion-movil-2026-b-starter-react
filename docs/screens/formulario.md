# Screen — Product Form

- **Routes:** `/productos/nuevo` and `/productos/:id/editar`
- **Feature:** Product Catalog
- **Design reference:** Layout specification below; Ionic components from the starter.

---

## Purpose

Allow users to create or edit a product through one reusable form with inline validation and server error feedback.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | IonHeader / IonToolbar / IonTitle | Nuevo producto or Editar producto, depending on the route. |
| Navigation | IonButton or IonBackButton | Leave the form without submitting. |
| Name | IonInput | Required product name, maximum 60 characters. |
| Price | IonInput | Numeric price greater than zero. |
| Category | IonSelect / IonSelectOption | Bebidas, Snacks, Aseo, or Hogar. |
| Stock | IonInput | Integer quantity greater than or equal to zero. |
| Validation | Text below each field | Display errors from `validateProduct`. |
| Server feedback | Error message and details list | Display API rejection messages. |
| Primary action | IonButton | Crear producto or Guardar cambios. |
| Secondary action | IonButton | Cancelar. |

Arrange fields vertically with visible labels. Keep validation messages close to their corresponding fields.

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Create ready | Open the creation route | Empty name, price, and category; stock starts at zero. |
| Loading | Request the existing product in edit mode | Loading indicator; form unavailable until data arrives. |
| Edit ready | Existing product is loaded | Form populated with the current values. |
| Invalid input | Field interaction or submission finds invalid values | Inline validation messages; do not send an invalid request. |
| Saving | POST or PUT request is pending | Progress feedback and disabled submit button. |
| Server rejection | API returns validation errors | Display `error` and every message in `details`; preserve values. |
| Not found | Edit request returns 404 | Product not found message and navigation to the list. |
| Error | Loading or saving request fails | Clear error message; allow recovery. |
| Offline | API cannot be reached | Connection error; preserve entered values after a failed save. |
| Success | API confirms creation or update | Navigate to the product detail. |

An empty catalog does not affect this screen. In edit mode, a missing product uses the not found state.

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Open creation route | Initialize a new form | CreateProduct |
| Open edit route | Load the product identified by the route | ViewProduct |
| Change or leave a field | Update local values and validate interacted fields | ValidateProduct |
| Submit invalid values | Display all field errors without sending a request | ValidateProduct |
| Submit valid values in create mode | Send POST `/api/products` | CreateProduct |
| Submit valid values in edit mode | Send PUT `/api/products/:id` | UpdateProduct |
| Complete save successfully | Open `/productos/:id` using the returned product id | ViewProduct |
| Select Cancelar in create mode | Return to `/productos` | CancelCreate |
| Select Cancelar in edit mode | Return to `/productos/:id` | CancelEdit |
| Retry a failed edit load | Request the existing product again | ViewProduct |

Prevent duplicate submissions while saving. Clear outdated server messages when the user changes the form.

---

## Validation rules

The app and API enforce the same rules.

| Field | Rule |
|-------|------|
| name | Required string; must not be blank; maximum 60 characters. |
| price | Required finite number greater than zero. |
| category | Required; Bebidas, Snacks, Aseo, or Hogar. |
| stock | Required integer greater than or equal to zero. |

Keep numeric input text available while editing. Treat a blank numeric field as invalid rather than converting it to zero.

Use `validateProduct` from the domain layer. The API remains responsible for validating every POST and PUT request.

---

## State and data

- Use `useState` for form values, interacted fields, validation errors, loading, saving, and server errors.
- Use `useEffect` to load the selected product in edit mode when the route id changes.
- Reset values and errors when switching between creation and editing.
- Use `getProduct`, `createProduct`, and `updateProduct` from the data layer.
- Submit name, price, category, and stock; the server assigns the id during creation.
- Distinguish validation errors and missing products through `ApiError`.
- Preserve user input when saving fails.

---

## Accessibility

Planned checks; mark only after verification.

- [ ] Every input has a visible, accessible label.
- [ ] Validation messages are associated with their fields.
- [ ] Touch targets meet the template minimum of 44×44 pt / 48×48 dp.
- [ ] Text remains readable when the browser font size increases.
- [ ] Text and controls meet WCAG AA contrast requirements.
- [ ] Errors are communicated through text, not color alone.
- [ ] Inputs and actions can be used with the keyboard.
- [ ] Saving and server errors use appropriate status or alert semantics.

---

## Verification

- Create a valid product and verify the returned detail.
- Edit an existing product and verify the saved changes.
- Reject a blank or whitespace-only name.
- Reject a name longer than 60 characters.
- Reject a blank, zero, or negative price.
- Reject an absent or unsupported category.
- Reject blank, negative, or fractional stock.
- Accept stock equal to zero.
- Verify server validation details are displayed.
- Stop the API while saving and verify input values remain.
- Verify cancellation does not save changes.
- Open the edit route with a nonexistent product id.