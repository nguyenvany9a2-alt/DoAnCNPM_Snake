document.addEventListener("DOMContentLoaded", async function () {
    const resultBox = document.getElementById("resultBox");
    const data = localStorage.getItem("lastResult");

    if (!resultBox) {
        console.error("Không tìm thấy resultBox trong result.html");
        return;
    }

    if (!data) {
        resultBox.innerHTML = `
            <div class="result-card empty-state">
                <h3>Chưa có kết quả kiểm tra</h3>
                <p>Vui lòng quay lại trang kiểm tra để thực hiện tra cứu thuốc.</p>
            </div>
        `;
        return;
    }

    let resultData;

    try {
        resultData = JSON.parse(data);
    } catch (error) {
        resultBox.innerHTML = `
            <div class="result-card empty-state">
                <h3>Dữ liệu kết quả không hợp lệ</h3>
                <p>Vui lòng thực hiện kiểm tra lại.</p>
            </div>
        `;
        console.error("Lỗi đọc lastResult:", error);
        return;
    }

    renderBaseResult(resultData);

    const drugName = getFirstDrugName(resultData);
    const diseaseName = getFirstDiseaseName(resultData);

    if (drugName) {
        const recommendations = await loadRecommendations(drugName, diseaseName);
        renderRecommendations(recommendations, drugName, diseaseName);
        saveRecommendationHistory(recommendations, drugName, diseaseName);
    } else {
        renderRecommendations([], "", diseaseName);
    }
});

function renderBaseResult(resultData) {
    const resultBox = document.getElementById("resultBox");
    const result = resultData.result || {};

    const level = result.level || result.severity || "Không xác định";
    const message = result.message || result.warning || result.result || "Không có cảnh báo.";
    const createdAt = resultData.createdAt || new Date().toLocaleString("vi-VN");

    const typeText = getTypeText(resultData.type);
    const levelClass = getLevelClass(level);

    const drugs = Array.isArray(resultData.input?.drugNames)
        ? resultData.input.drugNames.join(", ")
        : resultData.input?.drugList || resultData.input?.drugName || "Không có dữ liệu";

    const diseases = Array.isArray(resultData.input?.diseaseNames)
        ? resultData.input.diseaseNames.join(", ")
        : resultData.input?.diseaseName || resultData.input?.disease || "Không áp dụng";

    resultBox.innerHTML = `
        <div class="result-card">
            <h3>Thông tin kiểm tra</h3>
            <p><strong>Loại kiểm tra:</strong> ${escapeHtml(typeText)}</p>
            <p><strong>Thuốc:</strong> ${escapeHtml(drugs)}</p>
            <p><strong>Bệnh nền:</strong> ${escapeHtml(diseases)}</p>
            <p><strong>Thời gian:</strong> ${escapeHtml(createdAt)}</p>
        </div>

        <div class="result-card">
            <h3>Kết quả cảnh báo</h3>
            <p>
                <strong>Mức độ:</strong>
                <span class="${levelClass}">${escapeHtml(level)}</span>
            </p>
            <p><strong>Nội dung cảnh báo:</strong> ${escapeHtml(message)}</p>
        </div>

        <div id="recommendationSection" class="result-card recommendation-section">
            <h3>Gợi ý thuốc thay thế</h3>
            <div id="recommendationList">
                <p>Đang tải dữ liệu gợi ý...</p>
            </div>
        </div>
    `;
}

