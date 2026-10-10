# Endpoint Integration — Products

- **Feature:** Product Catalog
- **Base URL:** Configured through the starter API_URL.
- **Resource:** `/api/products`
- **Auth required:** No
- **Status:** Planned contract

---

## Request

### Endpoints

| Method + path | Purpose | Request body |
|---------------|---------|--------------|
| GET /api/products | List products with optional filters | None |
| GET /api/products/:id | Retrieve one product | None |
| POST /api/products | Create a product | Product input |
| PUT /api/products/:id | Update all editable product fields | Product input |
| DELETE /api/products/:id | Delete a product | None |

### Parameters

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| id | path | number | For detail, update, and delete | Validated by the supplied parseId utility. |
| search | query | string | No | Product name contains the text, without case sensitivity. |
| category | query | string | No | Exact category match. |

Example filtered request:

`GET /api/products?search=agua&category=Bebidas`

When both filters are supplied, products must satisfy both conditions. No matches return an empty array with status 200.

### Body for POST and PUT

```json
{
  "name": "Agua mineral",
  "price": 2500,
  "category": "Bebidas",
  "stock": 10
}
```

The server assigns the id during creation. Updating a product preserves its existing id.

### Validation

| Field | Rule |
|-------|------|
| name | Required string, not blank, maximum 60 characters. |
| price | Finite number greater than zero. |
| category | Bebidas, Snacks, Aseo, or Hogar. |
| stock | Integer greater than or equal to zero. |

POST and PUT collect all validation problems and return one message in details for each problem. Invalid requests do not modify the catalog.

---

## Response

### GET /api/products — 200

Returns an array of products. This is an illustrative response, not a copy of the starter dataset.

```json
[
  {
    "id": 1,
    "name": "Agua mineral",
    "price": 2500,
    "category": "Bebidas",
    "stock": 10
  }
]
```

An empty catalog or filters without matches return:

```json
[]
```

### GET /api/products/:id — 200

```json
{
  "id": 1,
  "name": "Agua mineral",
  "price": 2500,
  "category": "Bebidas",
  "stock": 10
}
```

### POST /api/products — 201

Returns the created product with a new incremental id.

```json
{
  "id": 9,
  "name": "Agua mineral",
  "price": 2500,
  "category": "Bebidas",
  "stock": 10
}
```

The example id assumes the highest initial id is 8. The implementation assigns ids according to the actual initial dataset and subsequent creations.

### PUT /api/products/:id — 200

Returns the updated product.

```json
{
  "id": 1,
  "name": "Agua mineral",
  "price": 3000,
  "category": "Bebidas",
  "stock": 4
}
```

### DELETE /api/products/:id — 204

Returns no response body. The client must not call response.json() for this successful response.

### DTO → domain mapping

| DTO field | Domain field | Transform |
|-----------|--------------|-----------|
| id | Product.id | Preserve numeric identifier. |
| name | Product.name | Preserve product name. |
| price | Product.price | Preserve numeric price; format for display with formatCOP. |
| category | Product.category | Preserve the allowed category. |
| stock | Product.stock | Preserve integer quantity; derive label with toProductView. |

Display labels:

- Stock 0: Agotado.
- Stock 1–4: Pocas unidades.
- Stock 5 or more: Disponible.

Display formatting does not modify the numeric API values.

---

## Errors

Every error response uses this structure:

```json
{
  "error": "message",
  "details": ["problem description"]
}
```

details is always an array and may be empty when there are no additional details.

Illustrative validation response:

```json
{
  "error": "Datos inválidos",
  "details": [
    "name es obligatorio",
    "price debe ser mayor que 0"
  ]
}
```

Exact text from supplied handlers will be retained.

| Endpoint | Status | Meaning | App behavior |
|----------|--------|---------|--------------|
| GET /api/products | 200 | List request succeeds, including no matches | Display products, empty catalog, or no results. |
| GET /api/products/:id | 400 | Invalid identifier | Display identifier error. |
| GET /api/products/:id | 404 | Product does not exist | Display not found state. |
| POST /api/products | 400 | Invalid product input | Display validation details and preserve values. |
| PUT /api/products/:id | 400 | Invalid identifier or input | Display error and validation details. |
| PUT /api/products/:id | 404 | Product does not exist | Display not found feedback. |
| DELETE /api/products/:id | 400 | Invalid identifier | Display error without navigating away. |
| DELETE /api/products/:id | 404 | Product does not exist | Display missing product feedback. |
| Unknown route | 404 | No route matches the request | Display the supplied handler message. |
| Any request | 500 | Unexpected server failure | Display server error and allow appropriate recovery. |
| Any request | No HTTP response | Connection failure | Display connection feedback; preserve unsaved form values. |

ApiError represents unsuccessful HTTP responses using their status, error message, and details. A network failure is handled separately because it has no HTTP status.

---

## Caching / offline

- **Strategy:** Online-only.
- **Cached entity:** None.
- **TTL / invalidation:** No persistent client cache. Reload data after successful mutations and when returning to a page that requires fresh data.
- **Server storage:** In-memory catalog initialized from server/data/products.json.
- **Restart behavior:** Server restart restores the initial dataset and discards runtime changes.

---

## Verification

Use startTestServer() for API integration tests.

- Verify list and combined filters.
- Verify retrieval of an existing and nonexistent product.
- Verify valid creation returns 201 and an incremental id.
- Verify invalid creation returns 400 with accumulated details.
- Verify successful update and rejected invalid update.
- Verify deletion returns 204 with an empty body.
- Verify invalid identifiers return 400.
- Request an unknown route to exercise the supplied 404 handler.

---

## Related documents

- [Product Catalog](../features/productos.md)
- [Product Entity](product-entity.md)
- [ADR-002 — API consumption](../decisions/ADR-002-consumo-api.md)