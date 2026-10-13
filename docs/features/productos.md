# Catálogo de productos

## Propósito
Permitir consultar, buscar, filtrar, crear, ver, editar y eliminar productos mediante una aplicación Ionic React conectada a una API Express.

## Pantallas

| Pantalla | Ruta | Función |
|---|---|---|
| Lista | `/productos` | Mostrar, buscar y filtrar productos |
| Detalle | `/productos/:id` | Ver todos los datos y acceder a editar o eliminar |
| Crear | `/productos/nuevo` | Registrar un producto |
| Editar | `/productos/:id/editar` | Modificar un producto existente |

## Estado
Cada página administra su estado con `useState` y carga los datos con `useEffect`. La lista distingue carga, lista vacía, resultados vacíos por filtros y error. El detalle distingue carga, producto encontrado, producto inexistente y error. El formulario controla los campos, la validación y el envío.

## Datos y API
- `GET /api/products`: lista y filtros `search` y `category`.
- `GET /api/products/:id`: consulta un producto.
- `POST /api/products`: crea un producto.
- `PUT /api/products/:id`: actualiza un producto.
- `DELETE /api/products/:id`: elimina un producto.

La entidad contiene `id`, `name`, `price`, `category` y `stock`. Las categorías válidas son Bebidas, Snacks, Aseo y Hogar.

## Casos límite
Identificador inválido, producto inexistente, lista vacía, búsqueda sin coincidencias, nombre vacío o de más de 60 caracteres, precio no positivo, categoría inválida, stock negativo o no entero, error de red y respuesta HTTP no exitosa.

## Pruebas previstas
Probar filtros por texto y categoría, validación de los campos, formato del precio y etiqueta de stock. Probar además POST inválido, GET de identificador inexistente y las respuestas de los endpoints.
