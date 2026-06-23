let selectedDrugs = [];

const demoDrugs = [
    { drugId: 1, drugName: "Paracetamol" },
    { drugId: 2, drugName: "Aspirin" },
    { drugId: 3, drugName: "Ibuprofen" },
    { drugId: 4, drugName: "Warfarin" },
    { drugId: 5, drugName: "Metformin" },
    { drugId: 6, drugName: "Amlodipine" },
    { drugId: 7, drugName: "Omeprazole" },
    { drugId: 8, drugName: "Vitamin C" }
];

const demoDiseases = [
    { id: 1, diseaseName: "Viêm loét dạ dày" },
    { id: 2, diseaseName: "Hen suyễn" },
    { id: 3, diseaseName: "Tăng huyết áp" },
    { id: 4, diseaseName: "Suy gan" },
    { id: 5, diseaseName: "Suy thận" },
    { id: 6, diseaseName: "Đái tháo đường" },
    { id: 7, diseaseName: "Bệnh tim mạch" },
    { id: 8, diseaseName: "Rối loạn đông máu" }
];

document.addEventListener("DOMContentLoaded", function () {
    loadDrugs();
    loadDiseases();
    renderDrugList();
    updateCartBadgeIfExists();

    document.getElementById("addDrugBtn").addEventListener("click", addDrug);
    document.getElementById("clearDrugBtn").addEventListener("click", clearDrugList);
    document.getElementById("checkContraBtn").addEventListener("click", checkContraindication);
    document.getElementById("checkInteractionBtn").addEventListener("click", checkInteraction);
    document.getElementById("checkAllBtn").addEventListener("click", checkAll);

    document.getElementById("drugSelect").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            addDrug();
        }
    });
});

function updateCartBadgeIfExists() {
    if (typeof updateCartBadge === "function") {
        updateCartBadge();
    }
}

async function loadDrugs() {
    const drugSelect = document.getElementById("drugSelect");
    drugSelect.innerHTML = `<option value="">-- Chọn thuốc --</option>`;

    try {
        const drugs = await apiRequest("/Drug");

        drugs.forEach(drug => {
            const option = document.createElement("option");
            option.value = drug.drugName;
            option.textContent = drug.drugName;
            drugSelect.appendChild(option);
        });

    } catch {
        demoDrugs.forEach(drug => {
            const option = document.createElement("option");
            option.value = drug.drugName;
            option.textContent = drug.drugName;
            drugSelect.appendChild(option);
        });
    }
}

async function loadDiseases() {
    const diseaseSelect = document.getElementById("diseaseSelect");
    diseaseSelect.innerHTML = `<option value="">-- Chọn bệnh nền --</option>`;

    try {
        const diseases = await apiRequest("/Disease");

        diseases.forEach(disease => {
            const option = document.createElement("option");
            option.value = disease.diseaseName;
            option.textContent = disease.diseaseName;
            diseaseSelect.appendChild(option);
        });

    } catch {
        demoDiseases.forEach(disease => {
            const option = document.createElement("option");
            option.value = disease.diseaseName;
            option.textContent = disease.diseaseName;
            diseaseSelect.appendChild(option);
        });
    }
}

function addDrug() {
    clearMessage("checkMessage");

    const drugSelect = document.getElementById("drugSelect");
    const drugName = drugSelect.value;

    if (!drugName) {
        showMessage("checkMessage", "Vui lòng chọn một thuốc trong danh mục.");
        return;
    }

    if (selectedDrugs.includes(drugName)) {
        showMessage("checkMessage", "Thuốc này đã được thêm vào danh sách.");
        return;
    }

    selectedDrugs.push(drugName);
    drugSelect.value = "";

    renderDrugList();
    showMessage("checkMessage", `Đã thêm ${drugName} vào danh sách kiểm tra.`, "success");
}

function renderDrugList() {
    const drugList = document.getElementById("drugList");
    const selectedCount = document.getElementById("selectedCount");

    selectedCount.textContent = `${selectedDrugs.length} thuốc`;

    if (selectedDrugs.length === 0) {
        drugList.innerHTML = `
            <div class="empty-selection">
                <div>💊</div>
                <p>Chưa có thuốc nào được chọn.</p>
            </div>
        `;
        return;
    }

    drugList.innerHTML = selectedDrugs.map((drug, index) => `
        <div class="drug-item premium-drug-item">
            <div>
                <strong>${drug}</strong>
                <span>Cần kiểm tra trước khi sử dụng</span>
            </div>
            <button class="btn btn-danger" onclick="removeDrug(${index})">Xóa</button>
        </div>
    `).join("");
}

