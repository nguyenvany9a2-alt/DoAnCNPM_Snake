USE DrugContraindicationDB;
GO

IF OBJECT_ID(N'Recommendations', N'U') IS NULL
BEGIN
    CREATE TABLE Recommendations (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OriginalDrugName NVARCHAR(255) NOT NULL,
        DiseaseName NVARCHAR(255) NOT NULL,
        RecommendedDrugName NVARCHAR(255) NOT NULL,
        Reason NVARCHAR(MAX) NULL,
        SafetyNote NVARCHAR(MAX) NULL,
        Priority INT NOT NULL DEFAULT 1
    );
END
GO

IF COL_LENGTH('Recommendations', 'SafetyNote') IS NULL
BEGIN
    ALTER TABLE Recommendations ADD SafetyNote NVARCHAR(MAX) NULL;
END
GO

DELETE FROM Recommendations;
GO

INSERT INTO Recommendations
(OriginalDrugName, DiseaseName, RecommendedDrugName, Reason, SafetyNote, Priority)
VALUES
(N'Aspirin', N'Viêm loét dạ dày', N'Paracetamol',
 N'Paracetamol thường được chọn trong dữ liệu demo vì ít gây kích ứng dạ dày hơn Aspirin.',
 N'Không tự ý thay thuốc. Người bệnh cần hỏi ý kiến bác sĩ hoặc dược sĩ trước khi sử dụng.', 1),

(N'Ibuprofen', N'Viêm loét dạ dày', N'Paracetamol',
 N'Paracetamol được gợi ý thay thế trong trường hợp cần giảm đau/hạ sốt nhưng người dùng có tiền sử dạ dày.',
 N'Cần dùng đúng liều và tham khảo nhân viên y tế nếu có bệnh gan hoặc đang dùng thuốc khác.', 1),

(N'Diclofenac', N'Viêm loét dạ dày', N'Paracetamol',
 N'Dữ liệu demo gợi ý Paracetamol do nhóm NSAID có thể làm tăng nguy cơ kích ứng đường tiêu hóa.',
 N'Thông tin chỉ dùng cho mô phỏng hệ thống, không thay thế tư vấn y tế.', 2),

(N'Naproxen', N'Viêm loét dạ dày', N'Paracetamol',
 N'Paracetamol được đưa vào danh sách thay thế ưu tiên khi người dùng có nguy cơ về dạ dày.',
 N'Nên tham khảo bác sĩ nếu cơn đau kéo dài hoặc có triệu chứng bất thường.', 2),

(N'Warfarin', N'Nguy cơ chảy máu', N'Thuốc chống đông thay thế theo chỉ định bác sĩ',
 N'Warfarin có nguy cơ gây chảy máu trong một số tình huống; hệ thống khuyến nghị cần đánh giá lại thuốc.',
 N'Không tự ý đổi hoặc ngừng thuốc chống đông. Cần có chỉ định của bác sĩ.', 1),

(N'Warfarin', N'Tăng huyết áp', N'Không tự ý thay thế',
 N'Người dùng có bệnh tim mạch cần được bác sĩ đánh giá trước khi thay đổi thuốc.',
 N'Theo dõi huyết áp, dấu hiệu chảy máu và thông báo cho nhân viên y tế khi có bất thường.', 2),

(N'Metformin', N'Suy thận', N'Thuốc kiểm soát đường huyết theo chỉ định bác sĩ',
 N'Trong dữ liệu demo, Metformin cần được cảnh báo với người có vấn đề về thận.',
 N'Người bệnh không tự ý đổi thuốc tiểu đường. Cần bác sĩ điều chỉnh phác đồ.', 1),

(N'Glibenclamide', N'Suy thận', N'Thuốc điều trị tiểu đường phù hợp hơn theo chỉ định',
 N'Hệ thống gợi ý cần lựa chọn thuốc kiểm soát đường huyết an toàn hơn nếu có bệnh thận.',
 N'Cần theo dõi đường huyết và tham khảo bác sĩ chuyên khoa.', 2),

