# Sửa lỗi: Firestore "Missing or insufficient permissions"

## Lỗi

```
FirebaseError: [code=permission-denied]: Missing or insufficient permissions.
```

Xuất hiện khi app dùng **onSnapshot** hoặc **getDocs/getDoc** với Firestore nhưng **Security Rules** đang chặn.

## Nguyên nhân

- Auth bằng **Backend (JWT)**, không dùng Firebase Auth → `request.auth` trong Firestore luôn **null**.
- Rules mặc định (hoặc rules dùng `request.auth != null`) sẽ **từ chối** mọi request.

## Cách sửa

### Bước 1: Mở Firebase Console

1. Vào https://console.firebase.google.com/
2. Chọn project **vinhhaphoi-swd392**
3. Menu trái: **Build** → **Firestore Database**
4. Tab **Rules**

### Bước 2: Dán Rules cho phép đọc/ghi

Copy toàn bộ nội dung file **`firestore.rules`** (trong repo) hoặc dán đoạn dưới đây vào ô Rules, rồi bấm **Publish**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /app_content/{document=**} { allow read, write: if true; }
    match /skills/{document=**} { allow read, write: if true; }
    match /tests/{document=**} { allow read, write: if true; }
    match /questions/{document=**} { allow read, write: if true; }
    match /examSets/{document=**} { allow read, write: if true; }
    match /results/{document=**} { allow read, write: if true; }
    match /user_progress/{document=**} { allow read, write: if true; }
    match /progress/{document=**} { allow read, write: if true; }
    match /users/{document=**} { allow read, write: if true; }
  }
}
```

### Bước 3: Kiểm tra lại

- Reload app (F5), mở lại trang Practice / Writing / Admin.
- Lỗi **permission-denied** sẽ hết khi Rules đã publish đúng.

## Lưu ý bảo mật

- `if true` = **mọi người** (kể cả chưa đăng nhập) đều đọc/ghi được các collection trên. Phù hợp **dev/test** và khi auth nằm ở Backend.
- Sau này nếu cần bảo vệ theo user: chuyển ghi Firestore sang **Backend** (Firebase Admin SDK), Frontend chỉ gọi API; hoặc bật Firebase Auth và dùng `request.auth.uid` trong rules.
