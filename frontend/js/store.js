document.addEventListener("DOMContentLoaded", function () {
    renderCategories();
    renderProducts(PRODUCTS);
    updateCartBadge();

    document.getElementById("searchInput").addEventListener("input", filterProducts);
    document.getElementById("categoryFilter").addEventListener("change", filterProducts);
});

function renderCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(PRODUCTS.map(product => product.category))];

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function renderProducts(products) {
    const productList = document.getElementById("productList");

    if (products.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Vui lòng thử từ khóa hoặc danh mục khác.</p>
            </div>
        `;
        return;
    }

    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-badge">${product.badge}</div>

            <div class="product-image">
                ${product.image}
            </div>

            <div class="product-content">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="product-desc">${product.description}</p>

                <div class="product-meta">
                    <span>Hoạt chất</span>
                    <strong>${product.activeIngredient}</strong>
                </div>

                <div class="product-footer">
                    <div class="product-price">${formatCurrency(product.price)}</div>

                    <div class="product-actions">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-light">Chi tiết</a>
                        <button class="btn btn-primary" onclick="handleAddToCart(${product.id})">
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function filterProducts() {
    const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
    const category = document.getElementById("categoryFilter").value;

    const filtered = PRODUCTS.filter(product => {
        const matchKeyword =
            product.name.toLowerCase().includes(keyword) ||
            product.activeIngredient.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword);

        const matchCategory = category === "all" || product.category === category;

        return matchKeyword && matchCategory;
    });

    renderProducts(filtered);
}

function handleAddToCart(productId) {
    addToCart(productId, 1);
    showToast("Đã thêm sản phẩm vào giỏ hàng");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}