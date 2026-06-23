document.addEventListener("DOMContentLoaded", function () {
    setupPasswordToggle();
    updateCartBadgeIfExists();

    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("rememberMe").checked = true;
    }

    document.getElementById("loginForm").addEventListener("submit", handleLogin);
});

function updateCartBadgeIfExists() {
    if (typeof updateCartBadge === "function") {
        updateCartBadge();
    }
}

function setupPasswordToggle() {
    document.querySelectorAll(".toggle-password").forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);

            if (input.type === "password") {
                input.type = "text";
                this.textContent = "Ẩn";
            } else {
                input.type = "password";
                this.textContent = "Hiện";
            }
        });
    });
}

async function handleLogin(e) {
    e.preventDefault();

    clearMessage("loginMessage");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("rememberMe").checked;

    if (!email || !password) {
        showMessage("loginMessage", "Vui lòng nhập đầy đủ email và mật khẩu.");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("loginMessage", "Email không đúng định dạng. Ví dụ: nguyenvany@gmail.com");
        return;
    }

    const submitButton = document.querySelector(".auth-submit");
    setButtonLoading(submitButton, true, "Đang đăng nhập...");

    try {
        const result = await apiRequest("/Auth/login", "POST", {
            email: email,
            password: password
        });

        const user = result.user || result;

        localStorage.setItem("user", JSON.stringify(user));

        if (result.token) {
            localStorage.setItem("token", result.token);
        }

        if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }

        showMessage("loginMessage", "Đăng nhập thành công. Đang chuyển trang...", "success");

        setTimeout(() => {
            window.location.href = "check.html";
        }, 900);

    } catch (error) {
        showMessage("loginMessage", "Đăng nhập thất bại. " + error.message);
    } finally {
        setButtonLoading(submitButton, false, "Đăng nhập");
    }
}

function setButtonLoading(button, isLoading, text) {
    button.disabled = isLoading;
    button.textContent = text;

    if (isLoading) {
        button.classList.add("loading");
    } else {
        button.classList.remove("loading");
    }
}

function showForgotPasswordMessage(e) {
    e.preventDefault();
    showMessage("loginMessage", "Chức năng quên mật khẩu đang được phát triển trong phiên bản demo.");
}