class Product(
    val id: Int,
    val name: String,
    var price: Double,
    val category: String,
    var stock: Int?
)

fun stockLabel(stock: Int?): String {
    val currentStock = stock ?: return "Sin dato"

    return when {
        currentStock == 0 -> "Agotado"
        currentStock < 5 -> "Pocas unidades"
        else -> "Disponible"
    }
}

fun applyDiscount(price: Double, percent: Int): Double {
    return price - (price * percent / 100.0)
}

fun main() {
    val product1 = Product(
        id = 1,
        name = "Agua mineral 600 ml",
        price = 1800.0,
        category = "Bebidas",
        stock = 120
    )

    val product2 = Product(
        id = 2,
        name = "Galletas de avena x6",
        price = 2700.0,
        category = "Snacks",
        stock = 0
    )

    val product3 = Product(
        id = 3,
        name = "Set de ollas antiadherentes",
        price = 189900.0,
        category = "Hogar",
        stock = null
    )

    println("${product1.name} - ${stockLabel(product1.stock)} - Precio con 10% de descuento: ${applyDiscount(product1.price, 10)}")
    println("${product2.name} - ${stockLabel(product2.stock)} - Precio con 10% de descuento: ${applyDiscount(product2.price, 10)}")
    println("${product3.name} - ${stockLabel(product3.stock)} - Precio con 10% de descuento: ${applyDiscount(product3.price, 10)}")

    
}