(N'Paracetamol', N'Suy gan', N'Ibuprofen',
 N'Trong dữ liệu demo, Paracetamol được cảnh báo ở bệnh nền suy gan; hệ thống gợi ý thuốc khác tùy tình huống.',
 N'Người bệnh gan không tự ý dùng thuốc giảm đau. Cần tư vấn bác sĩ trước khi dùng.', 1),

(N'Paracetamol', N'Bệnh gan mạn tính', N'Không tự ý thay thế',
 N'Hệ thống khuyến nghị thận trọng với thuốc chuyển hóa qua gan.',
 N'Cần đánh giá chức năng gan và chỉ sử dụng thuốc theo hướng dẫn của nhân viên y tế.', 1),

(N'Pseudoephedrine', N'Tăng huyết áp', N'Nước muối sinh lý hoặc thuốc xịt mũi phù hợp',
 N'Pseudoephedrine có thể không phù hợp với người tăng huyết áp trong dữ liệu cảnh báo demo.',
 N'Người bệnh tăng huyết áp nên hỏi bác sĩ/dược sĩ trước khi dùng thuốc cảm nghẹt mũi.', 1),

(N'Phenylephrine', N'Tăng huyết áp', N'Nước muối sinh lý hoặc thuốc hỗ trợ ít ảnh hưởng huyết áp',
 N'Hệ thống gợi ý lựa chọn phương án ít ảnh hưởng đến huyết áp hơn.',
 N'Theo dõi huyết áp và tránh tự ý phối hợp nhiều thuốc cảm.', 2),

(N'Loratadine', N'Suy gan', N'Cetirizine',
 N'Hệ thống demo gợi ý thuốc kháng histamine khác khi cần thận trọng với bệnh gan.',
 N'Cần hỏi ý kiến nhân viên y tế nếu có bệnh gan hoặc đang dùng nhiều thuốc.', 2),

(N'Cetirizine', N'Suy thận', N'Loratadine',
 N'Dữ liệu demo gợi ý xem xét thuốc thay thế khi người dùng có bệnh thận.',
 N'Cần điều chỉnh thuốc theo tình trạng bệnh và hướng dẫn của bác sĩ.', 2),

(N'Amoxicillin', N'Dị ứng Penicillin', N'Azithromycin',
 N'Nếu người dùng có tiền sử dị ứng Penicillin, hệ thống gợi ý nhóm kháng sinh khác trong dữ liệu demo.',
 N'Kháng sinh chỉ dùng khi có chỉ định. Không tự ý sử dụng hoặc thay thế.', 1),

(N'Ampicillin', N'Dị ứng Penicillin', N'Azithromycin',
 N'Hệ thống gợi ý tránh nhóm Penicillin nếu người dùng khai báo dị ứng liên quan.',
 N'Cần khai báo đầy đủ tiền sử dị ứng thuốc với bác sĩ/dược sĩ.', 1),

(N'Captopril', N'Phụ nữ mang thai', N'Thuốc huyết áp an toàn hơn theo chỉ định bác sĩ',
 N'Hệ thống demo cảnh báo cần thay thế thuốc phù hợp hơn trong thai kỳ.',
 N'Phụ nữ mang thai không tự ý dùng hoặc đổi thuốc. Cần bác sĩ chỉ định.', 1),

(N'Enalapril', N'Phụ nữ mang thai', N'Thuốc huyết áp an toàn hơn theo chỉ định bác sĩ',
 N'Dữ liệu demo khuyến nghị cần đánh giá lại thuốc huyết áp trong thai kỳ.',
 N'Cần theo dõi thai kỳ và dùng thuốc theo đơn bác sĩ.', 1),

