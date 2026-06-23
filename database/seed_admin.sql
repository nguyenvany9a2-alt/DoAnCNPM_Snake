USE DrugContraindicationDB;
GO

DELETE FROM Users
WHERE Role = N'Admin' AND Email <> N'admin@drugsafe.vn';

IF EXISTS (SELECT 1 FROM Users WHERE Email = N'admin@drugsafe.vn')
BEGIN
    UPDATE Users
    SET 
        FullName = N'Quản trị viên hệ thống',
        Password = N'Admin@123',
        Role = N'Admin'
    WHERE Email = N'admin@drugsafe.vn';
END
ELSE
BEGIN
    INSERT INTO Users (FullName, Email, Password, Role)
    VALUES (
        N'Quản trị viên hệ thống',
        N'admin@drugsafe.vn',
        N'Admin@123',
        N'Admin'
    );
END
GO