USE DrugContraindicationDB;
GO

IF NOT EXISTS (
    SELECT 1 FROM Recommendations
    WHERE OriginalDrugName = N'Aspirin'
      AND DiseaseName = N'Viêm loét dạ dày'
      AND RecommendedDrugName = N'Paracetamol'
)
INSERT INTO Recommendations
(
    OriginalDrugName,
    DiseaseName,
    RecommendedDrugName,
    Reason,
    Priority
)
VALUES
(
    N'Aspirin',
    N'Viêm loét dạ dày',
    N'Paracetamol',
    N'Paracetamol thường ít gây kích ứng dạ dày hơn so với Aspirin trong một số trường hợp giảm đau hạ sốt.',
    1
);

IF NOT EXISTS (
    SELECT 1 FROM Recommendations
    WHERE OriginalDrugName = N'Aspirin'
      AND DiseaseName = N'Hen suyễn'
      AND RecommendedDrugName = N'Paracetamol'
)
INSERT INTO Recommendations
(
    OriginalDrugName,
    DiseaseName,
    RecommendedDrugName,
    Reason,
    Priority
)
VALUES
(
    N'Aspirin',
    N'Hen suyễn',
    N'Paracetamol',
    N'Paracetamol có thể là lựa chọn thay thế phù hợp hơn cho người có nguy cơ nhạy cảm với Aspirin.',
    1
);

IF NOT EXISTS (
    SELECT 1 FROM Recommendations
    WHERE OriginalDrugName = N'Ibuprofen'
      AND DiseaseName = N'Suy thận'
      AND RecommendedDrugName = N'Paracetamol'
)
INSERT INTO Recommendations
(
    OriginalDrugName,
    DiseaseName,
    RecommendedDrugName,
    Reason,
    Priority
)
VALUES
(
    N'Ibuprofen',
    N'Suy thận',
    N'Paracetamol',
    N'Paracetamol có thể được cân nhắc thay thế trong một số trường hợp giảm đau, tuy nhiên cần thận trọng liều dùng.',
    1
);

IF NOT EXISTS (
    SELECT 1 FROM Recommendations
    WHERE OriginalDrugName = N'Metformin'
      AND DiseaseName = N'Suy thận'
      AND RecommendedDrugName = N'Insulin'
)
INSERT INTO Recommendations
(
    OriginalDrugName,
    DiseaseName,
    RecommendedDrugName,
    Reason,
    Priority
)
VALUES
(
    N'Metformin',
    N'Suy thận',
    N'Insulin',
    N'Insulin có thể được bác sĩ cân nhắc trong trường hợp bệnh nhân suy thận không phù hợp dùng Metformin.',
    1
);

IF NOT EXISTS (
    SELECT 1 FROM Recommendations
    WHERE OriginalDrugName = N'Warfarin'
      AND DiseaseName = N'Nguy cơ chảy máu'
      AND RecommendedDrugName = N'Tham khảo bác sĩ'
)
INSERT INTO Recommendations
(
    OriginalDrugName,
    DiseaseName,
    RecommendedDrugName,
    Reason,
    Priority
)
VALUES
(
    N'Warfarin',
    N'Nguy cơ chảy máu',
    N'Tham khảo bác sĩ',
    N'Warfarin là thuốc chống đông cần được bác sĩ đánh giá trước khi thay đổi thuốc.',
    1
);
GO