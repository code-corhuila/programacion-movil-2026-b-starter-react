/**
 * Capa DOMAIN de la funcionalidad «Productos» (nombres de capa del framework:
 * `01-architecture/layers-and-state` → data / domain / presentation).
 *
 * Solo tipos, constantes y funciones puras: aquí no hay HTTP, ni React, ni Ionic
 * (regla de dependencias del framework: el dominio no depende de nada de afuera).
 *
 * Los tipos, las constantes y `formatCOP` ya vienen dados. Las tres funciones
 * `toProductView`, `validateProduct` y `filterProducts` son STUBS: se implementan
 * en la Parte 3 del TODO.md.
 */

/** Producto tal como lo entrega la API. */
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

/** Datos que captura el formulario (aún sin id). */
export interface ProductInput {
  name: string;
  price: number;
  category: string;
  stock: number;
}

/** Producto listo para mostrarse en la interfaz. */
export interface ProductView {
  id: number;
  name: string;
  /** Precio en pesos colombianos, p. ej. "$ 1.250.000". */
  priceLabel: string;
  category: string;
  stock: number;
  /** "Agotado" (0) · "Pocas unidades" (menos de LOW_STOCK_THRESHOLD) · "Disponible". */
  stockLabel: string;
  /** true cuando quedan entre 1 y LOW_STOCK_THRESHOLD - 1 unidades. */
  isLowStock: boolean;
  /** true cuando no quedan unidades (stock = 0). */
  isOutOfStock: boolean;
}

/** Campos del formulario que pueden tener un error de validación. */
export type ProductField = 'name' | 'price' | 'category' | 'stock';

/** Resultado de validar un `ProductInput`. */
export interface ValidationResult {
  isValid: boolean;
  /** Mensaje de error por campo. Vacío si `isValid` es true. */
  errors: Partial<Record<ProductField, string>>;
}

/** Filtros de la lista. `category` vacío significa «todas». */
export interface ProductFilters {
  search: string;
  category: string;
}

/** Categorías permitidas (las mismas que valida la API). */
export const CATEGORIES = ['Bebidas', 'Snacks', 'Aseo', 'Hogar'] as const;

/** Longitud máxima del nombre. */
export const NAME_MAX_LENGTH = 60;

/** Umbral de «pocas unidades»: un stock menor que este valor (y mayor que 0). */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * YA DADO. Formatea un número como pesos colombianos con separador de miles «.»:
 * formatCOP(1250000) → "$ 1.250.000"; formatCOP(8500) → "$ 8.500".
 * (El separador se pone con una expresión regular sobre el número redondeado.)
 */
export function formatCOP(value: number): string {
  const digits = Math.round(value).toString();
  return `$ ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/**
 * Convierte un `Product` en un `ProductView`.
 *
 * Contrato:
 *  - `name`: sin espacios sobrantes al inicio ni al final.
 *  - `priceLabel`: el precio con `formatCOP` (p. ej. 1250000 → "$ 1.250.000").
 *  - `stockLabel`: «Agotado» si stock = 0 · «Pocas unidades» si stock < LOW_STOCK_THRESHOLD · «Disponible» en otro caso.
 *  - `isOutOfStock` e `isLowStock` coherentes con la etiqueta; `id`, `category` y `stock` pasan sin cambios.
 *
 * TODO(Parte 3): implementar (hoy devuelve valores de relleno).
 */
export function toProductView(product: Product): ProductView {
  const stock = product.stock;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < LOW_STOCK_THRESHOLD;

  let stockLabel = 'Disponible';

  if (isOutOfStock) {
    stockLabel = 'Agotado';
  } else if (isLowStock) {
    stockLabel = 'Pocas unidades';
  }

  return {
    id: product.id,
    name: product.name.trim(),
    priceLabel: formatCOP(product.price),
    category: product.category,
    stock,
    stockLabel,
    isLowStock,
    isOutOfStock,
  };
}

/**
 * Valida los datos del formulario con las MISMAS reglas que la API.
 *
 * Contrato:
 *  - `name`: obligatorio (solo espacios cuenta como vacío) y de máximo NAME_MAX_LENGTH caracteres.
 *  - `price`: número finito mayor que 0.
 *  - `category`: obligatoria y una de CATEGORIES.
 *  - `stock`: entero mayor o igual que 0.
 *  - `errors` trae un mensaje por cada campo inválido; `isValid` es true solo si no hay errores.
 *
 * TODO(Parte 3): implementar (hoy da por válido cualquier dato).
 */
export function validateProduct(input: ProductInput): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  if (typeof input.name !== 'string' || input.name.trim().length === 0) {
    errors.name = 'El nombre es obligatorio.';
  } else if (input.name.trim().length > NAME_MAX_LENGTH) {
    errors.name = `El nombre no puede superar los ${NAME_MAX_LENGTH} caracteres.`;
  }

  if (typeof input.price !== 'number' || !Number.isFinite(input.price) || input.price <= 0) {
    errors.price = 'El precio debe ser un número mayor que cero.';
  }

  if (!CATEGORIES.includes(input.category as (typeof CATEGORIES)[number])) {
    errors.category = 'Selecciona una categoría válida.';
  }

  if (!Number.isInteger(input.stock) || input.stock < 0) {
    errors.stock = 'El inventario debe ser un entero mayor o igual que cero.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Filtra la lista en memoria.
 *
 * Contrato:
 *  - `search`: conserva los productos cuyo nombre CONTIENE el texto, sin distinguir mayúsculas
 *    (un texto vacío o de espacios no filtra).
 *  - `category`: conserva solo los de esa categoría exacta (vacío = todas).
 *  - Devuelve un arreglo nuevo; no modifica el original.
 *
 * TODO(Parte 3): implementar (hoy devuelve la lista sin filtrar).
 */
export function filterProducts(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  const search = filters.search.trim().toLowerCase();
  const category = filters.category;

  return products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(search);
    const matchesCategory = category === '' || product.category === category;

    return matchesName && matchesCategory;
  });
}