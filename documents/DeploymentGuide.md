# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG

## 1. Mục tiêu

Tài liệu này mô tả cách publish backend và chuẩn bị triển khai frontend cho hệ thống **kiểm tra chống chỉ định thuốc**.

Mục tiêu của việc triển khai là tạo bản chạy ổn định để phục vụ demo, kiểm thử và nghiệm thu hệ thống.

---

## 2. Thành phần triển khai

Hệ thống gồm hai phần chính:

* Backend API: ASP.NET Core Web API
* Frontend: HTML, CSS, JavaScript

Database sử dụng:

* SQL Server LocalDB
* Database: DrugContraindicationDB

---

## 3. Publish Backend

Di chuyển vào thư mục backend:

```powershell
cd backend\DrugContraindicationAPI
```

Chạy lệnh publish:

```powershell
dotnet publish -c Release -o ..\..\publish\backend
```

Sau khi publish thành công, thư mục kết quả nằm tại:

```text
publish/backend
```

Trong thư mục này sẽ có file chạy:

```text
DrugContraindicationAPI.exe
```

---

## 4. Chạy Backend sau khi Publish

Di chuyển vào thư mục publish:

```powershell
cd ..\..\publish\backend
```

Cấu hình môi trường chạy:

```powershell
$env:ASPNETCORE_ENVIRONMENT="Development"
$env:ASPNETCORE_URLS="http://localhost:8080"
```

Chạy ứng dụng:

```powershell
.\DrugContraindicationAPI.exe
```

Mở Swagger:

```text
http://localhost:8080/swagger
```

Nếu Swagger hiển thị danh sách API thì backend đã chạy thành công.

---

## 5. Kiểm tra Backend sau khi Publish

Các API cần kiểm tra:

```text
GET    /api/Drug
GET    /api/Disease
POST   /api/Auth/register
POST   /api/Auth/login
POST   /api/Check/contraindication
POST   /api/Check/interaction
POST   /api/History
GET    /api/History/user/{userId}
```

Nếu các API trả về dữ liệu đúng, backend đã được triển khai thành công.

---

## 6. Triển khai Frontend

Frontend là website tĩnh gồm HTML, CSS và JavaScript.

Thư mục frontend:

```text
frontend/
```

Các file chính:

```text
index.html
login.html
register.html
check.html
result.html
history.html
css/style.css
js/api.js
```

Có thể triển khai frontend bằng một trong các cách sau:

* Live Server trong Visual Studio Code
* GitHub Pages
* IIS
* Hosting tĩnh

---

## 7. Cấu hình API URL cho Frontend

Mở file:

```text
frontend/js/api.js
```

Nếu backend chạy bằng `dotnet run`, cấu hình:

```javascript
const API_BASE_URL = "http://localhost:5210/api";
```

Nếu backend chạy bản publish ở port `8080`, cấu hình:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

---

## 8. Quy trình kiểm tra sau triển khai

Sau khi triển khai backend và frontend, kiểm tra các bước sau:

1. Mở trang chủ hệ thống
2. Đăng ký tài khoản mới
3. Đăng nhập vào hệ thống
4. Nhập thuốc và bệnh nền
5. Kiểm tra chống chỉ định thuốc
6. Kiểm tra tương tác thuốc
7. Xem kết quả cảnh báo
8. Xem lịch sử tra cứu

---

## 9. Minh chứng triển khai

SV5 cần chuẩn bị các minh chứng sau:

* Ảnh lệnh publish backend thành công
* Ảnh Swagger chạy từ bản publish
* Ảnh frontend mở được trên trình duyệt
* Ảnh frontend gọi API backend thành công
* Ảnh Pull Request của branch `feature/sv5-testing-deploy`

---

## 10. Kết luận

Sau khi publish backend và chạy frontend thành công, hệ thống đã sẵn sàng cho quá trình demo, kiểm thử tích hợp và nghiệm thu chức năng.
