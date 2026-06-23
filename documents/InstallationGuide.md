# HƯỚNG DẪN CÀI ĐẶT HỆ THỐNG

## 1. Giới thiệu

Tài liệu này hướng dẫn cách cài đặt và chạy hệ thống **kiểm tra chống chỉ định thuốc** trên máy cá nhân.

Hệ thống gồm các thành phần chính:

* Backend: ASP.NET Core Web API
* Database: SQL Server LocalDB
* Frontend: HTML, CSS, JavaScript
* API Testing: Swagger
* Source Control: GitHub

---

## 2. Yêu cầu môi trường

Máy tính cần cài đặt các phần mềm sau:

* Windows 10 hoặc Windows 11
* Git
* Visual Studio Code hoặc Visual Studio 2022
* .NET SDK 9.0
* SQL Server LocalDB
* Trình duyệt Chrome hoặc Microsoft Edge
* Extension Live Server nếu chạy frontend bằng VS Code

Kiểm tra .NET SDK:

```powershell
dotnet --list-sdks
```

Nếu hiển thị dạng:

```text
9.0.xxx [C:\Program Files\dotnet\sdk]
```

thì máy đã cài đúng .NET SDK 9.0.

---

## 3. Clone source code

Mở PowerShell tại thư mục muốn lưu project, sau đó chạy:

```powershell
git clone https://github.com/nguyenvany9a2-alt/DoAnCNPM_Snake.git
cd DoAnCNPM_Snake
```

Nếu thành viên làm việc bằng fork riêng, sau khi clone cần thêm upstream:

```powershell
git remote add upstream https://github.com/nguyenvany9a2-alt/DoAnCNPM_Snake.git
git fetch upstream
```

---

## 4. Cài đặt Backend

Di chuyển vào thư mục backend:

```powershell
cd backend\DrugContraindicationAPI
```

Khôi phục package:

```powershell
dotnet restore
```

Build project:

```powershell
dotnet build
```

Nếu thành công, terminal sẽ hiển thị:

```text
Build succeeded
```

---

## 5. Tạo Database

Chạy migration để tạo database:

```powershell
dotnet ef database update
```

Database được tạo trong SQL Server LocalDB với tên:

```text
DrugContraindicationDB
```

---

## 6. Import dữ liệu mẫu

Quay lại thư mục gốc project:

```powershell
cd ..\..
```

Chạy file dữ liệu mẫu:

```powershell
sqlcmd -S "(localdb)\MSSQLLocalDB" -d DrugContraindicationDB -i ".\database\seed_sv1_backend.sql" -f 65001
```

Sau khi import dữ liệu, có thể kiểm tra trong SQL Server bằng các câu lệnh:

```sql
SELECT * FROM Drugs;
SELECT * FROM Diseases;
SELECT * FROM Contraindications;
SELECT * FROM Interactions;
```

---

## 7. Chạy Backend

Di chuyển vào thư mục backend:

```powershell
cd backend\DrugContraindicationAPI
```

Chạy project:

```powershell
dotnet run
```

Mở trình duyệt và truy cập Swagger:

```text
http://localhost:5210/swagger
```

Nếu port không phải `5210`, xem dòng terminal:

```text
Now listening on: http://localhost:xxxx
```

và mở đúng port đó.

---

## 8. Chạy Frontend

Mở project bằng Visual Studio Code.

Cài extension:

```text
Live Server
```

Mở file:

```text
frontend/index.html
```

Nhấn chuột phải và chọn:

```text
Open with Live Server
```

---

## 9. Kiểm tra sau khi cài đặt

Sau khi chạy backend và frontend, kiểm tra các chức năng:

* Đăng ký tài khoản
* Đăng nhập hệ thống
* Xem danh sách thuốc
* Xem danh sách bệnh nền
* Kiểm tra chống chỉ định thuốc
* Kiểm tra tương tác thuốc
* Xem kết quả cảnh báo
* Xem lịch sử tra cứu

---

## 10. Một số lỗi thường gặp

### Lỗi thiếu .NET SDK

Nếu terminal báo:

```text
No .NET SDKs were found
```

cần cài đặt .NET SDK 9.0.

### Lỗi thiếu .NET Runtime 9

Nếu terminal báo:

```text
Microsoft.NETCore.App 9.0.0
```

cần cài .NET SDK 9.0 hoặc .NET Runtime 9.0.

### Lỗi không kết nối được Database

Kiểm tra file:

```text
backend/DrugContraindicationAPI/appsettings.json
```

Chuỗi kết nối mẫu:

```json
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=DrugContraindicationDB;Trusted_Connection=True;TrustServerCertificate=True;"
```

### Lỗi Swagger không mở được

Kiểm tra backend đã chạy chưa:

```powershell
dotnet run
```

Sau đó mở đúng địa chỉ Swagger mà terminal hiển thị.
