let historyData = [];
let filteredHistory = [];

document.addEventListener("DOMContentLoaded", function () {
    historyData = loadHistoryData();
    filteredHistory = [...historyData];

    updateCartBadge();
    renderHistoryStats();
    renderHistoryTable(filteredHistory);
    bindHistoryEvents();
});

function bindHistoryEvents() {
    const searchInput = document.getElementById("historySearch");
    const typeFilter = document.getElementById("historyTypeFilter");
    const riskFilter = document.getElementById("historyRiskFilter");

    if (searchInput) {
        searchInput.addEventListener("input", applyHistoryFilters);
    }

    if (typeFilter) {
        typeFilter.addEventListener("change", applyHistoryFilters);
    }

    if (riskFilter) {
        riskFilter.addEventListener("change", applyHistoryFilters);
    }
}

function loadHistoryData() {
    const keys = [
        "drugSafeHistory",
        "historyItems",
        "checkHistory",
        "history",
        "histories"
    ];

    let result = [];

    keys.forEach(key => {
        const raw = localStorage.getItem(key);

        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);

            if (Array.isArray(parsed)) {
                result = result.concat(parsed);
            }
        } catch (error) {
            console.error(`Không đọc được dữ liệu lịch sử từ key ${key}:`, error);
        }
    });

    result = result.map((item, index) => normalizeHistoryItem(item, index));

    return removeDuplicateHistory(result)
        .sort((a, b) => new Date(b.rawDate || b.createdAt) - new Date(a.rawDate || a.createdAt));
}

function normalizeHistoryItem(item, index) {
    const type = normalizeType(item.type || item.checkType || item.category || "Kiểm tra thuốc");

    const drugList = normalizeDrugList(
        item.drugList ||
        item.drugs ||
        item.drugNames ||
        item.input?.drugNames ||
        item.input?.drugList ||
        item.result?.drugList ||
        ""
    );

    const diseaseName = normalizeDiseaseName(
        item.diseaseName ||
        item.disease ||
        item.diseases ||
        item.input?.diseaseNames ||
        item.input?.diseaseName ||
        "Không áp dụng"
    );

    const level = normalizeLevel(
        item.level ||
        item.severity ||
        item.riskLevel ||
        item.result?.level ||
        item.result?.severity ||
        ""
    );

    const resultText =
        item.resultText ||
        item.message ||
        item.warning ||
        item.result?.message ||
        item.result?.warning ||
        item.result ||
        buildRecommendationResultText(item) ||
        "Không có nội dung kết quả.";

    const recommendations =
        item.recommendations ||
        item.recommendedDrugs ||
        item.result?.recommendations ||
        item.result?.recommendedDrugs ||
        [];

    const createdAt =
        item.createdAt ||
        item.date ||
        item.time ||
        item.createdDate ||
        new Date().toLocaleString("vi-VN");

    return {
        id: item.id || item.historyId || `local-${index}-${Date.now()}`,
        type,
        drugList,
        diseaseName,
        level,
        resultText: String(resultText),
        recommendations: normalizeRecommendations(recommendations),
        createdAt,
        rawDate: item.createdAt || item.date || item.time || null,
        original: item
    };
}

function removeDuplicateHistory(items) {
    const map = new Map();

    items.forEach(item => {
        const key = [
            item.type,
            item.createdAt,
            item.drugList,
            item.diseaseName,
            item.resultText
        ].join("|");

        if (!map.has(key)) {
            map.set(key, item);
        }
    });

    return Array.from(map.values());
}

function normalizeType(type) {
    const value = String(type).toLowerCase();

    if (value.includes("contraindication") || value.includes("chống")) {
        return "contraindication";
    }

    if (value.includes("interaction") || value.includes("tương tác")) {
        return "interaction";
    }

    if (value.includes("comprehensive") || value.includes("toàn diện")) {
        return "comprehensive";
    }

    if (value.includes("recommendation") || value.includes("gợi ý") || value.includes("thay thế")) {
        return "recommendation";
    }

    return "general";
}

function getTypeLabel(type) {
    switch (type) {
        case "contraindication":
            return "Chống chỉ định";
        case "interaction":
            return "Tương tác thuốc";
        case "comprehensive":
            return "Kiểm tra toàn diện";
        case "recommendation":
            return "Gợi ý thuốc thay thế";
        default:
            return "Kiểm tra thuốc";
    }
}

