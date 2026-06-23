const ADMIN_EMAIL = "admin@drugsafe.vn";

const defaultTasks = [
    {
        id: "CS-139",
        title: "Thiết kế cơ sở dữ liệu",
        epic: "Backend API & Database",
        assignee: "SV1",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-138",
        title: "Xây dựng REST API",
        epic: "Backend API & Database",
        assignee: "SV1",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-120",
        title: "CRUD thuốc",
        epic: "Drug Management",
        assignee: "SV1",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-122",
        title: "CRUD bệnh nền",
        epic: "Disease Management",
        assignee: "SV1",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-124",
        title: "API kiểm tra chống chỉ định",
        epic: "Contraindication Check",
        assignee: "SV1",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-126",
        title: "API kiểm tra tương tác thuốc",
        epic: "Drug Interaction Check",
        assignee: "SV1",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-91",
        title: "Trang chủ hệ thống",
        epic: "Frontend UI",
        assignee: "SV2",
        priority: "Medium",
        status: "Done"
    },
    {
        id: "CS-92",
        title: "Trang nhập đơn thuốc",
        epic: "Frontend UI",
        assignee: "SV2",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-93",
        title: "Thiết kế giao diện Home",
        epic: "Frontend UI",
        assignee: "SV2",
        priority: "Medium",
        status: "Done"
    },
    {
        id: "CS-94",
        title: "Responsive Home",
        epic: "Frontend UI",
        assignee: "SV2",
        priority: "Medium",
        status: "In Progress"
    },
    {
        id: "CS-95",
        title: "Thiết kế form nhập thuốc",
        epic: "Frontend UI",
        assignee: "SV2",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-96",
        title: "Validate dữ liệu nhập",
        epic: "Frontend UI",
        assignee: "SV2",
        priority: "High",
        status: "In Progress"
    },
    {
        id: "CS-101",
        title: "API đăng ký",
        epic: "User Account",
        assignee: "SV3",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-102",
        title: "API đăng nhập",
        epic: "User Account",
        assignee: "SV3",
        priority: "High",
        status: "Done"
    },
    {
        id: "CS-130",
        title: "Lưu lịch sử tra cứu",
        epic: "History Management",
        assignee: "SV3",
        priority: "Medium",
        status: "Done"
    },
    {
        id: "CS-128",
        title: "API gợi ý thuốc thay thế",
        epic: "Recommendation System",
        assignee: "SV4",
        priority: "Medium",
        status: "To Do"
    },
    {
        id: "CS-129",
        title: "Thuật toán đề xuất thuốc",
        epic: "Recommendation System",
        assignee: "SV4",
        priority: "Medium",
        status: "To Do"
    },
    {
        id: "CS-140",
        title: "Viết Test Case",
        epic: "Testing & Deployment",
        assignee: "SV5",
        priority: "Medium",
        status: "In Progress"
    },
    {
        id: "CS-141",
        title: "Deploy Server",
        epic: "Testing & Deployment",
        assignee: "SV5",
        priority: "Medium",
        status: "To Do"
    }
];

let projectTasks = [];

