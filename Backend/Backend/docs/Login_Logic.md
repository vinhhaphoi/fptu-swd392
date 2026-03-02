# Login logic – Luồng đăng nhập

## Endpoint

- **POST** `/api/auth/login`
- **Body (JSON):** `{ "username": "...", "password": "..." }`
- Trường `username` có thể là **username** hoặc **email** (cùng một ô input).

---

## Luồng xử lý (từ request → response)

```
Client (POST /api/auth/login)
    → AuthController.Login([FromBody] LoginRequest)
        → AuthService.LoginAsync(request)
            → UserRepository: tìm user (username HOẶC email)
            → PasswordHasher: verify password với BCrypt
            → JwtService: tạo JWT
        ← AuthResponse (Token, UserId, Username, Email, Role, ExpiresAt)
    ← 200 OK + JSON
```

---

## Chi tiết từng bước

### 1. Controller – `AuthController.Login`

- Nhận body: **LoginRequest** (`Username`, `Password`).
- Gọi `_authService.LoginAsync(request)`.
- **Nếu thành công:** trả về `200 OK` + **AuthResponse** (Token, UserId, Username, Email, Role, ExpiresAt).
- **Nếu `UnauthorizedAccessException`:** trả về `401 Unauthorized` với `{ message: "Invalid username or password" }` (hoặc "Account is deactivated").
- **Lỗi khác:** trả về `400 BadRequest` với message chung.

---

### 2. Service – `AuthService.LoginAsync`

Thứ tự kiểm tra:

| Bước | Hành động | Lỗi nếu fail |
|------|-----------|-------------------------------|
| 1 | Tìm user: `GetByUsernameAsync(request.Username)` → nếu null thì `GetByEmailAsync(request.Username)` | User không tồn tại → **UnauthorizedAccessException** "Invalid username or password" |
| 2 | Kiểm tra `user.PasswordHash` không null/rỗng | → **UnauthorizedAccessException** "Invalid username or password" |
| 3 | **Verify mật khẩu:** `_passwordHasher.Verify(request.Password, user.PasswordHash)` (BCrypt) | Sai mật khẩu → **UnauthorizedAccessException** "Invalid username or password" |
| 4 | Kiểm tra `user.IsActive == true` | Tài khoản bị khóa → **UnauthorizedAccessException** "Account is deactivated" |
| 5 | Tạo JWT: `_jwtService.GenerateToken(user.Id, user.Username, user.Email, user.Role.ToString())` | — |
| 6 | Trả về **AuthResponse**: Token, UserId, Username, Email, Role, ExpiresAt | — |

**Lưu ý:** Trường gửi lên là `username` nhưng backend chấp nhận **cả username và email** (cùng lookup): tìm theo username trước, không có thì tìm theo email.

---

### 3. Repository – tìm user

- **UserRepository.GetByUsernameAsync(loginField):** query bảng `users` với `Username == loginField`.
- **UserRepository.GetByEmailAsync(loginField):** query bảng `users` với `Email == loginField`.
- Dữ liệu đọc từ bảng **`users`** (EF: `_context.Users`).

---

### 4. Xác thực mật khẩu – `PasswordHasher` (BCrypt)

- **Verify(plainPassword, storedHash):** `BCrypt.Net.BCrypt.Verify(password, hash)`.
- Hash trong DB là BCrypt (work factor 12), lưu ở cột `users.password_hash`.

---

### 5. Tạo JWT – `JwtService.GenerateToken`

- **Claims:** `NameIdentifier` (UserId), `Name` (Username), `Email`, `Role`.
- **Cấu hình:** `Jwt:SecretKey`, `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpirationMinutes` (mặc định 60).
- Ký bằng **HMAC-SHA256** với SecretKey.
- Trả về chuỗi JWT; client gửi kèm header: `Authorization: Bearer <token>`.

---

## DTO

**LoginRequest**

```csharp
public string Username { get; set; }  // Có thể là username hoặc email
public string Password { get; set; }
```

**AuthResponse**

```csharp
public string Token { get; set; }     // JWT
public Guid UserId { get; set; }
public string Username { get; set; }
public string Email { get; set; }
public string Role { get; set; }      // Guest | User | Manager | Admin
public DateTime ExpiresAt { get; set; }
```

---

## Bảng / dữ liệu dùng khi login

- Chỉ đọc bảng **`users`** (id, username, email, password_hash, role, is_active).
- Không đọc `user_profiles` trong bước login; profile dùng cho API GET/PUT profile sau khi đã có token.

---

## Tóm tắt

1. Client gửi **username** (hoặc email) + **password**.
2. Backend tìm user theo **username** rồi theo **email** nếu chưa có.
3. Kiểm tra **password** bằng BCrypt so với `users.password_hash`.
4. Kiểm tra **is_active**; nếu inactive → 401.
5. Tạo **JWT** (userId, username, email, role) và trả về **AuthResponse**.
6. Mọi lỗi xác thực đều trả **401** với message "Invalid username or password" (trừ "Account is deactivated") để không lộ thông tin user có tồn tại hay không.
