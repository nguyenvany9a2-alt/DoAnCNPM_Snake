const PRODUCTS = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        category: "Giảm đau - Hạ sốt",
        price: 25000,
        image: "💊",
        badge: "Phổ biến",
        description: "Sản phẩm hỗ trợ giảm đau, hạ sốt thông dụng. Cần sử dụng đúng liều lượng theo hướng dẫn.",
        activeIngredient: "Paracetamol",
        manufacturer: "DHG Pharma",
        warning: "Thận trọng với người suy gan hoặc dùng rượu thường xuyên."
    },
    {
        id: 2,
        name: "Aspirin 81mg",
        category: "Tim mạch",
        price: 42000,
        image: "🧪",
        badge: "Cần tư vấn",
        description: "Sản phẩm hỗ trợ chống kết tập tiểu cầu, thường được dùng theo chỉ định y tế.",
        activeIngredient: "Acetylsalicylic Acid",
        manufacturer: "Bayer",
        warning: "Không phù hợp với người viêm loét dạ dày hoặc nguy cơ xuất huyết."
    },
    {
        id: 3,
        name: "Ibuprofen 400mg",
        category: "Giảm đau - Kháng viêm",
        price: 36000,
        image: "💉",
        badge: "NSAID",
        description: "Sản phẩm hỗ trợ giảm đau, kháng viêm. Cần thận trọng khi dùng cùng thuốc khác.",
        activeIngredient: "Ibuprofen",
        manufacturer: "Generic",
        warning: "Thận trọng với bệnh nhân suy thận, viêm loét dạ dày."
    },
    {
        id: 4,
        name: "Vitamin C 1000mg",
        category: "Vitamin",
        price: 55000,
        image: "🍊",
        badge: "Bổ sung",
        description: "Sản phẩm bổ sung vitamin C, hỗ trợ tăng cường sức đề kháng.",
        activeIngredient: "Ascorbic Acid",
        manufacturer: "Healthy Care",
        warning: "Không nên lạm dụng liều cao trong thời gian dài."
    },
    {
        id: 5,
        name: "Omega 3",
        category: "Thực phẩm hỗ trợ",
        price: 120000,
        image: "🐟",
        badge: "Hỗ trợ",
        description: "Sản phẩm hỗ trợ sức khỏe tim mạch và bổ sung acid béo omega-3.",
        activeIngredient: "EPA, DHA",
        manufacturer: "Nature Plus",
        warning: "Thận trọng nếu đang dùng thuốc chống đông."
    },
    {
        id: 6,
        name: "Men vi sinh Probiotic",
        category: "Tiêu hóa",
        price: 89000,
        image: "🦠",
        badge: "Tiêu hóa",
        description: "Hỗ trợ cân bằng hệ vi sinh đường ruột và cải thiện tiêu hóa.",
        activeIngredient: "Lactobacillus",
        manufacturer: "Bio Health",
        warning: "Không thay thế thuốc điều trị bệnh tiêu hóa."
    }
];

function formatCurrency(value) {
    return value.toLocaleString("vi-VN") + "đ";
}

function getCart() {
    return JSON.parse(localStorage.getItem("drugstoreCart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("drugstoreCart", JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;

    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    badge.textContent = totalItems;
}