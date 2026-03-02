# Phân tích API: GET /api/writing/topics

## Tổng quan

| Thuộc tính | Giá trị |
|------------|--------|
| **Endpoint** | `GET /api/writing/topics` |
| **Controller** | `WritingController` (`api/writing`) |
| **Auth** | `[AllowAnonymous]` – không bắt buộc đăng nhập |
| **Query params** | `level` (int?), `part` (int?) |

---

## Mục đích

Cung cấp **danh sách topic** dùng cho màn hình **writing / practice**: người dùng chọn topic để bắt đầu bài viết (Task1 hoặc Task2). Chỉ trả về topic **đang active** (`IsActive = true`).

---

## Tham số

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|--------|
| `level` | int? | Không | **LevelId** (FK bảng `levels`). Ví dụ: 1=A1, 2=A2, 3=B1... Lọc topic theo level. |
| `part`  | int? | Không | **PartId** (FK bảng `parts`). Ví dụ: 1=Part 1 (Letter/Email), 2=Part 2 (Essay). Lọc topic theo part. |

**Ví dụ:**

- `GET /api/writing/topics` → tất cả topic active (cả Part 1 & 2, mọi level).
- `GET /api/writing/topics?level=3` → topic level B1 (levelId=3).
- `GET /api/writing/topics?part=1` → topic Part 1 (Task1).
- `GET /api/writing/topics?level=2&part=2` → topic Part 2, level A2.

---

## Response

- **200 OK**: body là mảng JSON các **Topic** (entity).
- Mỗi phần tử gồm: `id`, `partId`, `levelId`, `title`, `prompt`, `purpose`, `recipientRole`, `version`, `isActive`, `updatedAt` (và có thể có navigation nếu serializer cấu hình include).

**Ví dụ (rút gọn):**

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "partId": 1,
    "levelId": 2,
    "title": "Letter to a friend",
    "prompt": "You have received a letter from...",
    "purpose": "Inform",
    "recipientRole": "Friend",
    "version": 1,
    "isActive": true,
    "updatedAt": "2025-02-10T00:00:00Z"
  }
]
```

---

## Luồng xử lý (backend)

1. **WritingController.GetTopics(level, part)** nhận query `level`, `part`.
2. Gọi **ITopicRepository.GetActiveTopicsAsync(partId: part, levelId: level)**.
3. **TopicRepository**:
   - Query `Topics` với điều kiện `IsActive == true`.
   - Nếu có `part` → thêm điều kiện `PartId == part`.
   - Nếu có `level` → thêm điều kiện `LevelId == level`.
   - Sắp xếp: `PartId` → `LevelId` → `Title`.
4. Trả về danh sách topic (200 OK).

---

## So sánh với API topics khác

| Endpoint | Auth | Lọc | Mục đích |
|----------|------|-----|----------|
| **GET /api/writing/topics** | Anonymous | part, level, chỉ IsActive | Danh sách topic cho màn writing/practice |
| **GET /api/topics/by-part/{partId}** | (tùy config) | partId, không lọc IsActive | Admin/quản lý: tất cả topic theo part |

---

## Dependency

- **ITopicRepository** → **TopicRepository**
- Repository dùng **ApplicationDbContext** (bảng `topics`), entity **Topic** (Domain).

---

## Ghi chú

- Frontend có thể gọi không token (Anonymous) để hiển thị dropdown/chọn topic trước khi đăng nhập; khi **bắt đầu session** thì dùng **POST /api/writing/session/start** (cần JWT).
- `levelId` tương ứng với bảng **levels** (A1–C2); nếu chưa seed đủ level thì filter theo level có thể trả về rỗng.
- Sau khi import VSTEP (POST /api/admin/seed/vstep-questions), số topic sẽ tăng; GET /api/writing/topics sẽ trả về các topic đó nếu `IsActive = true`.
