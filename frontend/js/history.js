let allHistoryItems = [];

document.addEventListener("DOMContentLoaded", function () {
    updateCartBadgeIfExists();
    loadHistory();

    document.getElementById("historySearch").addEventListener("input", filterHistory);
    document.getElementById("historyTypeFilter").addEventListener("change", filterHistory);
    document.getElementById("historyRiskFilter").addEventListener("change", filterHistory);
});

function updateCartBadgeIfExists() {
    if (typeof updateCartBadge === "function") {
        updateCartBadge();
    }
}

function loadHistory() {
    allHistoryItems = JSON.parse(localStorage.getItem("historyItems") || "[]");
    updateHistoryStats(allHistoryItems);
    renderHistory(allHistoryItems);
}

function updateHistoryStats(history) {
    const total = history.length;

    const warningCount = history.filter(item => {
        return item.result?.hasWarning === true || item.result?.hasInteraction === true;
    }).length;

    const highRiskCount = history.filter(item => {
        return getResultLevel(item) === "High";
    }).length;

    const safeCount = history.filter(item => {
        return getResultLevel(item) === "Low" || item.result?.hasWarning === false;
    }).length;

    document.getElementById("totalHistory").textContent = total;
    document.getElementById("warningHistory").textContent = warningCount;
    document.getElementById("highRiskHistory").textContent = highRiskCount;
    document.getElementById("safeHistory").textContent = safeCount;
}

