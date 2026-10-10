# Screen — Product Detail

- **Route:** `/productos/:id`
- **Feature:** Product Catalog
- **Design reference:** Layout specification below; Ionic components from the starter.

---

## Purpose

Display all fields of a selected product and allow users to edit it or delete it after an on-screen confirmation.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | IonHeader / IonToolbar / IonTitle | Display Detalle del producto. |
| Navigation | IonButton or IonBackButton | Return to `/productos`. |
| Body | Product information | Display id, name, COP price, category, stock quantity, and stock label. |
| Feedback | Loading indicator / error message | Show loading, not found, and other request errors. |
| Actions | IonButton components | Editar and Eliminar. |
| Confirmation | On-screen message and buttons | Confirmar eliminación and Cancelar. |

Place product information above the edit and delete actions. Show the confirmation only after the user selects Eliminar.

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | Product request is pending | Loading indicator. |
| Loaded | API returns the selected product | All product fields and available actions. |
| Not found | API returns 404 | Product not found message and navigation to the list. |
| Invalid identifier | Route identifier is not numeric | Clear error message and navigation to the list. |
| Error | Product request fails | Error message with a retry action. |
| Offline | API cannot be reached | Connection error with retry; no cached product is available. |
| Confirming deletion | User selects Eliminar | Confirmation message with confirm and cancel buttons. |
| Deleting | DELETE request is pending | Progress feedback and disabled mutation controls. |
| Delete error | DELETE request fails | Error message; keep product information visible when available. |

Empty is represented by the not found state because this page requests one product.

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Open the page | Read the route id and request the product | ViewProduct |
| Select Editar | Navigate to `/productos/:id/editar` | UpdateProduct |
| Select Eliminar | Show the on-screen confirmation | RequestDelete |
| Select Cancelar | Hide confirmation without deleting | CancelDelete |
| Confirm deletion | Send DELETE request for the selected id | DeleteProduct |
| Complete deletion successfully | Navigate to `/productos` | ReturnToList |
| Select Reintentar | Request the product again | ViewProduct |
| Select Volver | Navigate to `/productos` | ReturnToList |

Do not navigate away after a failed deletion. Prevent repeated submissions while deletion is pending.

---

## State and data

- Use `useState` for product, loading, request error, delete confirmation, deleting, and delete error.
- Use `useEffect` to load the product when the active route id changes.
- Use `getProduct` and `deleteProduct` from the data layer.
- Use `toProductView` for COP formatting and the stock label.
- Distinguish a 404 response through `ApiError`.
- Reload product data after returning from a successful edit.
- A successful DELETE returns 204 with no response body.

---

## Accessibility

Planned checks; mark only after verification.

- [ ] All interactive elements have accessible labels.
- [ ] Touch targets meet the template minimum of 44×44 pt / 48×48 dp.
- [ ] Text remains readable when the browser font size increases.
- [ ] Text and controls meet WCAG AA contrast requirements.
- [ ] Confirmation clearly identifies the product being deleted.
- [ ] Loading and errors use appropriate status or alert semantics.
- [ ] Confirmation controls can be reached and used with the keyboard.

---

## Verification

- Open an existing product and verify all five fields.
- Verify COP price formatting and stock labels.
- Open a nonexistent product id and verify the not found state.
- Open a nonnumeric id and verify the invalid identifier state.
- Stop the API and verify request error and retry behavior.
- Open the edit form and return after saving.
- Select Eliminar and cancel; verify the product remains.
- Confirm deletion; verify navigation to the list and removal of the product.
- Verify a failed deletion displays an error and allows recovery.