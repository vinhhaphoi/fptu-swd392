# Kế hoạch: Sửa lỗi Profile + Cấu hình Firestore cho Bộ Đề

## Mô hình Auth của dự án

- **Auth bằng Backend (JWT)**: Đăng nhập/đăng ký qua API Backend (.NET), token lưu localStorage.
- **Tài khoản lưu trong bảng profile**: Thông tin user (name, email, targetLevel, ...) nằm ở Backend — bảng `user_profiles` (hoặc tương đương), không dùng Firebase Auth.
- **Firebase**: Chỉ dùng cho Firestore (lưu tests, questions, examSets, ...) và có thể Storage. **Không dùng** Firebase Authentication.

---

## Phần 1 — Sửa lỗi build profile/page.tsx

### Nguyên nhân

- **UserProfile** (từ `@/lib/auth.ts`) có các field:
  - `name` (không có `displayName`)
  - `targetLevelName` / `targetLevelId` (không có `targetLevel`)

- **Profile page** đang dùng:
  - `userData.displayName` → **sai**, cần dùng `userData.name`
  - `userData.targetLevel` → **sai**, cần dùng `userData.targetLevelName`

### Cách sửa

**Option A — Sửa profile page (khuyến nghị)**

| Vị trí | Hiện tại | Sửa thành |
|--------|----------|-----------|
| Line 41 | `userData.displayName` | `userData.name` |
| Line 42 | `userData.targetLevel` | `userData.targetLevelName` |
| Line 143 | `userData?.targetLevel` | `userData?.targetLevelName` |
| Line 206, 218 | `userData?.displayName` | `userData?.name` |

**Option B — Mở rộng UserProfile**

Thêm vào `auth.ts`:

```typescript
// Trong UserProfile hoặc tạo type alias
displayName?: string;  // alias của name
targetLevel?: "B1" | "B2" "C1";  // alias của targetLevelName
```

Sau đó map khi fetch profile (trong useAuth hoặc auth.ts) để gán `displayName = name`, `targetLevel = targetLevelName`.

### Thứ tự thực hiện

1. Sửa `profile/page.tsx` theo Option A (4–5 chỗ).
2. Chạy `npm run build` để xác nhận build thành công.

---

## Phần 2 — Cấu hình Firestore để lưu Bộ Đề

### Hiện trạng

- **Auth**: Bằng Backend (JWT), tài khoản lưu bảng profile trên Backend. **Không dùng** Firebase Auth → `request.auth` trong Firestore luôn `null`.
- **Firebase config** đã có trong `.env.local`:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`, `PROJECT_ID`, `AUTH_DOMAIN`, ...
  - Project: `vinhhaphoi-swd392`

- **Firestore** đã được init trong `src/lib/firestore.ts` / `firebase.ts`:
  - `db = getFirestore(app)` — chỉ dùng để đọc/ghi dữ liệu (tests, questions, examSets).

- **Collection mới**: `examSets` (dùng bởi `createExamSet`, `getExamSets`, ...)

### Việc cần làm

#### 1. Bật Firestore Database (nếu chưa)

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project `vinhhaphoi-swd392`
3. **Build** → **Firestore Database** → **Create database**
4. Chọn chế độ:
   - **Production**: bắt đầu ở chế độ locked (cần rules)
   - **Test**: mở trong 30 ngày (dễ test)
5. Chọn region (ví dụ: `asia-southeast1`)

#### 2. Cấu hình Firestore Security Rules

**Vì Auth bằng Backend, không dùng Firebase Auth** → `request.auth` luôn `null`. Cần mở quyền đọc/ghi cho `examSets` (hoặc bảo vệ qua Backend API sau).

Vào **Firestore** → **Rules**, cập nhật:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bộ đề — Auth bằng Backend nên không dùng request.auth; mở đọc/ghi cho client
    match /examSets/{examSetId} {
      allow read, write: if true;
    }
    
    // Các collection khác (tests, questions, testResults, progress)
    // Giữ nguyên rules hiện có nếu đã có
  }
}
```

**Bảo mật sau này**: Có thể chuyển tạo/sửa/xóa bộ đề sang Backend API (Backend ghi Firestore bằng Firebase Admin SDK, hoặc lưu bộ đề vào PostgreSQL). Khi đó Frontend chỉ gọi API, không ghi Firestore trực tiếp.

#### 3. Kiểm tra Index (nếu có query phức tạp)

Với `getExamSets` filter theo `level`, `skill`, `status`:

- Firestore thường tự tạo composite index khi chạy query lần đầu.
- Nếu có lỗi thiếu index, dùng link trong thông báo lỗi để tạo index trong Console.

#### 4. Cấu trúc document `examSets`

Mỗi document có dạng:

```json
{
  "title": "string",
  "level": "B1" | "B2" | "C1",
  "skill": "listening" | "reading" | "writing" | "speaking",
  "duration": number,
  "description": "string?",
  "questions": [...],
  "totalQuestions": number,
  "totalPoints": number,
  "sourceFileName": "string?",
  "status": "draft" | "published",
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "createdBy": "string?"
}
```

Firestore tự tạo document ID khi dùng `addDoc()`.

#### 5. Auth Backend + Firestore

- **Auth bằng Backend, tài khoản trong bảng profile** → Firestore chỉ dùng để lưu dữ liệu ứng dụng (tests, examSets, ...).
- `request.auth` trong Firestore Rules luôn `null` → dùng `allow read, write: if true` cho `examSets` (hoặc bảo vệ bằng Backend API nếu cần).

---

## Checklist

**Profile fix**

- [ ] Sửa `userData.displayName` → `userData.name` trong profile/page.tsx
- [ ] Sửa `userData.targetLevel` → `userData.targetLevelName` trong profile/page.tsx
- [ ] Chạy `npm run build` thành công

**Firestore**

- [ ] Tạo Firestore Database trong Firebase Console (nếu chưa có)
- [ ] Cập nhật Security Rules cho collection `examSets`
- [ ] Test tạo bộ đề từ Admin → Kiểm tra document trong Firestore Console
- [ ] (Tùy chọn) Tạo index nếu có lỗi thiếu index