document.addEventListener("DOMContentLoaded", function () {
    protectAdminPage();
    loadAdminProfile();
    loadTasks();
    renderDashboard();

    document.getElementById("taskSearch").addEventListener("input", filterTasks);
    document.getElementById("memberFilter").addEventListener("change", filterTasks);
    document.getElementById("statusFilter").addEventListener("change", filterTasks);
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

function loadTasks() {
    const savedTasks = localStorage.getItem("projectTasks");

    if (savedTasks) {
        projectTasks = JSON.parse(savedTasks);
    } else {
        projectTasks = defaultTasks;
        saveTasks();
    }
}

function saveTasks() {
    localStorage.setItem("projectTasks", JSON.stringify(projectTasks));
}

function renderDashboard() {
    updateStats();
    renderTasks(projectTasks);
    renderSystemData();
    renderRecentHistory();
    renderRecentOrders();
}

function updateStats() {
    const total = projectTasks.length;
    const todo = projectTasks.filter(task => task.status === "To Do").length;
    const progress = projectTasks.filter(task => task.status === "In Progress").length;
    const done = projectTasks.filter(task => task.status === "Done").length;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("todoTasks").textContent = todo;
    document.getElementById("progressTasks").textContent = progress;
    document.getElementById("doneTasks").textContent = done;

    document.getElementById("projectProgressBar").style.width = percent + "%";
    document.getElementById("projectProgressText").textContent = percent + "%";
}

function renderTasks(tasks) {
    const taskTable = document.getElementById("taskTable");

    if (tasks.length === 0) {
        taskTable.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="admin-empty">
                        <h3>Không tìm thấy công việc</h3>
                        <p>Vui lòng thử từ khóa hoặc bộ lọc khác.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    taskTable.innerHTML = tasks.map(task => `
        <tr>
            <td><strong>${task.id}</strong></td>
            <td>${task.title}</td>
            <td>${task.epic}</td>
            <td>
                <span class="assignee-chip">${task.assignee}</span>
            </td>
            <td>
                <span class="priority-chip ${getPriorityClass(task.priority)}">${task.priority}</span>
            </td>
            <td>
                <select class="status-select ${getStatusClass(task.status)}" onchange="updateTaskStatus('${task.id}', this.value)">
                    <option value="To Do" ${task.status === "To Do" ? "selected" : ""}>To Do</option>
                    <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Done" ${task.status === "Done" ? "selected" : ""}>Done</option>
                </select>
            </td>
        </tr>
    `).join("");
}

function filterTasks() {
    const keyword = document.getElementById("taskSearch").value.toLowerCase().trim();
    const member = document.getElementById("memberFilter").value;
    const status = document.getElementById("statusFilter").value;

    const filtered = projectTasks.filter(task => {
        const matchKeyword =
            task.id.toLowerCase().includes(keyword) ||
            task.title.toLowerCase().includes(keyword) ||
            task.epic.toLowerCase().includes(keyword) ||
            task.assignee.toLowerCase().includes(keyword);

        const matchMember = member === "all" || task.assignee === member;
        const matchStatus = status === "all" || task.status === status;

        return matchKeyword && matchMember && matchStatus;
    });

    renderTasks(filtered);
}

function updateTaskStatus(taskId, newStatus) {
    const task = projectTasks.find(item => item.id === taskId);

    if (!task) return;

    task.status = newStatus;
    saveTasks();
    updateStats();

    showMessage("adminMessage", `Đã cập nhật ${taskId} thành ${newStatus}.`, "success");

    filterTasks();
}

function resetProjectTasks() {
    if (!confirm("Bạn có chắc muốn reset danh sách công việc về mặc định không?")) {
        return;
    }

    projectTasks = defaultTasks;
    saveTasks();
    renderDashboard();

    showMessage("adminMessage", "Đã reset dữ liệu công việc về mặc định.", "success");
}

function renderSystemData() {
    const historyItems = JSON.parse(localStorage.getItem("historyItems") || "[]");
    const orders = JSON.parse(localStorage.getItem("drugstoreOrders") || "[]");
    const cart = JSON.parse(localStorage.getItem("drugstoreCart") || "[]");

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById("historyCount").textContent = historyItems.length;
    document.getElementById("orderCount").textContent = orders.length;
    document.getElementById("cartCount").textContent = cartCount;
}

function renderRecentHistory() {
    const list = document.getElementById("recentHistoryList");
    const historyItems = JSON.parse(localStorage.getItem("historyItems") || "[]");

    if (historyItems.length === 0) {
        list.innerHTML = `
            <div class="admin-empty">
                <p>Chưa có lịch sử kiểm tra.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = historyItems.slice(0, 5).map(item => {
        const drugs = item.input?.drugNames?.join(", ") || "Không có dữ liệu";
        const level = item.result?.level || "Low";
        const type = getTypeText(item.type);

        return `
            <div class="admin-list-item">
                <div>
                    <strong>${type}</strong>
                    <p>${drugs}</p>
                    <span>${item.createdAt}</span>
                </div>
                <span class="history-risk-chip ${getRiskClass(level)}">${level}</span>
            </div>
        `;
    }).join("");
}

function renderRecentOrders() {
    const list = document.getElementById("recentOrderList");
    const orders = JSON.parse(localStorage.getItem("drugstoreOrders") || "[]");

    if (orders.length === 0) {
        list.innerHTML = `
            <div class="admin-empty">
                <p>Chưa có đơn hàng DrugStore.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = orders.slice(0, 5).map(order => `
        <div class="admin-list-item">
            <div>
                <strong>${order.orderCode}</strong>
                <p>${order.customer?.name || "Khách hàng demo"}</p>
                <span>${order.createdAt}</span>
            </div>
            <strong>${formatCurrency(order.total || 0)}</strong>
        </div>
    `).join("");
}

function logoutAdmin() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "login.html";
}

function getTypeText(type) {
    if (type === "contraindication") return "Chống chỉ định";
    if (type === "interaction") return "Tương tác thuốc";
    if (type === "comprehensive") return "Toàn diện";
    return "Khác";
}

function getStatusClass(status) {
    if (status === "Done") return "status-done";
    if (status === "In Progress") return "status-progress";
    return "status-todo";
}

function getPriorityClass(priority) {
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
}

function getRiskClass(level) {
    if (level === "High") return "risk-high";
    if (level === "Medium") return "risk-medium";
    return "risk-low";
}