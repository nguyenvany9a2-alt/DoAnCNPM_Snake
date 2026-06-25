document.addEventListener("DOMContentLoaded", function () {
    renderAuthUI();
});

function getCurrentUser() {
    const keys = [
        "currentUser",
        "drugSafeUser",
        "loggedInUser",
        "user"
    ];

    for (const key of keys) {
        const raw = localStorage.getItem(key);

        if (!raw) continue;

        try {
            const user = JSON.parse(raw);

            if (user && user.email) {
                return {
                    id: user.id || user.userId || "",
                    fullName:
                        user.fullName ||
                        user.name ||
                        user.userName ||
                        user.email ||
                        "User",
                    email: user.email,
                    role: normalizeRole(user.role)
                };
            }
        } catch {
            localStorage.removeItem(key);
        }
    }

    return null;
}

function renderAuthUI() {
    const nav = document.querySelector(".nav");

    if (!nav) return;

    const user = getCurrentUser();

    const oldUserBox = document.getElementById("userInfoBox");
    if (oldUserBox) {
        oldUserBox.remove();
    }

    const loginLink = Array.from(nav.querySelectorAll("a"))
        .find(a => a.getAttribute("href") === "login.html");

    if (!user) {
        if (loginLink) {
            loginLink.style.display = "inline-block";
        }

        return;
    }

    if (loginLink) {
        loginLink.style.display = "none";
    }

    const userBox = document.createElement("div");
    userBox.id = "userInfoBox";
    userBox.style.display = "flex";
    userBox.style.alignItems = "center";
    userBox.style.gap = "10px";

    userBox.innerHTML = `
        <span class="user-name">
            👤 Xin chào, <strong>${escapeHtml(user.fullName)}</strong>
            <small>(${escapeHtml(user.role)})</small>
        </span>
        <button class="btn btn-light" type="button" onclick="logoutUser()">
            Đăng xuất
        </button>
    `;

    nav.appendChild(userBox);
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("drugSafeUser");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    showToastNotification(
        "success",
        "Đăng xuất thành công",
        "Phiên đăng nhập của bạn đã được kết thúc an toàn.",
        "login.html",
        1200
    );
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

    return "User";
}

function escapeHtml(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function showToastNotification(type, title, message, redirectUrl = null, delay = 1200) {
    const oldToast = document.querySelector(".app-toast");
    if (oldToast) {
        oldToast.remove();
    }

    const iconMap = {
        success: "✓",
        error: "!",
        warning: "⚠"
    };

    const toast = document.createElement("div");
    toast.className = `app-toast ${type}`;

    toast.innerHTML = `
        <div class="app-toast-icon">${iconMap[type] || "✓"}</div>
        <div class="app-toast-content">
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml(message)}</p>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "toastFadeOut 0.3s ease forwards";
    }, delay - 300);

    setTimeout(() => {
        toast.remove();

        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, delay);
}