function normalizeDrugList(value) {
    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (typeof value === "object" && value !== null) {
        return JSON.stringify(value);
    }

    return value ? String(value) : "Không có dữ liệu";
}

function normalizeDiseaseName(value) {
    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : "Không áp dụng";
    }

    if (typeof value === "object" && value !== null) {
        return JSON.stringify(value);
    }

    return value ? String(value) : "Không áp dụng";
}

function normalizeLevel(value) {
    const level = String(value || "").trim();

    if (!level) {
        return "Low";
    }

    const lower = level.toLowerCase();

    if (lower.includes("high") || lower.includes("cao") || lower.includes("nguy hiểm")) {
        return "High";
    }

    if (lower.includes("medium") || lower.includes("trung bình")) {
        return "Medium";
    }

    if (lower.includes("recommendation") || lower.includes("gợi ý")) {
        return "Recommendation";
    }

    return "Low";
}

function normalizeRecommendations(value) {
    if (!value) return [];

    const list = Array.isArray(value) ? value : [value];

    return list.map(item => {
        if (typeof item === "string") {
            return {
                originalDrugName: "",
                recommendedDrugName: item,
                diseaseName: "",
                reason: "",
                safetyNote: "",
                priority: 1
            };
        }

        return {
            originalDrugName: item.originalDrugName || item.originalDrug || item.drugName || "",
            recommendedDrugName: item.recommendedDrugName || item.recommendedDrug || item.alternativeDrugName || item.name || "",
            diseaseName: item.diseaseName || item.disease || "",
            reason: item.reason || item.description || "",
            safetyNote: item.safetyNote || item.note || item.warning || "",
            priority: item.priority || item.rank || 1
        };
    });
}

function buildRecommendationResultText(item) {
    const recommendations = normalizeRecommendations(
        item.recommendations ||
        item.recommendedDrugs ||
        item.result?.recommendations ||
        item.result?.recommendedDrugs ||
        []
    );

    if (recommendations.length === 0) {
        return "";
    }

    return recommendations
        .map(r => `${r.originalDrugName || "Thuốc ban đầu"} → ${r.recommendedDrugName || "Thuốc thay thế"}`)
        .join("; ");
}

function applyHistoryFilters() {
    const searchValue = document.getElementById("historySearch")?.value.toLowerCase().trim() || "";
    const typeValue = document.getElementById("historyTypeFilter")?.value || "all";
    const riskValue = document.getElementById("historyRiskFilter")?.value || "all";

    filteredHistory = historyData.filter(item => {
        const searchText = [
            item.type,
            getTypeLabel(item.type),
            item.drugList,
            item.diseaseName,
            item.level,
            item.resultText,
            JSON.stringify(item.recommendations)
        ].join(" ").toLowerCase();

        const matchesSearch = !searchValue || searchText.includes(searchValue);
        const matchesType = typeValue === "all" || item.type === typeValue;
        const matchesRisk = riskValue === "all" || item.level === riskValue;

        return matchesSearch && matchesType && matchesRisk;
    });

    renderHistoryTable(filteredHistory);
}

function renderHistoryStats() {
    const total = historyData.length;

    const warning = historyData.filter(item =>
        item.level === "High" ||
        item.level === "Medium" ||
        item.type === "contraindication" ||
        item.type === "interaction"
    ).length;

    const highRisk = historyData.filter(item => item.level === "High").length;

    const safe = historyData.filter(item =>
        item.level === "Low" ||
        item.level === "Recommendation" ||
        item.type === "recommendation"
    ).length;

    setText("totalHistory", total);
    setText("warningHistory", warning);
    setText("highRiskHistory", highRisk);
    setText("safeHistory", safe);
}

