# Kế hoạch: Upload tài liệu → Trích xuất dữ liệu thô → Chuẩn hóa cấu trúc → Tạo bộ đề mới

## Tổng quan

Luồng hoàn chỉnh cho tính năng tạo bộ đề từ tài liệu tải lên:

```
[Tải lên file] → [AI trích xuất dữ liệu thô] → [Map về form chuẩn] → [Lưu thành bộ đề mới]
```

---

## Hiện trạng (Đã có)

| Thành phần | Trạng thái | Vị trí |
|------------|------------|--------|
| Upload tài liệu | ✅ Đã có | `Frontend/src/app/admin/questions/page.tsx` |
| Trích xuất dữ liệu thô (Gemini) | ✅ Đã có | `Frontend/src/lib/gemini.ts` |
| Hiển thị raw output | ✅ Đã có | Admin questions page |
| Lưu bộ đề bài tập | ❌ Chưa có (chỉ simulate) | `handleSaveQuestions` |

**Định dạng raw hiện tại từ Gemini:**
- `content`, `type` (mcq/essay), `options`, `correctAnswer`, `partNumber`

**Định dạng chuẩn cần lưu (Firestore):**
- **Test:** `id`, `title`, `level`, `skill`, `duration`, `totalQuestions`, `description`, `createdAt`
- **Question:** `id`, `testId`, `type`, `content`, `options`, `correctAnswer`, `order`, `passage`, `audioUrl`, `imageUrl`

---

## Giai đoạn 1: Chuẩn hóa dữ liệu (Data mapping)

### 1.1 Mở rộng schema Gemini

**File:** `Frontend/src/lib/gemini.ts`

- Thêm field `passage` (đoạn văn đọc / nghe) vào schema nếu tài liệu có passage + questions
- Thêm field `order` hoặc dựa vào thứ tự trong mảng
- Cập nhật prompt: yêu cầu AI trả về thêm thông tin (level gợi ý, skill, passage nếu có)

```typescript
// Schema bổ sung
passage: { type: SchemaType.STRING, description: "Reading/listening passage if applicable", nullable: true }
order: { type: SchemaType.NUMBER, description: "Question order in the test", nullable: true }
```

### 1.2 Type và mapper

**File mới:** `Frontend/src/lib/documentParser.ts`

```typescript
// RawQuestion: output từ Gemini
export interface RawQuestion {
  content: string;
  type: "mcq" | "essay";
  options?: string[];
  correctAnswer?: string;
  partNumber?: number;
  passage?: string;
  order?: number;
}

// mapRawToStructured: RawQuestion[] + metadata → { test: Test, questions: Question[] }
export function mapRawToStructured(
  raw: RawQuestion[],
  meta: { title: string; level: Level; skill: SkillType; duration?: number }
): { test: Omit<Test, "id">; questions: Omit<Question, "id" | "testId">[] }
```

- Gán `order` nếu thiếu (1, 2, 3, …)
- Map `type` raw → `type` chuẩn (mcq, essay, recording nếu sau này mở rộng)
- Validate các field bắt buộc (content, type)

---

## Giai đoạn 2: Form cấu hình bộ đề

### 2.1 UI cấu hình metadata

**File:** `Frontend/src/app/admin/questions/page.tsx`

Trước/bên cạnh bước Import, thêm form:

| Field | Mô tả | Default |
|-------|--------|---------|
| Tiêu đề bộ đề | `title` | `"Bộ đề từ [tên file]"` |
| Level | `level` (B1/B2/C1) | B2 |
| Kỹ năng | `skill` (listening/reading/writing/speaking) | reading |
| Thời gian (phút) | `duration` | Theo SKILLS_DATA |
| Mô tả | `description` | optional |

### 2.2 Luồng UI cải tiến

1. User upload file → detect (như hiện tại)
2. Hiển thị raw questions + form cấu hình metadata
3. User có thể sửa từng câu (content, options, correctAnswer)
4. Nút "Xem trước cấu trúc" → hiển thị Test + Questions sẽ lưu
5. Nút "Tạo bộ đề" → gọi lưu thật

---

## Giai đoạn 3: Lưu và tạo bộ đề mới

### 3.1 Lưu qua Firestore (hiện tại)

**File:** `Frontend/src/lib/firestore.ts`

Thêm hàm:

```typescript
export async function createTestWithQuestions(
  test: Omit<Test, "id">,
  questions: Omit<Question, "id" | "testId">[]
): Promise<{ testId: string; questionIds: string[] }>
```

- Tạo doc trong `tests` → lấy `testId`
- Tạo các doc trong `questions` với `testId`, `order`
- Trả về `testId` và danh sách `questionIds`

### 3.2 Kết nối với Admin page

**File:** `Frontend/src/app/admin/questions/page.tsx`

- Thay thế `handleSaveQuestions` giả lập bằng `createTestWithQuestions`
- Truyền vào metadata từ form + `mapRawToStructured(rawQuestions, meta)`
- Redirect về trang xem bộ đề sau khi lưu thành công
- Thông báo lỗi nếu API/Firestore lỗi

---

## Giai đoạn 4 (Tuỳ chọn): Backend API cho bộ đề

Nếu muốn quản lý bộ đề qua Backend (.NET) thay vì chỉ Firestore:

### 4.1 Domain & DB

- **Entity:** `ExamSet` (hoặc `Test`) – id, title, level, skill, duration, totalQuestions, createdAt, createdBy
- **Entity:** `ExamQuestion` – id, examSetId, type, content, options (JSON), correctAnswer, order, passage
- Migration + Configuration EF Core

### 4.2 API

- `POST /api/exam-sets` – tạo bộ đề + câu hỏi
- `GET /api/exam-sets` – danh sách bộ đề (filter level, skill)
- `GET /api/exam-sets/{id}` – chi tiết bộ đề + câu hỏi

### 4.3 Frontend

- Admin page gọi `POST /api/exam-sets` thay vì Firestore
- Cần phân quyền Admin cho endpoint

---

## Thứ tự triển khai đề xuất

| # | Task | Ước lượng | Phụ thuộc |
|---|------|-----------|-----------|
| 1 | Tạo `documentParser.ts` + `mapRawToStructured` | 0.5 ngày | - |
| 2 | Thêm form metadata (title, level, skill, duration) vào admin page | 0.5 ngày | 1 |
| 3 | `createTestWithQuestions` trong firestore.ts | 0.5 ngày | - |
| 4 | Gắn handleSaveQuestions với Firestore thật | 0.5 ngày | 1, 2, 3 |
| 5 | Cải thiện schema + prompt Gemini (passage, order) | 0.5 ngày | - |
| 6 | Cho phép sửa câu hỏi trước khi lưu | 0.5 ngày | 2 |
| 7 | Xem trước cấu trúc trước khi tạo bộ đề | 0.5 ngày | 1, 2 |
| 8 | Redirect + thông báo sau khi tạo thành công | 0.25 ngày | 4 |

**Tổng (core):** ~3–4 ngày  
**Backend API (tuỳ chọn):** thêm ~2–3 ngày

---

## Rủi ro và lưu ý

1. **Gemini output không ổn định** – Cần retry và validate JSON; có thể fallback khi parse lỗi
2. **File lớn / nhiều trang** – Cân nhắc chunk/limit để tránh quá tải API
3. **Định dạng tài liệu** – PDF/DOC có thể khó parse chính xác; cần test với nhiều mẫu thật
4. **Phân quyền** – Chỉ Admin mới nên dùng tính năng upload tạo bộ đề
