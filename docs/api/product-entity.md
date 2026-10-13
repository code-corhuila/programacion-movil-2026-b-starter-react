# Product Entity

- **Store:** N/A (almacenamiento en memoria).
- **Table/collection:** N/A (almacenamiento en memoria).
- **Schema version introduced:** N/A (almacenamiento en memoria).

## Fields

| Field | Type | Null | Rules |
|---|---|---|---|
| `id` | integer | No | Identificador incremental asignado por la API |
| `name` | string | No | Texto no vacío, máximo 60 caracteres |
| `price` | number | No | Número mayor que cero |
| `category` | string | No | Bebidas, Snacks, Aseo u Hogar |
| `stock` | integer | No | Entero mayor o igual que cero |

## Indexes

N/A (almacenamiento en memoria).

## Relationships

N/A (almacenamiento en memoria).

## Sync

- **Synced?** No; los datos se gestionan en memoria.
- **Conflict policy:** N/A (almacenamiento en memoria).

## Migration notes

N/A (almacenamiento en memoria).
