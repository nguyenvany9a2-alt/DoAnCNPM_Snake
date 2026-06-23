let selectedDrugs = [];

const demoDrugs = [
    { drugId: 1, drugName: "Paracetamol" },
    { drugId: 2, drugName: "Aspirin" },
    { drugId: 3, drugName: "Ibuprofen" },
    { drugId: 4, drugName: "Warfarin" },
    { drugId: 5, drugName: "Metformin" }
];

const demoDiseases = [
    { id: 1, diseaseName: "Viêm loét dạ dày" },
    { id: 2, diseaseName: "Hen suyễn" },
    { id: 3, diseaseName: "Tăng huyết áp" },
    { id: 4, diseaseName: "Suy gan" },
    { id: 5, diseaseName: "Suy thận" }
];

document.addEventListener("DOMContentLoaded", function () {
    loadDrugs();
    loadDiseases();

    document.getElementById("addDrugBtn").addEventListener("click", addDrug);
    document.getElementById("checkContraBtn").addEventListener("click", checkContraindication);
    document.getElementById("checkInteractionBtn").addEventListener("click", checkInteraction);
});

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
}

function renderDrugList() {
    const drugList = document.getElementById("drugList");
    drugList.innerHTML = "";

    if (selectedDrugs.length === 0) {
        drugList.innerHTML = `
            <p style="color:#6b7280; margin-top:12px;">
                Chưa có thuốc nào được chọn.
            </p>
        `;
        return;
    }

    selectedDrugs.forEach((drug, index) => {
        const item = document.createElement("div");
        item.className = "drug-item";

        item.innerHTML = `
            <span>${drug}</span>
            <button class="btn btn-danger" onclick="removeDrug(${index})">Xóa</button>
        `;

        drugList.appendChild(item);
    });
}

function removeDrug(index) {
    selectedDrugs.splice(index, 1);
    renderDrugList();
}

async function checkContraindication() {
    clearMessage("checkMessage");

    const diseaseName = document.getElementById("diseaseSelect").value;

    if (selectedDrugs.length === 0) {
        showMessage("checkMessage", "Vui lòng chọn ít nhất một thuốc.");
        return;
    }

    if (!diseaseName) {
        showMessage("checkMessage", "Vui lòng chọn bệnh nền.");
        return;
    }

    const requestData = {
        drugNames: selectedDrugs,
        diseaseNames: [diseaseName]
    };

    try {
        const result = await apiRequest("/Check/contraindication", "POST", requestData);
        saveResult("contraindication", requestData, result);

    } catch {
        const demoResult = {
            hasWarning: true,
            level: "High",
            message: `${selectedDrugs.join(", ")} có thể không phù hợp với bệnh nền ${diseaseName}.`,
            recommendations: ["Paracetamol"]
        };

        saveResult("contraindication", requestData, demoResult);
    }
}

async function checkInteraction() {
    clearMessage("checkMessage");

    if (selectedDrugs.length < 2) {
        showMessage("checkMessage", "Cần chọn ít nhất 2 thuốc để kiểm tra tương tác.");
        return;
    }

    const requestData = {
        drugNames: selectedDrugs
    };

    try {
        const result = await apiRequest("/Check/interaction", "POST", requestData);
        saveResult("interaction", requestData, result);

    } catch {
        const demoResult = {
            hasWarning: true,
            level: "Medium",
            message: `Có khả năng xảy ra tương tác giữa ${selectedDrugs.join(" và ")}.`,
            recommendations: ["Tham khảo ý kiến bác sĩ trước khi sử dụng."]
        };

        saveResult("interaction", requestData, demoResult);
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