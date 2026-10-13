// Ejercicio Kotlin · Parte 4 del TODO.md
// Autor: Andrés Felipe Gómez Anacona
//
// Alcance: solo lo visto en la semana 7 (val/var, funciones, clases, tipos que admiten null,
// `?.`, `?:`, if/when, plantillas de cadena). No exige proyecto Android.
// Cómo ejecutarlo: pegue el archivo en https://play.kotlinlang.org o compílelo con `kotlinc`.

/**
 * Producto del catálogo.
 *  - `id` es `val`: la identidad de un producto no cambia nunca.
 *  - `name`, `price`, `category` y `stock` son `var`: pueden actualizarse (renombrar, cambiar el
 *    precio, mover de categoría, reponer inventario).
 *  - `stock` es `Int?`: puede ser `null` cuando no se conoce el inventario.
 */
class Product(
    val id: Int,
    var name: String,
    var price: Double,
    var category: String,
    var stock: Int?,
)

/**
 * Etiqueta de disponibilidad según el stock.
 *   null → "Sin dato" · 0 → "Agotado" · menos de 5 → "Pocas unidades" · otro caso → "Disponible"
 * Tras comprobar `stock == null`, Kotlin ya trata `stock` como `Int` (no nulo) en las demás ramas.
 */
fun stockLabel(stock: Int?): String = when {
    stock == null -> "Sin dato"
    stock == 0 -> "Agotado"
    stock < 5 -> "Pocas unidades"
    else -> "Disponible"
}

/**
 * Devuelve el precio con el descuento aplicado (p. ej. 10000.0 con 15 % → 8500.0).
 */
fun applyDiscount(price: Double, percent: Int): Double = price * (100 - percent) / 100.0

fun main() {
    val products = listOf(
        Product(1, "Agua mineral 600 ml", 1800.0, "Bebidas", 120),
        Product(2, "Gaseosa cola 1,5 L", 4800.0, "Bebidas", 4),
        Product(5, "Galletas de avena x6", 2700.0, "Snacks", 0),
        Product(9, "Arroz 500 g", 3200.0, "Hogar", null),
    )

    for (product in products) {
        val stockText = product.stock?.toString() ?: "sin dato"
        val discountedPrice = applyDiscount(product.price, 10)

        println("Producto: ${product.name} (${product.category})")
        println("  Stock: $stockText -> ${stockLabel(product.stock)}")
        println("  Precio: ${product.price} -> con 10 % de descuento: $discountedPrice")
    }
}