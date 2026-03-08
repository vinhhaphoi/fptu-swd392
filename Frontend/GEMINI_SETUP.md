# Tích hợp Google Gemini AI

Dự án đã dùng **@google/generative-ai** và module `src/lib/gemini.ts` để gọi Gemini từ frontend.

## 1. Lấy API key

1. Vào [Google AI Studio](https://aistudio.google.com/apikey).
2. Đăng nhập bằng tài khoản Google.
3. Chọn **Create API key** (có thể chọn project hoặc tạo mới).
4. Copy key (dạng `AIza...`).

## 2. Cấu hình trong project

- Tạo hoặc mở file **`.env.local`** ở thư mục gốc Frontend.
- Thêm dòng (thay `YOUR_GEMINI_API_KEY` bằng key vừa lấy):

```env
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

- Khởi động lại dev server (`npm run dev`) sau khi sửa env.

Có thể tham khảo **`.env.example`** để biết các biến môi trường khác.

## 3. Bảo mật

- **NEXT_PUBLIC_** nghĩa là biến này được gửi xuống trình duyệt. API key Gemini sẽ lộ ở client.
- Cách an toàn hơn: tạo **API Route** (Next.js) hoặc backend riêng, gọi Gemini trên server và chỉ gửi prompt/response qua API của bạn; khi đó dùng biến **không** có tiền tố `NEXT_PUBLIC_` để lưu key.
- Trong Google Cloud Console có thể giới hạn key theo HTTP referrer (website của bạn) để giảm rủi ro.

## 4. Cách dùng trong code

### Kiểm tra đã cấu hình

```ts
import { isGeminiConfigured } from "@/lib/gemini";

if (!isGeminiConfigured()) {
  // Hiển thị thông báo hoặc ẩn tính năng AI
}
```

### Generate text (chat, gợi ý, giải thích)

```ts
import { generateText } from "@/lib/gemini";

const answer = await generateText("Giải thích ngắn thì hiện tại đơn.");
// Có thể truyền systemInstruction để set vai trò AI
const feedback = await generateText("Chấm giúp đoạn văn sau: ...", {
  systemInstruction: "Bạn là giáo viên chấm bài VSTEP. Trả lời ngắn gọn, rõ ràng.",
});
```

### Gửi text + file (ảnh/PDF)

```ts
import { generateFromTextAndFile } from "@/lib/gemini";

const description = await generateFromTextAndFile(
  "Mô tả ngắn nội dung tài liệu này.",
  file
);
```

### Trích xuất câu hỏi từ file (đã dùng ở Admin → Questions)

```ts
import { detectQuestions } from "@/lib/gemini";

const questions = await detectQuestions(file); // PDF, Word, ảnh...
// questions: { content, type, options?, correctAnswer?, partNumber? }[]
```

## 5. Model

Mặc định dùng **gemini-2.0-flash**. Có thể đổi model qua tham số `model` trong các hàm (ví dụ `gemini-1.5-pro`).

---

Tóm lại: thêm `NEXT_PUBLIC_GEMINI_API_KEY` vào `.env.local` là có thể dùng Gemini; muốn bảo mật hơn thì gọi Gemini qua API/server thay vì từ client.
