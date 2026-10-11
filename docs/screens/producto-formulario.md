# Screen — Product Form

- **Routes:**
  - `/productos/nuevo`
  - `/productos/:id/editar`
- **Feature:** Product catalog
- **Status:** In progress

---

## Purpose

Provide a single reusable screen for creating and editing products. The form validates the same business rules required by the Express API before sending the request.

---

## Fields

### Name

- Required.
- Must be text.
- Cannot contain only whitespace.
- Maximum length: 60 characters.

### Price

- Required.
- Must be a number.
- Must be greater than 0.

### Category

- Required.
- Allowed values:
  - Bebidas
  - Snacks
  - Aseo
  - Hogar

### Stock

- Required.
- Must be an integer.
- Must be greater than or equal to 0.

---

## Modes

### Create mode

Route:

`/productos/nuevo`

Uses:

`POST /api/products`

A successful request returns HTTP 201.

### Edit mode

Route:

`/productos/:id/editar`

The existing product is loaded using:

`GET /api/products/:id`

The update request uses:

`PUT /api/products/:id`

A successful request returns HTTP 200.

---

## Validation

Client-side validation is performed using:

`validateProduct`

Validation messages are displayed inline next to or below the corresponding fields.

The app applies the same validation rules as the API.

---

## Server errors

If the API rejects a request, the client handles the response using `ApiError`.

The response format is:

```json
{
  "error": "Datos inválidos",
  "details": [
    "validation message"
  ]
}