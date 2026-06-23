document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    renderProductDetail();
});

function renderProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const product = PRODUCTS.find(p => p.id === id);
    const productDetail = document.getElementById("productDetail");

    if (!product) {
        productDetail.innerHTML = `
            <div class="result-card">
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Sản phẩm không tồn tại hoặc đã bị xóa.</p>
                <a href="drugstore.html" class="btn btn-primary">Quay lại DrugStore</a>
            </div>
        `;
        return;
    }

    productDetail.innerHTML = `
        <div class="detail-layout">
            <div class="detail-image-box">
                <div class="detail-image">${product.image}</div>
                <span class="product-badge">${product.badge}</span>
            </div>

            <div class="detail-content">
                <p class="product-category">${product.category}</p>
                <h1>${product.name}</h1>
                <p class="detail-desc">${product.description}</p>

                <div class="detail-info">
                    <div>
                        <span>Hoạt chất</span>
                        <strong>${product.activeIngredient}</strong>
                    </div>
                    <div>
                        <span>Nhà sản xuất</span>
                        <strong>${product.manufacturer}</strong>
                    </div>
                    <div>
                        <span>Giá tham khảo</span>
                        <strong>${formatCurrency(product.price)}</strong>
                    </div>
                </div>

                <div class="warning-box">
                    <strong>Cảnh báo sử dụng:</strong>
                    <p>${product.warning}</p>
                </div>

                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="handleAddToCart(${product.id})">
                        Thêm vào giỏ hàng
                    </button>
                    <a href="check.html" class="btn btn-warning">
                        Kiểm tra chống chỉ định
                    </a>
                    <a href="drugstore.html" class="btn btn-light">
                        Quay lại
                    </a>
                </div>
            </div>
        </div>
    `;
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