function renderHistoryTable(data) {
    const tableBody = document.getElementById("historyTable");

    if (!tableBody) return;

    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding: 24px;">
                    Chưa có lịch sử phù hợp.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${escapeHtml(item.createdAt)}</td>
            <td>${escapeHtml(getTypeLabel(item.type))}</td>
            <td>${escapeHtml(item.drugList)}</td>
            <td>${escapeHtml(item.diseaseName)}</td>
            <td>${renderLevelBadge(item.level)}</td>
            <td>${escapeHtml(shortenText(item.resultText, 80))}</td>
            <td>
                <button class="btn btn-light" onclick="viewHistoryDetail('${item.id}')">Chi tiết</button>
                <button class="btn btn-danger" onclick="deleteHistoryItem('${item.id}')">Xóa</button>
            </td>
        </tr>
    `).join("");
}

function renderLevelBadge(level) {
    let className = "level-low";

    if (level === "High") {
        className = "level-high";
    } else if (level === "Medium") {
        className = "level-medium";
    } else if (level === "Recommendation") {
        className = "level-low";
    }

    return `<span class="${className}">${escapeHtml(level)}</span>`;
}

function viewHistoryDetail(id) {
    const item = historyData.find(h => String(h.id) === String(id));

    if (!item) {
        showHistoryMessage("Không tìm thấy lịch sử cần xem.", "error");
        return;
    }

    const modal = document.getElementById("historyDetailModal");
    const content = document.getElementById("historyDetailContent");

    if (!modal || !content) return;

    const recommendationHtml = item.recommendations && item.recommendations.length > 0
        ? `
            <div style="margin-top: 16px;">
                <h3>Gợi ý thuốc thay thế</h3>
                ${item.recommendations.map(r => `
                    <div class="recommendation-card" style="margin-top: 10px;">
                        <p><strong>Thuốc ban đầu:</strong> ${escapeHtml(r.originalDrugName || item.drugList)}</p>
                        <p><strong>Thuốc thay thế:</strong> ${escapeHtml(r.recommendedDrugName)}</p>
                        <p><strong>Lý do:</strong> ${escapeHtml(r.reason || "Phù hợp hơn trong trường hợp có cảnh báo.")}</p>
                        <p><strong>Ghi chú an toàn:</strong> ${escapeHtml(r.safetyNote || "Cần tham khảo ý kiến bác sĩ hoặc dược sĩ.")}</p>
                        <p><strong>Ưu tiên:</strong> ${escapeHtml(String(r.priority || 1))}</p>
                    </div>
                `).join("")}
            </div>
        `
        : "";

    content.innerHTML = `
        <div class="result-card">
            <p><strong>Thời gian:</strong> ${escapeHtml(item.createdAt)}</p>
            <p><strong>Loại kiểm tra:</strong> ${escapeHtml(getTypeLabel(item.type))}</p>
            <p><strong>Danh sách thuốc:</strong> ${escapeHtml(item.drugList)}</p>
            <p><strong>Bệnh nền:</strong> ${escapeHtml(item.diseaseName)}</p>
            <p><strong>Mức độ:</strong> ${renderLevelBadge(item.level)}</p>
            <p><strong>Kết quả:</strong> ${escapeHtml(item.resultText)}</p>
        </div>

        ${recommendationHtml}
    `;

    modal.classList.add("active");
    modal.style.display = "flex";
}

function closeHistoryDetail() {
    const modal = document.getElementById("historyDetailModal");

    if (!modal) return;

    modal.classList.remove("active");
    modal.style.display = "none";
}

function deleteHistoryItem(id) {
    if (!confirm("Bạn có chắc muốn xóa lịch sử này không?")) {
        return;
    }

    historyData = historyData.filter(item => String(item.id) !== String(id));
    saveMainHistory(historyData);

    filteredHistory = [...historyData];

    renderHistoryStats();
    applyHistoryFilters();
    showHistoryMessage("Đã xóa lịch sử tra cứu.", "success");
}

function clearAllHistory() {
    if (!confirm("Bạn có chắc muốn xóa toàn bộ lịch sử không?")) {
        return;
    }

    const keys = [
        "drugSafeHistory",
        "historyItems",
        "checkHistory",
        "history",
        "histories"
    ];

    keys.forEach(key => localStorage.removeItem(key));

    historyData = [];
    filteredHistory = [];

    renderHistoryStats();
    renderHistoryTable([]);
    showHistoryMessage("Đã xóa toàn bộ lịch sử.", "success");
}

function saveMainHistory(data) {
    localStorage.setItem("drugSafeHistory", JSON.stringify(data));
    localStorage.removeItem("historyItems");
    localStorage.removeItem("checkHistory");
    localStorage.removeItem("history");
    localStorage.removeItem("histories");
}

function exportHistoryCSV() {
    if (!filteredHistory || filteredHistory.length === 0) {
        showHistoryMessage("Không có dữ liệu lịch sử để xuất CSV.", "error");
        return;
    }

    const headers = [
        "STT",
        "Thời gian",
        "Loại kiểm tra",
        "Danh sách thuốc",
        "Bệnh nền",
        "Mức độ",
        "Kết quả",
        "Gợi ý thuốc thay thế"
    ];

    const rows = filteredHistory.map((item, index) => {
        const recommendationText = item.recommendations && item.recommendations.length > 0
            ? item.recommendations.map(r => `${r.originalDrugName || item.drugList} -> ${r.recommendedDrugName}`).join("; ")
            : "";

        return [
            index + 1,
            item.createdAt,
            getTypeLabel(item.type),
            item.drugList,
            item.diseaseName,
            item.level,
            item.resultText,
            recommendationText
        ];
    });

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "DrugSafe_History_Report.csv";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showHistoryMessage("Đã xuất file CSV lịch sử thành công.", "success");
}

function printHistory() {
    if (!filteredHistory || filteredHistory.length === 0) {
        showHistoryMessage("Không có dữ liệu lịch sử để in.", "error");
        return;
    }

    const rows = filteredHistory.map((item, index) => {
        const recommendationText = item.recommendations && item.recommendations.length > 0
            ? item.recommendations.map(r => `${r.originalDrugName || item.drugList} → ${r.recommendedDrugName}`).join("; ")
            : "";

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(item.createdAt)}</td>
                <td>${escapeHtml(getTypeLabel(item.type))}</td>
                <td>${escapeHtml(item.drugList)}</td>
                <td>${escapeHtml(item.diseaseName)}</td>
                <td>${escapeHtml(item.level)}</td>
                <td>${escapeHtml(item.resultText)}</td>
                <td>${escapeHtml(recommendationText)}</td>
            </tr>
        `;
    }).join("");

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        showHistoryMessage("Trình duyệt đã chặn cửa sổ in. Vui lòng cho phép popup.", "error");
        return;
    }

    printWindow.document.write(`
        <html>
        <head>
            <title>Báo cáo lịch sử tra cứu DrugSafe</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 24px;
                    color: #1f2937;
                }

                h1 {
                    text-align: center;
                    color: #0f766e;
                }

                p {
                    font-size: 14px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    border: 1px solid #d1d5db;
                    padding: 8px;
                    text-align: left;
                    font-size: 12px;
                    vertical-align: top;
                }

                th {
                    background: #ecfdf5;
                    color: #065f46;
                }

                .footer {
                    margin-top: 24px;
                    font-size: 13px;
                    color: #6b7280;
                }
            </style>
        </head>
        <body>
            <h1>BÁO CÁO LỊCH SỬ TRA CỨU DRUGSAFE</h1>
            <p><strong>Ngày xuất báo cáo:</strong> ${new Date().toLocaleString("vi-VN")}</p>

            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Thời gian</th>
                        <th>Loại kiểm tra</th>
                        <th>Danh sách thuốc</th>
                        <th>Bệnh nền</th>
                        <th>Mức độ</th>
                        <th>Kết quả</th>
                        <th>Gợi ý thuốc</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>

            <div class="footer">
                Báo cáo được xuất từ hệ thống DrugSafe. Thông tin chỉ có giá trị hỗ trợ tham khảo.
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");

    if (!badge) return;

    const possibleKeys = ["drugSafeCart", "cart", "cartItems"];
    let count = 0;

    possibleKeys.forEach(key => {
        const raw = localStorage.getItem(key);

        if (!raw) return;

        try {
            const cart = JSON.parse(raw);

            if (Array.isArray(cart)) {
                count += cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
            }
        } catch {
            // Ignore invalid cart data
        }
    });

    badge.textContent = count;
}

function showHistoryMessage(message, type = "success") {
    const messageBox = document.getElementById("historyMessage");

    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.textContent = "";
        messageBox.style.display = "none";
    }, 3000);
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function shortenText(text, maxLength) {
    if (!text) return "";

    const value = String(text);

    if (value.length <= maxLength) {
        return value;
    }

    return value.substring(0, maxLength) + "...";
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