async function loadRecommendations(drugName, diseaseName) {
    const apiBase = window.API_BASE_URL || "http://localhost:5210/api";

    try {
        const response = await fetch(`${apiBase}/Recommendation/suggest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                drugName: drugName,
                diseaseName: diseaseName || ""
            })
        });

        if (response.ok) {
            const data = await response.json();
            return normalizeRecommendations(data);
        }

        console.warn("API /Recommendation/suggest không trả về OK. Thử fallback GET /Recommendation.");
        return await loadRecommendationsFallback(drugName, diseaseName);
    } catch (error) {
        console.error("Lỗi khi gọi API Recommendation/suggest:", error);
        return await loadRecommendationsFallback(drugName, diseaseName);
    }
}

async function loadRecommendationsFallback(drugName, diseaseName) {
    const apiBase = window.API_BASE_URL || "http://localhost:5210/api";

    try {
        const response = await fetch(`${apiBase}/Recommendation`);

        if (!response.ok) {
            return [];
        }

        const allRecommendations = await response.json();
        const normalized = normalizeRecommendations(allRecommendations);

        return normalized
            .filter(item => {
                const sameDrug = item.originalDrugName.toLowerCase() === drugName.toLowerCase();
                const sameDisease = !diseaseName ||
                    item.diseaseName.toLowerCase() === diseaseName.toLowerCase();

                return sameDrug && sameDisease;
            })
            .sort((a, b) => a.priority - b.priority);
    } catch (error) {
        console.error("Lỗi fallback GET /Recommendation:", error);
        return [];
    }
}

function renderRecommendations(recommendations, drugName, diseaseName) {
    const list = document.getElementById("recommendationList");

    if (!list) return;

    if (!recommendations || recommendations.length === 0) {
        list.innerHTML = `
            <div class="recommendation-card">
                <h4>Chưa có thuốc thay thế phù hợp</h4>
                <p>
                    Hệ thống chưa tìm thấy thuốc thay thế phù hợp cho
                    <strong>${escapeHtml(drugName || "thuốc đã chọn")}</strong>
                    ${diseaseName ? `với bệnh nền <strong>${escapeHtml(diseaseName)}</strong>` : ""}.
                </p>
                ${renderSafeAdvice()}
            </div>
        `;
        return;
    }

    const recommendationHtml = recommendations.map(item => `
        <div class="recommendation-card">
            <h4>${escapeHtml(item.recommendedDrugName || "Thuốc thay thế")}</h4>
            <p><strong>Thuốc ban đầu:</strong> ${escapeHtml(item.originalDrugName || drugName || "")}</p>
            <p><strong>Bệnh nền liên quan:</strong> ${escapeHtml(item.diseaseName || diseaseName || "Không áp dụng")}</p>
            <p><strong>Lý do đề xuất:</strong> ${escapeHtml(item.reason || "Thuốc này được đề xuất vì phù hợp hơn với tình trạng người dùng.")}</p>
            <p><strong>Ghi chú an toàn:</strong> ${escapeHtml(item.safetyNote || "Cần tham khảo ý kiến bác sĩ hoặc dược sĩ trước khi sử dụng.")}</p>
            <p><strong>Mức ưu tiên:</strong> ${escapeHtml(String(item.priority || 1))}</p>
        </div>
    `).join("");

    list.innerHTML = `
        <div class="recommendation-list">
            ${recommendationHtml}
        </div>
        ${renderSafeAdvice()}
    `;
}

function renderSafeAdvice() {
    return `
        <div class="safe-advice">
            <h4>Đề xuất phương án điều trị an toàn</h4>
            <ul>
                <li>Không tự ý sử dụng hoặc thay thế thuốc khi có cảnh báo.</li>
                <li>Nên tham khảo ý kiến bác sĩ hoặc dược sĩ trước khi dùng thuốc thay thế.</li>
                <li>Theo dõi triệu chứng bất thường trong quá trình sử dụng thuốc.</li>
                <li>Thông tin trên hệ thống chỉ mang tính hỗ trợ tham khảo, không thay thế tư vấn y tế chuyên môn.</li>
            </ul>
        </div>
    `;
}

function saveRecommendationHistory(recommendations, drugName, diseaseName) {
    if (!recommendations || recommendations.length === 0) return;

    const historyKey = "drugSafeHistory";
    const historyList = JSON.parse(localStorage.getItem(historyKey)) || [];

    const createdAt = new Date().toLocaleString("vi-VN");
    const recommendationText = recommendations
        .map(item => `${item.originalDrugName || drugName} → ${item.recommendedDrugName}`)
        .join("; ");

    const isDuplicated = historyList.some(item =>
        item.type === "Gợi ý thuốc thay thế" &&
        item.drugList === drugName &&
        item.diseaseName === diseaseName &&
        item.result === recommendationText
    );

    if (isDuplicated) return;

    historyList.push({
        type: "Gợi ý thuốc thay thế",
        createdAt: createdAt,
        drugList: drugName,
        diseaseName: diseaseName || "Không áp dụng",
        result: recommendationText,
        level: "Recommendation",
        recommendations: recommendations
    });

    localStorage.setItem(historyKey, JSON.stringify(historyList));
}

function normalizeRecommendations(data) {
    if (!data) return [];

    let list = [];

    if (Array.isArray(data)) {
        list = data;
    } else if (Array.isArray(data.recommendedDrugs)) {
        list = data.recommendedDrugs;
    } else if (Array.isArray(data.recommendations)) {
        list = data.recommendations;
    } else {
        list = [data];
    }

    return list.map(item => {
        if (typeof item === "string") {
            return {
                originalDrugName: "",
                diseaseName: "",
                recommendedDrugName: item,
                reason: "Thuốc được hệ thống đề xuất thay thế.",
                safetyNote: "Cần tham khảo ý kiến bác sĩ hoặc dược sĩ trước khi sử dụng.",
                priority: 1
            };
        }

        return {
            originalDrugName: item.originalDrugName || item.originalDrug || item.drugName || "",
            diseaseName: item.diseaseName || item.disease || "",
            recommendedDrugName: item.recommendedDrugName || item.recommendedDrug || item.alternativeDrugName || item.name || "",
            reason: item.reason || item.description || "",
            safetyNote: item.safetyNote || item.note || item.warning || "",
            priority: item.priority || item.rank || 1
        };
    }).sort((a, b) => a.priority - b.priority);
}

function getFirstDrugName(resultData) {
    if (Array.isArray(resultData.input?.drugNames) && resultData.input.drugNames.length > 0) {
        return resultData.input.drugNames[0];
    }

    if (resultData.input?.drugName) {
        return resultData.input.drugName;
    }

    if (resultData.input?.drugList) {
        return resultData.input.drugList.split(",")[0].trim();
    }

    return "";
}

function getFirstDiseaseName(resultData) {
    if (Array.isArray(resultData.input?.diseaseNames) && resultData.input.diseaseNames.length > 0) {
        return resultData.input.diseaseNames[0];
    }

    if (resultData.input?.diseaseName) {
        return resultData.input.diseaseName;
    }

    if (resultData.input?.disease) {
        return resultData.input.disease;
    }

    return "";
}

function getTypeText(type) {
    if (type === "contraindication") {
        return "Kiểm tra chống chỉ định";
    }

    if (type === "interaction") {
        return "Kiểm tra tương tác thuốc";
    }

    if (type === "recommendation") {
        return "Gợi ý thuốc thay thế";
    }

    return "Kiểm tra thuốc";
}

function getLevelClass(level) {
    if (!level) return "level-low";

    const value = level.toString().toLowerCase();

    if (value.includes("high") || value.includes("nguy hiểm") || value.includes("cao")) {
        return "level-high";
    }

    if (value.includes("medium") || value.includes("trung bình")) {
        return "level-medium";
    }

    return "level-low";
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