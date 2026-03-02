# VSTEPQuestions.json – Cấu trúc và cách dùng

## Cấu trúc file

File là **nhiều object JSON nối nhau** (mỗi block là một object `{ "id": { ... }, ... }`). Backend tự gộp các block khi đọc.

### Task 1 (Part 1 – Letter/Email)

| Field | Kiểu | Mô tả |
|-------|------|--------|
| questionId | string | Mã câu (vd: c001, i037, inv001) |
| taskType | "task1" | |
| category | string | formal_complaint, semi_formal_apology, formal_inquiry, ... |
| title | string | Tiêu đề |
| situation | string | Tình huống |
| task | string | Nhiệm vụ viết |
| requirements | string[] | Danh sách yêu cầu |
| formalityLevel | string | formal, semi-formal, informal |
| sampleOpening, sampleClosing | string | Mẫu mở/đóng thư |
| difficulty | string | easy, medium, hard |
| tags | string[] | Thẻ |
| isActive, order | bool, int | |

### Task 2 (Part 2 – Essay)

| Field | Kiểu | Mô tả |
|-------|------|--------|
| questionId | string | Mã câu (vd: edu001) |
| taskType | "task2" | |
| category | string | agree_disagree, discuss_both, problem_solution, ... |
| title | string | Tiêu đề |
| topic | string | Câu chủ đề |
| instruction | string | Câu lệnh (Do you agree..., Discuss both views...) |
| essayType | string | agree_disagree, discuss_both, ... |
| suggestedStructure | string[] | Gợi ý cấu trúc bài |
| difficulty, tags, isActive, order | | Giống Task 1 |

## Cách import vào DB

1. Đảm bảo đã chạy script tạo bảng (vd. `Supabase_Setup_Login_Register.sql`) để có ít nhất bảng **levels** (và **profiles** nếu dùng auth).
2. Đăng nhập với tài khoản **Admin**.
3. Gọi API:
   - **POST** `/api/admin/seed/vstep-questions`
   - Header: `Authorization: Bearer <JWT_admin>`
4. Backend sẽ:
   - Đọc `Backend/JSON/VSTEPQuestions.json`
   - Tạo hoặc dùng sẵn Exam Structure "VSTEP Writing", Part 1 (Letter/Email), Part 2 (Essay)
   - Tạo PartType Task1, Task2 nếu chưa có
   - Dùng level mặc định (ưu tiên B2, không có thì level đầu tiên)
   - Tạo từng **Topic** tương ứng mỗi question (Task1 → Part 1, Task2 → Part 2)
5. Response: `{ "message": "Imported N topics from VSTEPQuestions.json.", "count": N }`

## Ánh xạ JSON → Topic

- **PartId**: task1 → Part 1, task2 → Part 2
- **LevelId**: level mặc định (B2 hoặc level đầu tiên)
- **Title**: `title` (cắt bớt nếu > 255 ký tự)
- **Prompt**: Task1 = Situation + Task + Requirements; Task2 = Topic + Instruction + Suggested structure
- **Purpose**: category hoặc essayType
- **RecipientRole**: formalityLevel (Task1) hoặc essayType (Task2)
- **IsActive**: `isActive` trong JSON