function removeDrug(index) {
    selectedDrugs.splice(index, 1);
    renderDrugList();
}

function clearDrugList() {
    selectedDrugs = [];
    renderDrugList();
    clearMessage("checkMessage");
}

function selectDiseaseQuick(diseaseName) {
    const diseaseSelect = document.getElementById("diseaseSelect");

    const exists = Array.from(diseaseSelect.options).some(option => option.value === diseaseName);

    if (!exists) {
        const option = document.createElement("option");
        option.value = diseaseName;
        option.textContent = diseaseName;
        diseaseSelect.appendChild(option);
    }

    diseaseSelect.value = diseaseName;
    showMessage("checkMessage", `Đã chọn bệnh nền: ${diseaseName}`, "success");
}

function useDemoCase(type) {
    clearMessage("checkMessage");

    if (type === "stomach") {
        selectedDrugs = ["Aspirin"];
        selectDiseaseQuick("Viêm loét dạ dày");
    }

    if (type === "interaction") {
        selectedDrugs = ["Warfarin", "Aspirin"];
        selectDiseaseQuick("Rối loạn đông máu");
    }

    if (type === "liver") {
        selectedDrugs = ["Paracetamol"];
        selectDiseaseQuick("Suy gan");
    }

    renderDrugList();
    showMessage("checkMessage", "Đã áp dụng dữ liệu mẫu. Bấm kiểm tra để xem kết quả.", "success");
}

function validateContraindicationInput() {
    const diseaseName = document.getElementById("diseaseSelect").value;

    if (selectedDrugs.length === 0) {
        showMessage("checkMessage", "Vui lòng chọn ít nhất một thuốc.");
        return null;
    }

    if (!diseaseName) {
        showMessage("checkMessage", "Vui lòng chọn bệnh nền.");
        return null;
    }

    return {
        drugNames: selectedDrugs,
        diseaseNames: [diseaseName]
    };
}

function validateInteractionInput() {
    if (selectedDrugs.length < 2) {
        showMessage("checkMessage", "Cần chọn ít nhất 2 thuốc để kiểm tra tương tác.");
        return null;
    }

    return {
        drugNames: selectedDrugs
    };
}

async function checkContraindication() {
    clearMessage("checkMessage");

    const requestData = validateContraindicationInput();
    if (!requestData) return;

    setCheckingState("checkContraBtn", true, "Đang kiểm tra...");

    try {
        const response = await apiRequest("/Check/contraindication", "POST", requestData);
        const result = normalizeContraindicationResult(response);

        saveResult("contraindication", requestData, result);

    } catch {
        const diseaseName = requestData.diseaseNames[0];

        const demoResult = {
            hasWarning: true,
            level: "High",
            message: `${selectedDrugs.join(", ")} có thể không phù hợp với bệnh nền ${diseaseName}.`,
            recommendations: [
                "Nên tham khảo ý kiến bác sĩ hoặc dược sĩ.",
                "Có thể cân nhắc thuốc thay thế nếu được chuyên môn cho phép."
            ]
        };

        saveResult("contraindication", requestData, demoResult);
    } finally {
        setCheckingState("checkContraBtn", false, "Kiểm tra chống chỉ định");
    }
}

async function checkInteraction() {
    clearMessage("checkMessage");

    const requestData = validateInteractionInput();
    if (!requestData) return;

    setCheckingState("checkInteractionBtn", true, "Đang kiểm tra...");

    try {
        const response = await apiRequest("/Check/interaction", "POST", requestData);
        const result = normalizeInteractionResult(response);

        saveResult("interaction", requestData, result);

    } catch {
        const demoResult = {
            hasWarning: true,
            level: "Medium",
            message: `Có khả năng xảy ra tương tác giữa ${selectedDrugs.join(" và ")}.`,
            recommendations: [
                "Không tự ý phối hợp thuốc nếu chưa có hướng dẫn.",
                "Nên hỏi bác sĩ/dược sĩ trước khi sử dụng đồng thời."
            ]
        };

        saveResult("interaction", requestData, demoResult);
    } finally {
        setCheckingState("checkInteractionBtn", false, "Kiểm tra tương tác thuốc");
    }
}

