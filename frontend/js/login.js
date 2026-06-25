document.addEventListener("DOMContentLoaded", function () {
    clearLoginErrorOnly();

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("Không tìm thấy form loginForm.");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        await loginUser();
    });
});

async function loginUser() {
    const emailInput =
        document.getElementById("email") ||
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("password") ||
        document.getElementById("loginPassword");

    if (!emailInput || !passwordInput) {
        showLoginMessage("Không tìm thấy ô email hoặc mật khẩu.", "error");
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Quan trọng: xóa user cũ trước mỗi lần đăng nhập
    clearCurrentUser();

    if (!email) {
        showLoginMessage("Vui lòng nhập email.", "error");
        return;
    }

    if (!password) {
        showLoginMessage("Vui lòng nhập mật khẩu.", "error");
        return;
    }

    const apiBase = window.API_BASE_URL || "http://localhost:5210/api";

    try {
        const response = await fetch(`${apiBase}/Auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        let data = null;

        try {
            data = await response.json();
        } catch {
            data = null;
        }

        // Nếu API trả lỗi thì KHÔNG lưu user
        if (!response.ok) {
            clearCurrentUser();

            const errorMessage =
                data?.message ||
                data?.title ||
                "Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.";

            showLoginMessage(errorMessage, "error");
            return;
        }

        const user = normalizeLoginUser(data, email);

        // Nếu không lấy được email/user thì coi như lỗi
        if (!user || !user.email) {
            clearCurrentUser();
            showLoginMessage("Không lấy được thông tin tài khoản sau đăng nhập.", "error");
            return;
        }

        // Cho phép cả User và Admin đăng nhập
        const role = normalizeRole(user.role);

        if (role !== "Admin" && role !== "User") {
            clearCurrentUser();
            showLoginMessage("Tài khoản không có quyền đăng nhập hệ thống.", "error");
            return;
        }

        user.role = role;

        // Chỉ lưu user SAU KHI đăng nhập thành công và role hợp lệ
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("drugSafeUser", JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user));



        showLoginMessage("Đăng nhập thành công.", "success");

        setTimeout(() => {
            if (user.role === "Admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }
        }, 700);

    } catch (error) {
        clearCurrentUser();
        console.error("Lỗi đăng nhập:", error);
        showLoginMessage("Không kết nối được đến máy chủ API.", "error");
    }
}

function normalizeLoginUser(data, fallbackEmail) {
    const userData =
        data?.user ||
        data?.data ||
        data?.account ||
        data;

    if (!userData) {
        return {
            id: "",
            fullName: fallbackEmail,
            email: fallbackEmail,
            role: "User"
        };
    }

    return {
        id: userData.id || userData.userId || "",
        fullName:
            userData.fullName ||
            userData.name ||
            userData.userName ||
            userData.email ||
            fallbackEmail,
        email: userData.email || fallbackEmail,
        role: userData.role || userData.userRole || "User"
    };
}

function normalizeRole(role) {
    const value = String(role || "").trim().toLowerCase();

    if (
        value === "admin" ||
        value === "administrator" ||
        value === "quản trị viên" ||
        value === "quan tri vien"
    ) {
        return "Admin";
    }

    if (
        value === "user" ||
        value === "customer" ||
        value === "người dùng" ||
        value === "nguoi dung"
    ) {
        return "User";
    }

    return "User";
}

function clearCurrentUser() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("drugSafeUser");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user");
}

function clearLoginErrorOnly() {
    const messageBox = document.getElementById("loginMessage");

    if (messageBox) {
        messageBox.textContent = "";
        messageBox.style.display = "none";
    }
}

function showLoginMessage(message, type) {
    const messageBox = document.getElementById("loginMessage");

    if (!messageBox) {
        alert(message);
        return;
    }

    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    messageBox.style.display = "block";
}