# API Integration — Products

- **Resource:** Products
- **Base path:** `/api/products`
- **Format:** JSON
- **Persistence:** In-memory

## Overview

The Products API provides CRUD operations for the product catalog.

A product has the following structure:

```json
{
  "id": 1,
  "name": "Café",
  "price": 12500,
  "category": "Bebidas",
  "stock": 8
}