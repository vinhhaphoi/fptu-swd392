# Hướng dẫn test API – VSTEP Writing System

## 1. Chạy Backend

```bash
cd Backend/src/API
dotnet run
```

Hoặc mở solution trong Visual Studio / Rider và chạy project **API** (F5).

- **HTTP:** http://localhost:5268  
- **HTTPS:** https://localhost:7061  
- **Swagger UI:** http://localhost:5268/swagger hoặc https://localhost:7061/swagger  

---

## 2. Flow test API (tự động)

Chạy **tuần tự** các bước: Health → Login → Profile → Levels → Admin. Dùng script hoặc Postman Collection.

### 2.1 PowerShell script (Windows)

Đảm bảo Backend đang chạy, rồi trong thư mục `Backend`:

```powershell
cd Backend
.\scripts\Test-ApiFlow.ps1
```

**Tham số tùy chọn:**

| Tham số       | Mặc định              | Mô tả |
|---------------|------------------------|--------|
| `-BaseUrl`    | http://localhost:5268  | URL API |
| `-UseHttps`   | -                      | Dùng https://localhost:7061 |
| `-Username`   | admin                  | User đăng nhập |
| `-Password`   | password               | Mật khẩu |
| `-SkipAdminTest` | -                   | Bỏ qua bước GET /api/admin/users |

Ví dụ:

```powershell
.\scripts\Test-ApiFlow.ps1 -BaseUrl "https://localhost:7061" -UseHttps
.\scripts\Test-ApiFlow.ps1 -Username user -Password password -SkipAdminTest
```

Script in **Pass/Fail** từng bước và tổng kết. Exit code 1 nếu có bước fail.

### 2.2 Postman Collection

1. Mở Postman → **Import** → chọn file `Backend/scripts/VSTEP_Api_Flow.postman_collection.json`.
2. Collection **VSTEP Writing API - Test Flow** xuất hiện với các request đúng thứ tự.
3. (Tùy chọn) Sửa biến: **Collection** → **Variables**: `baseUrl`, `username`, `password`.
4. Bấm **Run collection** (Run) → chọn collection → **Run VSTEP Writing API...**.
5. Request **Login** có script lưu `token` vào biến; các request sau tự dùng `Authorization: Bearer {{token}}`.

Thứ tự chạy: **1. Health** (Ping, Health DB) → **2. Auth** (Login, Validate) → **3. Protected** (Profile, Levels) → **4. Admin only** (Get all users, Get user count).

---

## 3. Test bằng Swagger

1. Mở trình duyệt: **http://localhost:5268/swagger** (hoặc https nếu chạy HTTPS).
2. Các endpoint được nhóm theo controller; bấm **Try it out** → điền tham số → **Execute**.

### Gửi kèm JWT (endpoint cần đăng nhập)

1. Gọi **POST /api/auth/login** với body:
   ```json
   {
     "username": "admin",
     "password": "password"
   }
   ```
2. Copy giá trị `token` trong response.
3. Bấm nút **Authorize** (khóa ở góc trên Swagger).
4. Nhập: `Bearer <dán_token_vào_đây>` (có chữ Bearer và dấu cách).
5. Bấm **Authorize** → **Close**. Các request sau sẽ tự gửi kèm token.

---

## 4. Test bằng curl

### Health / không cần đăng nhập

```bash
# Ping API
curl -s http://localhost:5268/api/ping

# Kiểm tra DB
curl -s http://localhost:5268/api/health/db

# Tham chiếu (levels...)
curl -s http://localhost:5268/api/health/refdata
```

### Đăng nhập và lấy token

```bash
curl -s -X POST http://localhost:5268/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"password\"}"
```

Lưu giá trị `token` trong response để dùng cho các lệnh sau (thay `YOUR_JWT_TOKEN`).

### Đăng ký (nếu chưa có user)

```bash
curl -s -X POST http://localhost:5268/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Password123!\",\"phoneNumber\":\"0901234567\"}"
```

### Gọi endpoint cần JWT

```bash
# Thay YOUR_JWT_TOKEN bằng token nhận được từ /api/auth/login
export TOKEN="YOUR_JWT_TOKEN"

# Profile (User)
curl -s http://localhost:5268/api/users/profile -H "Authorization: Bearer $TOKEN"

# Danh sách levels
curl -s http://localhost:5268/api/levels -H "Authorization: Bearer $TOKEN"

# Chỉ Admin: danh sách user
curl -s http://localhost:5268/api/admin/users -H "Authorization: Bearer $TOKEN"
```

---

## 5. Test bằng Postman (hoặc Insomnia)

### Cấu hình

- **Base URL:** `http://localhost:5268` (hoặc `https://localhost:7061` nếu dùng HTTPS).

### Luồng test nhanh

1. **POST** `{{baseUrl}}/api/auth/login`  
   - Body → raw → JSON:
   ```json
   {
     "username": "admin",
     "password": "password"
   }
   ```
   - Send → copy `token` từ response.

2. **Cấu hình token cho toàn bộ request:**
   - Vào **Authorization** (tab của request hoặc Collection).
   - Type: **Bearer Token**.
   - Token: dán token vừa copy.

3. Gọi các endpoint khác, ví dụ:
   - **GET** `{{baseUrl}}/api/levels`
   - **GET** `{{baseUrl}}/api/users/profile`
   - **GET** `{{baseUrl}}/api/admin/users` (chỉ Admin)

### Một số endpoint theo nhóm

| Nhóm        | Method | URL (relative)           | Ghi chú              |
|------------|--------|---------------------------|----------------------|
| Health     | GET    | /api/ping                 | Không cần token      |
| Health     | GET    | /api/health/db            | Không cần token      |
| Auth       | POST   | /api/auth/login           | Body: username, password |
| Auth       | POST   | /api/auth/register        | Body: username, name, email, password, phoneNumber? |
| Auth       | POST   | /api/auth/validate        | Header: Bearer token |
| Users      | GET    | /api/users/profile        | Cần token            |
| Users      | PUT    | /api/users/profile        | Cần token            |
| Levels     | GET    | /api/levels               | Cần token            |
| Admin      | GET    | /api/admin/users          | Chỉ Admin            |
| Admin      | GET    | /api/admin/users/count    | Chỉ Admin            |
| Topics     | GET    | /api/topics/by-part/{partId} | Cần token        |
| Writing    | GET    | /api/writing/topics       | Cần token            |
| Practice   | GET    | /api/practice-sessions/my | Cần token            |

---

## 6. User test sau khi chạy Supabase script

Sau khi chạy `Supabase_Database_Setup.sql`, có sẵn:

| Username | Password  | Role  |
|----------|-----------|-------|
| admin    | password  | Admin |
| user     | password  | User  |

Dùng để test **POST /api/auth/login** và các endpoint theo role (user vs admin).

---

## 7. Lỗi thường gặp

- **401 Unauthorized:** Chưa gửi token hoặc token hết hạn. Đăng nhập lại và cập nhật header `Authorization: Bearer <token>`.
- **403 Forbidden:** User không đủ quyền (ví dụ gọi `/api/admin/users` bằng tài khoản User).
- **500 / 503:** Kiểm tra database đã chạy và connection string trong `appsettings.json` / `appsettings.Development.json`; test qua **GET /api/health/db**.

Nếu dùng HTTPS (https://localhost:7061), thay `http://localhost:5268` bằng `https://localhost:7061` trong các ví dụ trên.
