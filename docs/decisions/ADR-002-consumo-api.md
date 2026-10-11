# ADR-002 — REST API consumption and error handling

- **Status:** Accepted
- **Date:** 2026-10-11

## Context

The Ionic React application must consume the Express API located under `/api/products`.

The starter already provides:

- `API_URL`
- `ApiError`
- `getProducts`
- error handling utilities

The application needs to distinguish successful HTTP responses from validation errors, not-found responses and unexpected server errors.

The Express API returns errors using this structure:

```json
{
  "error": "message",
  "details": [
    "detail message"
  ]
}