(N'Isotretinoin', N'Phụ nữ mang thai', N'Thuốc điều trị mụn thay thế theo chỉ định bác sĩ',
 N'Hệ thống demo đưa ra cảnh báo mức cao với phụ nữ mang thai.',
 N'Cần tư vấn bác sĩ chuyên khoa. Không tự ý sử dụng thuốc.', 1),

(N'Omeprazole', N'Bệnh gan mạn tính', N'Pantoprazole',
 N'Hệ thống demo gợi ý thuốc cùng nhóm có thể được cân nhắc tùy tình trạng người bệnh.',
 N'Cần hỏi ý kiến bác sĩ nếu dùng kéo dài hoặc có bệnh gan.', 3),

(N'Simvastatin', N'Bệnh gan mạn tính', N'Thuốc hạ lipid khác theo chỉ định',
 N'Hệ thống khuyến nghị xem xét thuốc thay thế khi có bệnh gan mạn tính.',
 N'Không tự ý ngừng thuốc tim mạch. Cần xét nghiệm và tư vấn bác sĩ.', 1),

(N'Atorvastatin', N'Bệnh gan mạn tính', N'Thuốc hạ lipid khác theo chỉ định',
 N'Cần thận trọng khi dùng thuốc hạ lipid ở người có bệnh gan.',
 N'Cần theo dõi chức năng gan theo hướng dẫn y tế.', 2),

(N'Aspirin', N'Suy thận', N'Paracetamol',
 N'Hệ thống demo gợi ý lựa chọn thuốc giảm đau khác khi người dùng có bệnh thận.',
 N'Cần hỏi ý kiến bác sĩ nếu có bệnh thận hoặc đang dùng nhiều thuốc.', 2),

(N'Ibuprofen', N'Suy thận', N'Paracetamol',
 N'Người có bệnh thận cần thận trọng với một số thuốc giảm đau kháng viêm.',
 N'Không dùng kéo dài nếu chưa có hướng dẫn của nhân viên y tế.', 1),

(N'Prednisone', N'Đái tháo đường', N'Thuốc thay thế hoặc điều chỉnh theo chỉ định',
 N'Hệ thống demo gợi ý cần cân nhắc vì thuốc có thể ảnh hưởng đến kiểm soát đường huyết.',
 N'Người bệnh cần theo dõi đường huyết và dùng thuốc theo đơn.', 2),

(N'Dexamethasone', N'Đái tháo đường', N'Thuốc thay thế hoặc điều chỉnh theo chỉ định',
 N'Hệ thống khuyến nghị cần kiểm soát rủi ro trên người bệnh đái tháo đường.',
 N'Không tự ý dùng corticoid khi chưa có chỉ định.', 2),

(N'Digoxin', N'Suy thận', N'Thuốc tim mạch thay thế theo chỉ định bác sĩ',
 N'Dữ liệu demo khuyến nghị thận trọng ở người bệnh thận.',
 N'Cần theo dõi liều dùng và triệu chứng bất thường theo hướng dẫn bác sĩ.', 1),

(N'Spironolactone', N'Suy thận', N'Thuốc lợi tiểu thay thế theo chỉ định',
 N'Hệ thống demo gợi ý cần đánh giá nguy cơ trước khi dùng thuốc lợi tiểu.',
 N'Cần xét nghiệm và theo dõi điện giải nếu bác sĩ yêu cầu.', 2),

(N'Codeine', N'Hen phế quản', N'Paracetamol',
 N'Hệ thống demo gợi ý thuốc giảm đau khác phù hợp hơn với người có bệnh hô hấp.',
 N'Cần theo dõi khó thở, ho kéo dài và tham khảo bác sĩ.', 2),

(N'Morphine', N'Hen phế quản', N'Thuốc giảm đau thay thế theo chỉ định',
 N'Hệ thống demo khuyến nghị thận trọng với người có bệnh hô hấp.',
 N'Không tự ý dùng thuốc giảm đau mạnh khi chưa có chỉ định.', 1);
GO

SELECT * FROM Recommendations;
GO