# Hướng dẫn setup Supabase Database cho VSTEP Writing

Script SQL tạo toàn bộ bảng và dữ liệu seed cho dự án, khớp với Domain entities và Fluent API trong Backend.

## File script

- **`Supabase_Database_Setup.sql`** – Script chính (tạo bảng + seed).

## Cách chạy

### 1. Trong Supabase Dashboard

1. Đăng nhập [Supabase](https://supabase.com) → chọn project (ví dụ `sezirrmmsvrafzzxpfcm`).
2. Vào **SQL Editor** (Database → SQL Editor).
3. Tạo query mới, dán toàn bộ nội dung file `Supabase_Database_Setup.sql`.
4. Bấm **Run** (hoặc Ctrl+Enter).

### 2. Bằng psql (nếu có connection string)

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" -f Supabase_Database_Setup.sql
```

Thay `[PASSWORD]` và `[PROJECT_REF]` bằng thông tin từ Supabase (Settings → Database).

## Nội dung script

- **Bảng auth / user:** `levels`, `users`, `user_profiles`, `password_reset_tokens`
- **Bảng cấu trúc bài thi:** `exam_structures`, `part_types`, `parts`, `topics`
- **Từ vựng / gợi ý:** `vocabulary_sets`, `topic_vocabulary_sets`, `vocabulary_items`, `sentence_structures`, `sample_types`, `sample_texts`, `hint_types`, `hints`
- **Prompt / hệ thống:** `prompt_purposes`, `system_prompts`
- **Luyện tập / nộp bài:** `practice_modes`, `exam_attempts`, `practice_sessions`, `writing_submissions`
- **Chấm điểm / phản hồi:** `rubrics`, `scoring_criteria`, `submission_scores`, `criteria_scores`, `language_checks`, `ai_feedbacks`
- **Tiến độ / thống kê:** `user_topic_progress`, `user_error_statistics`

## Seed sau khi chạy

- **Levels:** A1–C2  
- **Part types:** Task1 (Letter/Email), Task2 (Essay)  
- **Practice modes:** Topic, Part, MockExam  
- **Exam structure:** "VSTEP Writing" với 2 parts  
- **User test:** `admin` / `user` (mật khẩu: `password`)

## Sau khi setup

- Backend dùng bảng **`users`** (không dùng Supabase Auth); JWT + role (Guest, User, Manager, Admin).
- Connection string trong `appsettings.json` trỏ tới Supabase (Pooler hoặc Direct).
- Có thể gọi **POST /api/admin/seed/vstep-questions** để import câu hỏi từ `JSON/VSTEPQuestions.json` (cần đăng nhập Admin).

## Lưu ý

- Script dùng `CREATE TABLE IF NOT EXISTS` và `ON CONFLICT ... DO NOTHING` nên chạy lại an toàn (không tạo trùng bảng, không insert trùng seed).
- Nếu đã có bảng cũ với cấu trúc khác, nên tạo project/database mới hoặc drop bảng rồi chạy lại script.
