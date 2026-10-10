# Local Entity — Product

- **Store:** N/A, in-memory storage in the Express API.
- **Table/collection:** Runtime products array.
- **Schema version introduced:** N/A; no persistent database schema.
- **Initial data:** `server/data/products.json`, containing eight products.

---

## Fields

| Field | Type | Null | Notes |
|-------|------|------|-------|
| id | number | No | Unique numeric identifier assigned by the server; incremental for new products. |
| name | string | No | Required, not blank, maximum 60 characters. |
| price | number | No | Finite number greater than zero; expressed in Colombian pesos. |
| category | string | No | Bebidas, Snacks, Aseo, or Hogar. |
| stock | integer | No | Quantity greater than or equal to zero. |

POST and PUT receive name, price, category, and stock. The server assigns the id on creation and preserves it on update.

The API and TypeScript domain require a non-null stock. The separate Kotlin exercise permits nullable stock to demonstrate null handling; this does not change the API contract.

---

## Indexes

| Index | Columns | Reason |
|-------|---------|--------|
| N/A | N/A | No database indexes are used. Products are searched and filtered in the runtime array. |

Product lookup uses the id. List filtering uses name and category.

---

## Relationships

| Related entity | Key | Cardinality |
|----------------|-----|-------------|
| None | N/A | Products are independent within this assignment. |

Category is a restricted field, not a separate related entity.

---

## Sync

- **Synced?** No persistent synchronization or offline replication.
- **Conflict policy:** Requests update the current server state; no version-based conflict detection is implemented.
- **Client refresh:** Pages request fresh data after successful mutations.
- **Offline behavior:** No local persistence; failed saves preserve form values while the page remains active.

---

## Migration notes

N/A, in-memory storage.

At startup, the server initializes the runtime catalog from the JSON dataset. Creating, updating, or deleting a product changes only the runtime catalog and does not rewrite the JSON file.

Restarting the server discards runtime changes and restores the initial products. No database migrations are required.

---

## Display transformations

Use `toProductView` to derive display values without changing stored data.

| Source | Display |
|--------|---------|
| price | COP formatting through formatCOP, for example `$ 1.250.000`. |
| stock = 0 | Agotado |
| stock from 1 to 4 | Pocas unidades |
| stock >= 5 | Disponible |

---

## Related documents

- [Product Catalog](../features/productos.md)
- [Products Endpoints](products-endpoints.md)
- [ADR-002 — API consumption](../decisions/ADR-002-consumo-api.md)