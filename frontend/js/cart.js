let currentDiscount = 0;
let currentShippingFee = 15000;

document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    renderCart();
    setupPaymentMethods();
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

        currentShippingFee = 0;
        updateSummary(cart);
        return;
    }

    currentShippingFee = 15000;

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item premium-cart-item">
            <div class="cart-product-icon">${item.image}</div>

            <div class="cart-product-info">
                <h3>${item.name}</h3>
                <p>Giá tham khảo: ${formatCurrency(item.price)}</p>
                <span class="cart-safe-label">Cần kiểm tra chống chỉ định trước khi sử dụng</span>
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
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = Math.max(subtotal + currentShippingFee - currentDiscount, 0);

    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("subtotalPrice").textContent = formatCurrency(subtotal);
    document.getElementById("shippingFee").textContent = formatCurrency(currentShippingFee);
    document.getElementById("discountPrice").textContent = "-" + formatCurrency(currentDiscount);
    document.getElementById("totalPrice").textContent = formatCurrency(total);
}

function applyVoucher() {
    const voucherInput = document.getElementById("voucherInput");
    const voucherCode = voucherInput.value.trim().toUpperCase();
    const cart = getCart();

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        showToast("Giỏ hàng đang trống");
        return;
    }

    if (voucherCode === "DRUGSAFE") {
        currentDiscount = Math.min(20000, subtotal);
        showMessage("cartMessage", "Áp dụng mã giảm giá thành công.", "success");
    } else {
        currentDiscount = 0;
        showMessage("cartMessage", "Mã giảm giá không hợp lệ.");
    }

    updateSummary(cart);
}

function setupPaymentMethods() {
    const methods = document.querySelectorAll(".payment-method");

    methods.forEach(method => {
        method.addEventListener("click", function () {
            methods.forEach(item => item.classList.remove("active"));
            this.classList.add("active");

            const selected = this.querySelector("input").value;
            const bankInfo = document.getElementById("bankInfo");

            if (selected === "BANK_TRANSFER") {
                bankInfo.style.display = "block";
            } else {
                bankInfo.style.display = "none";
            }
        });
    });
}

function placeOrder() {
    const cart = getCart();

    if (cart.length === 0) {
        showToast("Giỏ hàng đang trống");
        return;
    }

    const customerName = document.getElementById("customerName").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();
    const customerEmail = document.getElementById("customerEmail").value.trim();
    const customerAddress = document.getElementById("customerAddress").value.trim();
    const orderNote = document.getElementById("orderNote").value.trim();
    const policyAgree = document.getElementById("policyAgree").checked;

    if (!customerName || !customerPhone || !customerEmail || !customerAddress) {
        showMessage("cartMessage", "Vui lòng nhập đầy đủ họ tên, số điện thoại, email và địa chỉ nhận hàng.");
        return;
    }

    if (!isValidEmail(customerEmail)) {
        showMessage("cartMessage", "Email không đúng định dạng. Ví dụ: nguyenvany@gmail.com");
        return;
    }

    if (!/^[0-9]{9,11}$/.test(customerPhone)) {
        showMessage("cartMessage", "Số điện thoại không hợp lệ.");
        return;
    }

    if (!policyAgree) {
        showMessage("cartMessage", "Vui lòng xác nhận điều khoản demo trước khi thanh toán.");
        return;
    }

    const paymentMethod = document.querySelector("input[name='paymentMethod']:checked").value;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 15000;
    const discount = currentDiscount || 0;
    const total = Math.max(subtotal + shippingFee - discount, 0);

    const orderCode = generateOrderCode();

    const order = {
        orderCode: orderCode,
        customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            address: customerAddress
        },
        items: cart,
        paymentMethod: paymentMethod,
        note: orderNote,
        subtotal: subtotal,
        shippingFee: shippingFee,
        discount: discount,
        total: total,
        status: "Paid",
        createdAt: new Date().toLocaleString("vi-VN")
    };

    const orders = JSON.parse(localStorage.getItem("drugstoreOrders") || "[]");
    orders.unshift(order);
    localStorage.setItem("drugstoreOrders", JSON.stringify(orders));

    saveCart([]);
    updateCartBadge();
    renderCart();

    document.getElementById("orderCode").textContent = orderCode;

    document.getElementById("orderSuccessText").innerHTML = `
        Đơn hàng đã được thanh toán thành công.<br>
        Tổng tiền: <strong>${formatCurrency(total)}</strong>
    `;

    document.getElementById("orderModal").classList.add("show");
}

function generateOrderCode() {
    const random = Math.floor(100000 + Math.random() * 900000);
    return "DS" + random;
}

function closeOrderModal() {
    document.getElementById("orderModal").classList.remove("show");
}

function generateOrderCode() {
    const random = Math.floor(100000 + Math.random() * 900000);
    return "DS" + random;
}

function closeOrderModal() {
    document.getElementById("orderModal").classList.remove("show");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}