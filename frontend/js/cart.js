document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    renderCart();
});

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cart = getCart();

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>Giỏ hàng đang trống</h3>
                <p>Hãy quay lại DrugStore để thêm sản phẩm vào giỏ hàng.</p>
                <a href="drugstore.html" class="btn btn-primary">Xem sản phẩm</a>
            </div>
        `;

        updateSummary(cart);
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-product-icon">${item.image}</div>

            <div class="cart-product-info">
                <h3>${item.name}</h3>
                <p>${formatCurrency(item.price)}</p>
            </div>

            <div class="quantity-control">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>

            <div class="cart-item-total">
                ${formatCurrency(item.price * item.quantity)}
            </div>

            <button class="btn btn-danger" onclick="removeFromCart(${item.id})">
                Xóa
            </button>
        </div>
    `).join("");

    updateSummary(cart);
}

function changeQuantity(productId, amount) {
    const cart = getCart();
    const item = cart.find(x => x.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        const newCart = cart.filter(x => x.id !== productId);
        saveCart(newCart);
    } else {
        saveCart(cart);
    }

    updateCartBadge();
    renderCart();
    showToast("Đã cập nhật số lượng");
}

function removeFromCart(productId) {
    const cart = getCart();
    const newCart = cart.filter(item => item.id !== productId);

    saveCart(newCart);
    updateCartBadge();
    renderCart();
    showToast("Đã xóa sản phẩm khỏi giỏ hàng");
}

function updateSummary(cart) {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = formatCurrency(totalPrice);
}

function mockCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
        showToast("Giỏ hàng đang trống");
        return;
    }

    showToast("Đã xác nhận giỏ hàng mô phỏng");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}