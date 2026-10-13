
class Product(
    val id: Int,
    val name: String,
    val price: Double,
    val category: String,
    val stock: Int?
)

fun stockLabel(stock: Int?): String {
    if (stock == null) {
        return "Sin dato"
    }

    return when {
        stock == 0 -> "Agotado"
        stock < 5 -> "Pocas unidades"
        else -> "Disponible"
    }
}

fun applyDiscount(price: Double, percent: Int): Double {
    return price * (100 - percent) / 100
}

fun main() {
    val products = listOf(
        Product(1, "Agua", 2500.0, "Bebidas", 12),
        Product(2, "Galletas", 3500.0, "Snacks", 0),
        Product(3, "Jabón", 4200.0, "Aseo", null)
    )

    for (product in products) {
        val label = stockLabel(product.stock)
        val discountedPrice = applyDiscount(product.price, 10)

        println("Producto: ${product.name}")
        println("Stock: $label")
        println("Precio con 10% de descuento: $discountedPrice")
        println("---")
    }
}