function renderHistory(history) {
    const historyTable = document.getElementById("historyTable");

    if (history.length === 0) {
        historyTable.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="history-empty">
                        <div>📭</div>
                        <h3>Chưa có lịch sử phù hợp</h3>
                        <p>Hãy thực hiện kiểm tra thuốc để hệ thống lưu lại lịch sử.</p>
                        <a href="check.html" class="btn btn-primary">Kiểm tra ngay</a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    historyTable.innerHTML = history.map((item, index) => {
        const drugs = getDrugListText(item);
        const diseases = getDiseaseListText(item);
        const typeText = getTypeText(item.type);
        const level = getResultLevel(item);
        const levelClass = getLevelClass(level);
        const message = getResultMessage(item);

        return `
            <tr>
                <td>${item.createdAt || "Không rõ"}</td>
                <td>
                    <span class="history-type-chip">${typeText}</span>
                </td>
                <td>${drugs}</td>
                <td>${diseases}</td>
                <td>
                    <span class="history-risk-chip ${levelClass}">${level}</span>
                </td>
                <td class="history-result-text">${message}</td>
                <td>
                    <div class="history-actions">
                        <button class="btn btn-light" onclick="viewHistoryDetail(${index})">Xem</button>
                        <button class="btn btn-danger" onclick="deleteHistoryItem(${index})">Xóa</button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function filterHistory() {
    const keyword = document.getElementById("historySearch").value.toLowerCase().trim();
    const type = document.getElementById("historyTypeFilter").value;
    const risk = document.getElementById("historyRiskFilter").value;

    const filtered = allHistoryItems.filter(item => {
        const drugs = getDrugListText(item).toLowerCase();
        const diseases = getDiseaseListText(item).toLowerCase();
        const message = getResultMessage(item).toLowerCase();
        const level = getResultLevel(item);

        const matchKeyword =
            drugs.includes(keyword) ||
            diseases.includes(keyword) ||
            message.includes(keyword);

        const matchType = type === "all" || item.type === type;
        const matchRisk = risk === "all" || level === risk || (risk === "Low" && level === "Safe");

        return matchKeyword && matchType && matchRisk;
    });

    renderHistory(filtered);
}

function viewHistoryDetail(index) {
    const item = allHistoryItems[index];

    if (!item) return;

    const drugs = getDrugListText(item);
    const diseases = getDiseaseListText(item);
    const typeText = getTypeText(item.type);
    const level = getResultLevel(item);
    const message = getResultMessage(item);
    const recommendations = item.result?.recommendations || [];

    const detailContent = document.getElementById("historyDetailContent");

    detailContent.innerHTML = `
        <div class="detail-row">
            <span>Thời gian</span>
            <strong>${item.createdAt || "Không rõ"}</strong>
        </div>

        <div class="detail-row">
            <span>Loại kiểm tra</span>
            <strong>${typeText}</strong>
        </div>

        <div class="detail-row">
            <span>Danh sách thuốc</span>
            <strong>${drugs}</strong>
        </div>

        <div class="detail-row">
            <span>Bệnh nền</span>
            <strong>${diseases}</strong>
        </div>

        <div class="detail-row">
            <span>Mức độ</span>
            <strong>${level}</strong>
        </div>

        <div class="history-detail-message">
            <h3>Kết quả phân tích</h3>
            <p>${message}</p>
        </div>

        <div class="history-detail-message">
            <h3>Khuyến nghị</h3>
            ${
                recommendations.length > 0
                    ? `<ul>${recommendations.map(item => `<li>${item}</li>`).join("")}</ul>`
                    : `<p>Không có khuyến nghị cụ thể.</p>`
            }
        </div>
    `;

    document.getElementById("historyDetailModal").classList.add("show");
}

function closeHistoryDetail() {
    document.getElementById("historyDetailModal").classList.remove("show");
}

function deleteHistoryItem(index) {
    if (!confirm("Bạn có chắc muốn xóa lịch sử này không?")) {
        return;
    }

    allHistoryItems.splice(index, 1);
    localStorage.setItem("historyItems", JSON.stringify(allHistoryItems));

    showMessage("historyMessage", "Đã xóa lịch sử tra cứu.", "success");
    updateHistoryStats(allHistoryItems);
    renderHistory(allHistoryItems);
}

function clearAllHistory() {
    if (allHistoryItems.length === 0) {
        showMessage("historyMessage", "Không có lịch sử để xóa.");
        return;
    }

    if (!confirm("Bạn có chắc muốn xóa toàn bộ lịch sử không?")) {
        return;
    }

    allHistoryItems = [];
    localStorage.setItem("historyItems", JSON.stringify(allHistoryItems));

    showMessage("historyMessage", "Đã xóa toàn bộ lịch sử.", "success");
    updateHistoryStats(allHistoryItems);
    renderHistory(allHistoryItems);
}

function exportHistoryCSV() {
    if (allHistoryItems.length === 0) {
        showMessage("historyMessage", "Không có dữ liệu lịch sử để xuất.");
        return;
    }

    const rows = [
        ["Thời gian", "Loại kiểm tra", "Danh sách thuốc", "Bệnh nền", "Mức độ", "Kết quả"]
    ];

    allHistoryItems.forEach(item => {
        rows.push([
            item.createdAt || "",
            getTypeText(item.type),
            getDrugListText(item),
            getDiseaseListText(item),
            getResultLevel(item),
            getResultMessage(item)
        ]);
    });

    const csvContent = rows
        .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "DrugSafe_LichSuTraCuu.csv";
    link.click();

    URL.revokeObjectURL(url);

    showMessage("historyMessage", "Đã xuất file CSV thành công.", "success");
}

function printHistory() {
    window.print();
}

function getDrugListText(item) {
    if (item.input?.drugNames && item.input.drugNames.length > 0) {
        return item.input.drugNames.join(", ");
    }

    return "Không có dữ liệu";
}

function getDiseaseListText(item) {
    if (item.input?.diseaseNames && item.input.diseaseNames.length > 0) {
        return item.input.diseaseNames.join(", ");
    }

    return "Không áp dụng";
}

function getTypeText(type) {
    if (type === "contraindication") return "Chống chỉ định";
    if (type === "interaction") return "Tương tác thuốc";
    if (type === "comprehensive") return "Kiểm tra toàn diện";
    return "Khác";
}

function getResultLevel(item) {
    const level = item.result?.level;

    if (!level) {
        if (item.result?.hasWarning === false) return "Safe";
        return "Low";
    }

    return level;
}

function getLevelClass(level) {
    if (level === "High") return "risk-high";
    if (level === "Medium") return "risk-medium";
    return "risk-low";
}

function getResultMessage(item) {
    return item.result?.message || item.result?.summary || "Không có nội dung kết quả.";
}