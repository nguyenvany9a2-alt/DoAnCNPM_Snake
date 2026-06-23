# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG

## 1. Giới thiệu

Hệ thống **kiểm tra chống chỉ định thuốc** hỗ trợ người dùng kiểm tra nguy cơ khi sử dụng thuốc, đặc biệt trong trường hợp người dùng có bệnh nền hoặc đang sử dụng nhiều loại thuốc cùng lúc.

Hệ thống có các chức năng chính:

* Đăng ký tài khoản
* Đăng nhập hệ thống
* Nhập thuốc và bệnh nền
* Kiểm tra chống chỉ định thuốc
* Kiểm tra tương tác thuốc
* Xem kết quả cảnh báo
* Gợi ý thuốc thay thế
* Xem lịch sử tra cứu

---

## 2. Truy cập hệ thống

Người dùng mở trang chủ:

```text
frontend/index.html
```

hoặc truy cập đường dẫn triển khai nếu hệ thống đã được đưa lên hosting.

---

## 3. Đăng ký tài khoản

Người dùng chọn chức năng:

```text
Đăng ký
```

Sau đó nhập các thông tin:

* Họ tên
* Email
* Mật khẩu
* Xác nhận mật khẩu

Sau khi nhập đầy đủ thông tin, người dùng bấm:

```text
Đăng ký
```

Nếu thông tin hợp lệ, hệ thống sẽ tạo tài khoản thành công.

---

## 4. Đăng nhập hệ thống

Người dùng chọn chức năng:

```text
Đăng nhập
```

Sau đó nhập:

* Email
* Mật khẩu

Người dùng bấm:

```text
Đăng nhập
```

Nếu tài khoản hợp lệ, hệ thống sẽ cho phép người dùng truy cập vào chức năng kiểm tra thuốc.

---

## 5. Kiểm tra chống chỉ định thuốc

Người dùng vào trang:

```text
Kiểm tra thuốc
```

Thực hiện các bước:

1. Nhập tên thuốc cần kiểm tra, ví dụ: Aspirin
2. Chọn bệnh nền, ví dụ: Viêm loét dạ dày
3. Bấm nút kiểm tra chống chỉ định

Hệ thống sẽ xử lý và trả về kết quả gồm:

* Có cảnh báo hay không
* Mức độ cảnh báo
* Nội dung cảnh báo
* Gợi ý thuốc thay thế nếu có

---

## 6. Kiểm tra tương tác thuốc

Nếu người dùng sử dụng nhiều thuốc cùng lúc, có thể nhập từ hai thuốc trở lên.

Ví dụ:

```text
Warfarin
Aspirin
```

Sau đó bấm:

```text
Kiểm tra tương tác thuốc
```

Hệ thống sẽ kiểm tra nguy cơ tương tác giữa các thuốc và hiển thị kết quả cảnh báo nếu có.

---

## 7. Xem kết quả kiểm tra

Trang kết quả hiển thị các thông tin:

* Danh sách thuốc đã nhập
* Bệnh nền đã chọn
* Loại kiểm tra
* Mức độ cảnh báo
* Nội dung cảnh báo
* Gợi ý thuốc thay thế hoặc phương án an toàn hơn

Mức độ cảnh báo gồm:

```text
Low     - Thấp
Medium  - Trung bình
High    - Cao
```

---

## 8. Xem lịch sử tra cứu

Người dùng chọn chức năng:

```text
Lịch sử
```

Hệ thống hiển thị các lần tra cứu trước đó gồm:

* Thời gian tra cứu
* Danh sách thuốc
* Kết quả kiểm tra
* Nội dung cảnh báo

---

## 9. Gợi ý thuốc thay thế

Trong trường hợp phát hiện thuốc có nguy cơ chống chỉ định hoặc tương tác, hệ thống có thể hiển thị danh sách thuốc thay thế hoặc đề xuất hướng xử lý an toàn hơn.

Ví dụ:

```text
Aspirin có nguy cơ với bệnh viêm loét dạ dày.
Gợi ý: Paracetamol.
```

---

## 10. Lưu ý sử dụng

Kết quả kiểm tra của hệ thống chỉ mang tính chất hỗ trợ tham khảo. Người dùng cần tham khảo ý kiến bác sĩ hoặc dược sĩ trước khi sử dụng thuốc, đặc biệt trong các trường hợp có bệnh nền hoặc đang sử dụng nhiều thuốc.
