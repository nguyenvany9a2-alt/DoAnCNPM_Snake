document.addEventListener("DOMContentLoaded", function () {
    setupPasswordToggle();
    updateCartBadgeIfExists();

    document.getElementById("password").addEventListener("input", updatePasswordRules);
    document.getElementById("registerForm").addEventListener("submit", handleRegister);
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

function updatePasswordRules() {
    const password = document.getElementById("password").value;

    updateRule("ruleLength", password.length >= 6);
    updateRule("ruleNumber", /\d/.test(password));
    updateRule("ruleLetter", /[a-zA-Z]/.test(password));
}

function updateRule(ruleId, isValid) {
    const rule = document.getElementById(ruleId);

    if (isValid) {
        rule.classList.add("valid");
    } else {
        rule.classList.remove("valid");
    }
}

async function handleRegister(e) {
    e.preventDefault();

    clearMessage("registerMessage");

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const agreePolicy = document.getElementById("agreePolicy").checked;

    if (!fullName || !email || !password || !confirmPassword) {
        showMessage("registerMessage", "Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    if (fullName.length < 3) {
        showMessage("registerMessage", "Họ tên phải có ít nhất 3 ký tự.");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("registerMessage", "Email không đúng định dạng. Ví dụ: nguyenvany@gmail.com");
        return;
    }

    if (password.length < 6) {
        showMessage("registerMessage", "Mật khẩu phải có ít nhất 6 ký tự.");
        return;
    }

    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        showMessage("registerMessage", "Mật khẩu nên có cả chữ và số.");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("registerMessage", "Mật khẩu xác nhận không khớp.");
        return;
    }

    if (!agreePolicy) {
        showMessage("registerMessage", "Vui lòng xác nhận điều khoản sử dụng hệ thống demo.");
        return;
    }

    const submitButton = document.querySelector(".auth-submit");
    setButtonLoading(submitButton, true, "Đang tạo tài khoản...");

    try {
        await apiRequest("/Auth/register", "POST", {
            fullName: fullName,
            email: email,
            password: password,
            role: "User"
        });

        showMessage("registerMessage", "Đăng ký thành công. Đang chuyển sang đăng nhập...", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);

    } catch (error) {
        showMessage("registerMessage", "Đăng ký thất bại. " + error.message);
    } finally {
        setButtonLoading(submitButton, false, "Tạo tài khoản");
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