import { describe, expect, it } from 'vitest';
import seedProducts from '../../../../server/data/products.json';
import {
  CATEGORIES,
  filterProducts,
  formatCOP,
  LOW_STOCK_THRESHOLD,
  toProductView,
  validateProduct,
  type Product,
  type ProductInput,
} from '../domain/product';

/**
 * Pruebas unitarias de la capa de dominio.
 * Autor: Andrés Felipe Gómez Anacona.
 * Son funciones puras: no hay red, ni pantallas, ni estado compartido.
 */
describe('datos semilla de la API (ejemplo)', () => {
  it('trae 8 productos con ids 1 a 8', () => {
    expect(seedProducts).toHaveLength(8);
    expect(seedProducts.map((item) => item.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('usa solo categorías permitidas y stock entero no negativo', () => {
    for (const item of seedProducts) {
      expect(CATEGORIES).toContain(item.category);
      expect(Number.isInteger(item.stock)).toBe(true);
      expect(item.stock).toBeGreaterThanOrEqual(0);
    }
  });

  it('incluye productos agotados y con pocas unidades para probar las etiquetas', () => {
    expect(seedProducts.some((item) => item.stock === 0)).toBe(true);
    expect(seedProducts.some((item) => item.stock > 0 && item.stock < LOW_STOCK_THRESHOLD)).toBe(true);
  });
});

describe('formatCOP (ejemplo)', () => {
  it('separa los miles con punto y antepone el signo de pesos', () => {
    expect(formatCOP(1250000)).toBe('$ 1.250.000');
    expect(formatCOP(8500)).toBe('$ 8.500');
    expect(formatCOP(950)).toBe('$ 950');
  });
});

describe('validateProduct', () => {
  const validInput: ProductInput = { name: 'Arroz 500 g', price: 3200, category: 'Hogar', stock: 40 };

  it('acepta un producto válido sin errores', () => {
    const result = validateProduct(validInput);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('acepta los límites: nombre de 60 caracteres, precio mínimo positivo y stock 0', () => {
    const result = validateProduct({ name: 'x'.repeat(60), price: 0.01, category: 'Aseo', stock: 0 });

    expect(result.isValid).toBe(true);
  });

  it('rechaza un nombre vacío, solo con espacios o de más de 60 caracteres', () => {
    expect(validateProduct({ ...validInput, name: '' }).errors.name).toBeDefined();
    expect(validateProduct({ ...validInput, name: '   ' }).errors.name).toBeDefined();
    expect(validateProduct({ ...validInput, name: 'x'.repeat(61) }).errors.name).toBeDefined();
  });

  it('rechaza un precio menor o igual que 0 y un precio que no es un número finito', () => {
    expect(validateProduct({ ...validInput, price: 0 }).errors.price).toBeDefined();
    expect(validateProduct({ ...validInput, price: -10 }).errors.price).toBeDefined();
    expect(validateProduct({ ...validInput, price: Number.NaN }).errors.price).toBeDefined();
    expect(validateProduct({ ...validInput, price: Number.POSITIVE_INFINITY }).errors.price).toBeDefined();
  });

  it('rechaza una categoría no permitida o vacía', () => {
    expect(validateProduct({ ...validInput, category: 'Ropa' }).errors.category).toBeDefined();
    expect(validateProduct({ ...validInput, category: '' }).errors.category).toBeDefined();
    expect(validateProduct({ ...validInput, category: 'bebidas' }).errors.category).toBeDefined();
  });

  it('rechaza un stock negativo o decimal', () => {
    expect(validateProduct({ ...validInput, stock: -1 }).errors.stock).toBeDefined();
    expect(validateProduct({ ...validInput, stock: 2.5 }).errors.stock).toBeDefined();
  });

  it('reporta un error por cada campo inválido a la vez', () => {
    const result = validateProduct({ name: '  ', price: 0, category: 'Ropa', stock: -3 });

    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual(['category', 'name', 'price', 'stock']);
  });

  it('trata los campos ausentes como inválidos', () => {
    const result = validateProduct({});

    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual(['category', 'name', 'price', 'stock']);
  });
});

describe('toProductView', () => {
  const baseProduct: Product = { id: 1, name: 'Agua mineral 600 ml', price: 1800, category: 'Bebidas', stock: 10 };

  it('marca «Agotado» cuando el stock es 0', () => {
    const view = toProductView({ ...baseProduct, stock: 0 });

    expect(view.stockLabel).toBe('Agotado');
    expect(view.isOutOfStock).toBe(true);
    expect(view.isLowStock).toBe(false);
  });

  it('marca «Pocas unidades» cuando el stock es 3', () => {
    const view = toProductView({ ...baseProduct, stock: 3 });

    expect(view.stockLabel).toBe('Pocas unidades');
    expect(view.isOutOfStock).toBe(false);
    expect(view.isLowStock).toBe(true);
  });

  it('marca «Disponible» cuando el stock es 10', () => {
    const view = toProductView({ ...baseProduct, stock: 10 });

    expect(view.stockLabel).toBe('Disponible');
    expect(view.isOutOfStock).toBe(false);
    expect(view.isLowStock).toBe(false);
  });

  it('respeta el umbral: stock 4 es «Pocas unidades» y stock 5 es «Disponible»', () => {
    expect(toProductView({ ...baseProduct, stock: 4 }).stockLabel).toBe('Pocas unidades');
    expect(toProductView({ ...baseProduct, stock: 5 }).stockLabel).toBe('Disponible');
  });

  it('formatea el precio en pesos colombianos', () => {
    expect(toProductView({ ...baseProduct, price: 1800 }).priceLabel).toBe('$ 1.800');
    expect(toProductView({ ...baseProduct, price: 189900 }).priceLabel).toBe('$ 189.900');
    expect(toProductView({ ...baseProduct, price: 1250000 }).priceLabel).toBe('$ 1.250.000');
  });

  it('conserva id, categoría y stock, y quita los espacios sobrantes del nombre', () => {
    const view = toProductView({ id: 7, name: '  Jabón de manos 250 ml  ', price: 6900, category: 'Aseo', stock: 3 });

    expect(view).toEqual({
      id: 7,
      name: 'Jabón de manos 250 ml',
      priceLabel: '$ 6.900',
      category: 'Aseo',
      stock: 3,
      stockLabel: 'Pocas unidades',
      isLowStock: true,
      isOutOfStock: false,
    });
  });
});

describe('filterProducts', () => {
  const products: Product[] = seedProducts;

  it('filtra por texto parcial sin distinguir mayúsculas', () => {
    const result = filterProducts(products, { search: 'AGUA' });

    expect(result.map((item) => item.id)).toEqual([1]);
    expect(filterProducts(products, { search: 'l' }).length).toBeGreaterThan(1);
  });

  it('filtra por categoría exacta', () => {
    const result = filterProducts(products, { category: 'Bebidas' });

    expect(result.map((item) => item.id)).toEqual([1, 2, 3]);
    expect(filterProducts(products, { category: 'bebidas' })).toEqual([]);
  });

  it('combina texto y categoría', () => {
    const result = filterProducts(products, { search: 'jugo', category: 'Bebidas' });

    expect(result.map((item) => item.id)).toEqual([2]);
    expect(filterProducts(products, { search: 'jugo', category: 'Aseo' })).toEqual([]);
  });

  it('no filtra con texto vacío, solo espacios, categoría vacía o filtros ausentes', () => {
    expect(filterProducts(products, {})).toHaveLength(8);
    expect(filterProducts(products, { search: '', category: '' })).toHaveLength(8);
    expect(filterProducts(products, { search: '   ' })).toHaveLength(8);
  });

  it('devuelve un arreglo vacío cuando nada coincide', () => {
    expect(filterProducts(products, { search: 'zzz' })).toEqual([]);
  });

  it('devuelve un arreglo nuevo y no modifica el original', () => {
    const copy = products.map((item) => ({ ...item }));
    const result = filterProducts(products, {});

    expect(result).not.toBe(products);
    expect(products).toEqual(copy);
  });
});