async function checkAll() {
    clearMessage("checkMessage");

    const diseaseName = document.getElementById("diseaseSelect").value;

    if (selectedDrugs.length === 0) {
        showMessage("checkMessage", "Vui lòng chọn ít nhất một thuốc.");
        return;
    }

    if (!diseaseName) {
        showMessage("checkMessage", "Vui lòng chọn bệnh nền để kiểm tra toàn diện.");
        return;
    }

    setCheckingState("checkAllBtn", true, "Đang kiểm tra toàn diện...");

    const requestData = {
        drugNames: selectedDrugs,
        diseaseNames: [diseaseName]
    };

    try {
        const contraResponse = await apiRequest("/Check/contraindication", "POST", requestData);
        const contraResult = normalizeContraindicationResult(contraResponse);

        if (selectedDrugs.length >= 2) {
            const interactionResponse = await apiRequest("/Check/interaction", "POST", {
                drugNames: selectedDrugs
            });

            const interactionResult = normalizeInteractionResult(interactionResponse);

            const finalResult = combineResults(contraResult, interactionResult);
            saveResult("comprehensive", requestData, finalResult);
        } else {
            saveResult("contraindication", requestData, contraResult);
        }

    } catch {
        const demoResult = {
            hasWarning: true,
            level: "Medium",
            message: "Hệ thống đã thực hiện kiểm tra toàn diện dựa trên dữ liệu demo.",
            recommendations: [
                "Nên kiểm tra lại thông tin thuốc và bệnh nền.",
                "Tham khảo ý kiến chuyên môn nếu có cảnh báo."
            ]
        };

        saveResult("comprehensive", requestData, demoResult);
    } finally {
        setCheckingState("checkAllBtn", false, "Kiểm tra toàn diện");
    }
}

function normalizeContraindicationResult(response) {
    if (response.warnings && response.warnings.length > 0) {
        const level = getHighestLevel(response.warnings.map(x => x.level));

        const messages = response.warnings.map(item =>
            `${item.drugName} với ${item.diseaseName}: ${item.warning}`
        );

        return {
            hasWarning: true,
            level: level,
            message: messages.join(" | "),
            recommendations: [
                "Không tự ý sử dụng thuốc khi có cảnh báo.",
                "Nên tham khảo ý kiến bác sĩ hoặc dược sĩ."
            ]
        };
    }

    return {
        hasWarning: false,
        level: "Low",
        message: response.summary || "Không phát hiện chống chỉ định trong dữ liệu hiện tại.",
        recommendations: ["Tiếp tục sử dụng theo đúng hướng dẫn chuyên môn."]
    };
}

function normalizeInteractionResult(response) {
    if (response.interactions && response.interactions.length > 0) {
        const level = getHighestLevel(response.interactions.map(x => x.level));

        const messages = response.interactions.map(item =>
            `${item.drugA} + ${item.drugB}: ${item.description}`
        );

        return {
            hasWarning: true,
            level: level,
            message: messages.join(" | "),
            recommendations: [
                "Không tự ý phối hợp thuốc nếu chưa có hướng dẫn.",
                "Nên hỏi bác sĩ/dược sĩ trước khi sử dụng đồng thời."
            ]
        };
    }

    return {
        hasWarning: false,
        level: "Low",
        message: response.summary || "Không phát hiện tương tác thuốc trong dữ liệu hiện tại.",
        recommendations: ["Tiếp tục theo dõi và sử dụng thuốc đúng hướng dẫn."]
    };
}

function combineResults(contraResult, interactionResult) {
    const level = getHighestLevel([contraResult.level, interactionResult.level]);

    return {
        hasWarning: contraResult.hasWarning || interactionResult.hasWarning,
        level: level,
        message: `
            Chống chỉ định: ${contraResult.message}
            | Tương tác thuốc: ${interactionResult.message}
        `,
        recommendations: [
            ...contraResult.recommendations,
            ...interactionResult.recommendations
        ]
    };
}

function getHighestLevel(levels) {
    const normalized = levels.map(level => String(level || "").toLowerCase());

    if (normalized.includes("high")) return "High";
    if (normalized.includes("medium")) return "Medium";
    return "Low";
}

function setCheckingState(buttonId, isLoading, text) {
    const button = document.getElementById(buttonId);

    if (!button) return;

    button.disabled = isLoading;
    button.textContent = text;

    if (isLoading) {
        button.classList.add("loading");
    } else {
        button.classList.remove("loading");
    }
}

function saveResult(type, input, result) {
    const data = {
        type: type,
        input: input,
        result: result,
        createdAt: new Date().toLocaleString("vi-VN")
    };

    localStorage.setItem("lastResult", JSON.stringify(data));

    const history = JSON.parse(localStorage.getItem("historyItems") || "[]");
    history.unshift(data);
    localStorage.setItem("historyItems", JSON.stringify(history));

    window.location.href = "result.html";
}