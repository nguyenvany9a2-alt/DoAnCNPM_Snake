const ADMIN_EMAIL = "admin@drugsafe.vn";

let drugs = [];
let diseases = [];
let users = [];

document.addEventListener("DOMContentLoaded", function () {
    protectAdminPage();
    loadAdminProfile();
    loadAllAdminData();
});

function protectAdminPage() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.email !== ADMIN_EMAIL || user.role !== "Admin") {
        alert("Bạn không có quyền truy cập trang Admin.");
        window.location.href = "login.html";
    }
}

function loadAdminProfile() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) return;

    document.getElementById("adminName").textContent = user.fullName || user.FullName || "Quản trị viên hệ thống";
    document.getElementById("adminEmail").textContent = user.email || user.Email || ADMIN_EMAIL;
}

async function loadAllAdminData() {
    await loadDrugsAdmin();
    await loadDiseasesAdmin();
    await loadUsersAdmin();

    renderProductsAdmin();
    renderOrdersAdmin();
    renderHistoriesAdmin();
    updateAdminStats();
}

function showAdminTab(tabName) {
    document.querySelectorAll(".admin-tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".admin-tab-content").forEach(content => content.classList.remove("active"));

    event.target.classList.add("active");
    document.getElementById(`tab-${tabName}`).classList.add("active");
}

/* =========================
   DRUG MANAGEMENT
========================= */

async function loadDrugsAdmin() {
    try {
        drugs = await apiRequest("/Drug");
    } catch {
        drugs = [];
        showMessage("adminMessage", "Không tải được danh sách thuốc. Kiểm tra backend API.");
    }

    renderDrugsAdmin();
}

function renderDrugsAdmin() {
    const table = document.getElementById("drugTable");

    if (drugs.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6">Chưa có dữ liệu thuốc.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = drugs.map(drug => `
        <tr>
            <td>${drug.drugId}</td>
            <td><strong>${drug.drugName}</strong></td>
            <td>${drug.activeIngredient || ""}</td>
            <td>${drug.manufacturer || ""}</td>
            <td>${drug.description || ""}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteDrug(${drug.drugId})">Xóa</button>
            </td>
        </tr>
    `).join("");
}

function openDrugForm() {
    document.getElementById("drugForm").style.display = "block";
}

function closeDrugForm() {
    document.getElementById("drugForm").style.display = "none";
}

async function createDrug() {
    const drugName = document.getElementById("drugName").value.trim();
    const activeIngredient = document.getElementById("activeIngredient").value.trim();
    const manufacturer = document.getElementById("manufacturer").value.trim();
    const description = document.getElementById("drugDescription").value.trim();

    if (!drugName) {
        showMessage("adminMessage", "Vui lòng nhập tên thuốc.");
        return;
    }

    try {
        await apiRequest("/Drug", "POST", {
            drugName,
            activeIngredient,
            manufacturer,
            description
        });

        showMessage("adminMessage", "Thêm thuốc thành công.", "success");

        document.getElementById("drugName").value = "";
        document.getElementById("activeIngredient").value = "";
        document.getElementById("manufacturer").value = "";
        document.getElementById("drugDescription").value = "";

        closeDrugForm();
        await loadDrugsAdmin();
        updateAdminStats();

    } catch (error) {
        showMessage("adminMessage", "Thêm thuốc thất bại. " + error.message);
    }
}

async function deleteDrug(id) {
    if (!confirm("Bạn có chắc muốn xóa thuốc này không?")) return;

    try {
        await apiRequest(`/Drug/${id}`, "DELETE");

        showMessage("adminMessage", "Xóa thuốc thành công.", "success");

        await loadDrugsAdmin();
        updateAdminStats();

    } catch (error) {
        showMessage("adminMessage", "Xóa thuốc thất bại. " + error.message);
    }
}

/* =========================
   DISEASE MANAGEMENT
========================= */

async function loadDiseasesAdmin() {
    try {
        diseases = await apiRequest("/Disease");
    } catch {
        diseases = [];
        showMessage("adminMessage", "Không tải được danh sách bệnh nền.");
    }

    renderDiseasesAdmin();
}

function renderDiseasesAdmin() {
    const table = document.getElementById("diseaseTable");

    if (diseases.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4">Chưa có dữ liệu bệnh nền.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = diseases.map(disease => `
        <tr>
            <td>${disease.id}</td>
            <td><strong>${disease.diseaseName}</strong></td>
            <td>${disease.description || ""}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteDisease(${disease.id})">Xóa</button>
            </td>
        </tr>
    `).join("");
}

function openDiseaseForm() {
    document.getElementById("diseaseForm").style.display = "block";
}

function closeDiseaseForm() {
    document.getElementById("diseaseForm").style.display = "none";
}

async function createDisease() {
    const diseaseName = document.getElementById("diseaseName").value.trim();
    const description = document.getElementById("diseaseDescription").value.trim();

    if (!diseaseName) {
        showMessage("adminMessage", "Vui lòng nhập tên bệnh nền.");
        return;
    }

    try {
        await apiRequest("/Disease", "POST", {
            diseaseName,
            description
        });

        showMessage("adminMessage", "Thêm bệnh nền thành công.", "success");

        document.getElementById("diseaseName").value = "";
        document.getElementById("diseaseDescription").value = "";

        closeDiseaseForm();
        await loadDiseasesAdmin();
        updateAdminStats();

    } catch (error) {
        showMessage("adminMessage", "Thêm bệnh nền thất bại. " + error.message);
    }
}

async function deleteDisease(id) {
    if (!confirm("Bạn có chắc muốn xóa bệnh nền này không?")) return;

    try {
        await apiRequest(`/Disease/${id}`, "DELETE");

        showMessage("adminMessage", "Xóa bệnh nền thành công.", "success");

        await loadDiseasesAdmin();
        updateAdminStats();

    } catch (error) {
        showMessage("adminMessage", "Xóa bệnh nền thất bại. " + error.message);
    }
}

/* =========================
   USERS
========================= */

async function loadUsersAdmin() {
    try {
        users = await apiRequest("/Auth");
    } catch {
        users = [];
    }

    renderUsersAdmin();
}

function renderUsersAdmin() {
    const table = document.getElementById("userTable");

    if (users.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4">Chưa có dữ liệu người dùng.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.fullName || user.FullName || ""}</td>
            <td>${user.email || user.Email || ""}</td>
            <td>
                <span class="assignee-chip">${user.role || user.Role || "User"}</span>
            </td>
        </tr>
    `).join("");
}

/* =========================
   PRODUCTS
========================= */

function renderProductsAdmin() {
    const grid = document.getElementById("productAdminGrid");

    if (!window.PRODUCTS && typeof PRODUCTS === "undefined") {
        grid.innerHTML = `<p>Không tìm thấy dữ liệu sản phẩm DrugStore.</p>`;
        return;
    }

    grid.innerHTML = PRODUCTS.map(product => `
        <div class="admin-product-card">
            <div class="admin-product-icon">${product.image}</div>
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <strong>${formatCurrency(product.price)}</strong>
            <span>${product.activeIngredient}</span>
        </div>
    `).join("");
}

/* =========================
   ORDERS
========================= */

function renderOrdersAdmin() {
    const orderList = document.getElementById("orderList");
    const orders = JSON.parse(localStorage.getItem("drugstoreOrders") || "[]");

    if (orders.length === 0) {
        orderList.innerHTML = `<div class="admin-empty">Chưa có đơn hàng demo.</div>`;
        return;
    }

    orderList.innerHTML = orders.map(order => `
        <div class="admin-list-item">
            <div>
                <strong>${order.orderCode}</strong>
                <p>${order.customer?.name || "Khách hàng demo"} - ${order.customer?.phone || ""}</p>
                <span>${order.createdAt}</span>
            </div>
            <strong>${formatCurrency(order.total || 0)}</strong>
        </div>
    `).join("");
}

function clearOrders() {
    if (!confirm("Bạn có chắc muốn xóa toàn bộ đơn hàng demo không?")) return;

    localStorage.removeItem("drugstoreOrders");
    renderOrdersAdmin();
    updateAdminStats();

    showMessage("adminMessage", "Đã xóa toàn bộ đơn hàng demo.", "success");
}

/* =========================
   HISTORIES
========================= */

function renderHistoriesAdmin() {
    const historyList = document.getElementById("historyAdminList");
    const histories = JSON.parse(localStorage.getItem("historyItems") || "[]");

    if (histories.length === 0) {
        historyList.innerHTML = `<div class="admin-empty">Chưa có lịch sử tra cứu.</div>`;
        return;
    }

    historyList.innerHTML = histories.map(item => {
        const drugs = item.input?.drugNames?.join(", ") || "Không có dữ liệu";
        const disease = item.input?.diseaseNames?.join(", ") || "Không áp dụng";
        const level = item.result?.level || "Low";

        return `
            <div class="admin-list-item">
                <div>
                    <strong>${drugs}</strong>
                    <p>Bệnh nền: ${disease}</p>
                    <span>${item.createdAt}</span>
                </div>
                <span class="history-risk-chip ${getRiskClass(level)}">${level}</span>
            </div>
        `;
    }).join("");
}

function clearHistories() {
    if (!confirm("Bạn có chắc muốn xóa toàn bộ lịch sử tra cứu không?")) return;

    localStorage.removeItem("historyItems");
    renderHistoriesAdmin();
    updateAdminStats();

    showMessage("adminMessage", "Đã xóa toàn bộ lịch sử tra cứu.", "success");
}

/* =========================
   STATS + LOGOUT
========================= */

function updateAdminStats() {
    const histories = JSON.parse(localStorage.getItem("historyItems") || "[]");
    const orders = JSON.parse(localStorage.getItem("drugstoreOrders") || "[]");

    const productCount = typeof PRODUCTS !== "undefined" ? PRODUCTS.length : 0;

    document.getElementById("drugCount").textContent = drugs.length;
    document.getElementById("diseaseCount").textContent = diseases.length;
    document.getElementById("userCount").textContent = users.length;
    document.getElementById("historyCount").textContent = histories.length;
    document.getElementById("productCount").textContent = productCount;
    document.getElementById("orderCount").textContent = orders.length;
}

function logoutAdmin() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function getRiskClass(level) {
    if (level === "High") return "risk-high";
    if (level === "Medium") return "risk-medium";
    return "risk-low";
}