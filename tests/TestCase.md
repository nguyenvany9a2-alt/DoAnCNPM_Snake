# TEST CASE - Hệ thống kiểm tra chống chỉ định thuốc

| ID | Chức năng | Dữ liệu kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| TC01 | Đăng ký tài khoản | Email mới, mật khẩu hợp lệ | Đăng ký thành công | Đúng như mong đợi | Pass |
| TC02 | Đăng ký tài khoản | Email đã tồn tại | Hiển thị lỗi email đã tồn tại | Đúng như mong đợi | Pass |
| TC03 | Đăng nhập | Email và mật khẩu đúng | Đăng nhập thành công | Đúng như mong đợi | Pass |
| TC04 | Đăng nhập | Sai mật khẩu | Hiển thị lỗi đăng nhập | Đúng như mong đợi | Pass |
| TC05 | Xem danh sách thuốc | GET /api/Drug | Trả về danh sách thuốc | Đúng như mong đợi | Pass |
| TC06 | Thêm thuốc | Dữ liệu thuốc hợp lệ | Thêm thuốc thành công | Đúng như mong đợi | Pass |
| TC07 | Sửa thuốc | Cập nhật tên thuốc | Cập nhật thành công | Đúng như mong đợi | Pass |
| TC08 | Xóa thuốc | ID thuốc tồn tại | Xóa thành công | Đúng như mong đợi | Pass |
| TC09 | Xem danh sách bệnh | GET /api/Disease | Trả về danh sách bệnh nền | Đúng như mong đợi | Pass |
| TC10 | Thêm bệnh nền | Dữ liệu hợp lệ | Thêm bệnh thành công | Đúng như mong đợi | Pass |
| TC11 | Kiểm tra chống chỉ định | Aspirin + Viêm loét dạ dày | Có cảnh báo nguy hiểm | Đúng như mong đợi | Pass |
| TC12 | Kiểm tra chống chỉ định | Paracetamol + Tăng huyết áp | Không có cảnh báo | Đúng như mong đợi | Pass |
| TC13 | Kiểm tra tương tác thuốc | Warfarin + Aspirin | Có cảnh báo tương tác | Đúng như mong đợi | Pass |
| TC14 | Kiểm tra tương tác thuốc | Paracetamol + Ibuprofen | Không có tương tác nghiêm trọng | Đúng như mong đợi | Pass |
| TC15 | Lưu lịch sử | UserId hợp lệ | Lưu lịch sử thành công | Đúng như mong đợi | Pass |
| TC16 | Xem lịch sử | UserId tồn tại | Hiển thị lịch sử tra cứu | Đúng như mong đợi | Pass |
| TC17 | Xóa lịch sử | ID lịch sử tồn tại | Xóa thành công | Đúng như mong đợi | Pass |
| TC18 | Validate Frontend | Không nhập thuốc | Hiển thị lỗi bắt buộc nhập thuốc | Đúng như mong đợi | Pass |
| TC19 | Responsive | Mở trên màn hình nhỏ | Giao diện không vỡ layout | Đúng như mong đợi | Pass |
| TC20 | Deploy | Truy cập hệ thống sau deploy | Hệ thống hoạt động bình thường | Đúng như mong đợi | Pass |