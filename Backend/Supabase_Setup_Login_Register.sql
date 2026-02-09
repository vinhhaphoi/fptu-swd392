-- ============================================================
-- VSTEP Writing System - Setup tables for Login/Register (BE-only auth)
-- Supabase project: sezirrmmsvrafzzxpfcm
-- Chạy script này trong Supabase SQL Editor (Database → SQL Editor)
-- ============================================================

-- 1. Bảng levels (user.target_level_id tham chiếu đến đây)
CREATE TABLE IF NOT EXISTS levels (
    level_id     SERIAL PRIMARY KEY,
    level_code   VARCHAR(5) NOT NULL UNIQUE,
    description  VARCHAR(100)
);

-- Seed vài level để test (optional)
INSERT INTO levels (level_code, description) VALUES
    ('A1', 'Beginner'),
    ('A2', 'Elementary'),
    ('B1', 'Intermediate'),
    ('B2', 'Upper Intermediate'),
    ('C1', 'Advanced'),
    ('C2', 'Proficiency')
ON CONFLICT (level_code) DO NOTHING;

-- 2. Bảng profiles (users) - có password_hash cho BE auth
CREATE TABLE IF NOT EXISTS profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    username        VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    phone_number    VARCHAR(20),
    password_hash   VARCHAR(255),
    role            VARCHAR(20) NOT NULL DEFAULT 'User',
    target_level_id INT NULL REFERENCES levels(level_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT chk_role CHECK (role IN ('Guest', 'User', 'Manager', 'Admin'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_profiles_username ON profiles(username);
CREATE UNIQUE INDEX IF NOT EXISTS ix_profiles_email ON profiles(email);
CREATE UNIQUE INDEX IF NOT EXISTS ix_profiles_phone_number ON profiles(phone_number) WHERE phone_number IS NOT NULL;

-- Nếu bảng profiles đã tồn tại (từ project cũ) mà thiếu cột password_hash:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 3. Bảng password_reset_tokens (cho forgot/reset password)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_id   SERIAL PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    token      VARCHAR(500) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- 4. User test (optional): Admin và User để test login
-- Mật khẩu cho cả hai: password (BCrypt hash bên dưới)
INSERT INTO profiles (id, name, username, email, password_hash, role, is_active, created_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Admin Test',
    'admin',
    'admin@test.local',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin',
    true,
    NOW()
)
ON CONFLICT (username) DO NOTHING;

INSERT INTO profiles (id, name, username, email, password_hash, role, is_active, created_at)
VALUES (
    'a0000000-0000-0000-0000-000000000002'::uuid,
    'User Test',
    'user',
    'user@test.local',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'User',
    true,
    NOW()
)
ON CONFLICT (username) DO NOTHING;
-- Login test: username "admin" hoặc "user", password "password"

-- ============================================================
-- Ghi chú:
-- - Anon key: Không bắt buộc khi chỉ auth qua Backend. Đã cấu hình
--   app dùng ServiceRoleKey khi AnonKey để trống. Nếu cần Realtime/Storage
--   thì lấy Anon key ở: Project Settings → API → anon public.
-- - Connection string: appsettings đã trỏ tới project mới
--   (db.sezirrmmsvrafzzxpfcm.supabase.co). Nếu dùng Pooler, kiểm tra
--   đúng region (aws-0-ap-southeast-1 hoặc xem trong Supabase Dashboard).
-- - Test login: username "admin" hoặc "user", password "password".
-- ============================================================
