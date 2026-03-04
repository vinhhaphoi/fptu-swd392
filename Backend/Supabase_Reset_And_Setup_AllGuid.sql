-- ============================================================
-- VSTEP Writing System – RESET & SETUP TOÀN BỘ DATABASE
-- 1. Xóa toàn bộ bảng (CASCADE)
-- 2. Tạo lại schema (All UUID)
-- 3. Seed dữ liệu mặc định
-- CẢNH BÁO: Xóa toàn bộ dữ liệu. Chỉ chạy khi đồng ý mất data hoặc đã backup.
-- Chạy trong Supabase SQL Editor (Database → SQL Editor)
-- ============================================================

-- ===================== PHẦN 1: RESET – DROP TẤT CẢ BẢNG =====================

DROP TABLE IF EXISTS user_error_statistics CASCADE;
DROP TABLE IF EXISTS user_topic_progress CASCADE;
DROP TABLE IF EXISTS learning_plans CASCADE;
DROP TABLE IF EXISTS ai_feedbacks CASCADE;
DROP TABLE IF EXISTS language_checks CASCADE;
DROP TABLE IF EXISTS criteria_scores CASCADE;
DROP TABLE IF EXISTS submission_scores CASCADE;
DROP TABLE IF EXISTS scoring_criteria CASCADE;
DROP TABLE IF EXISTS rubrics CASCADE;
DROP TABLE IF EXISTS writing_submissions CASCADE;
DROP TABLE IF EXISTS practice_sessions CASCADE;
DROP TABLE IF EXISTS exam_attempts CASCADE;
DROP TABLE IF EXISTS practice_modes CASCADE;
DROP TABLE IF EXISTS system_prompts CASCADE;
DROP TABLE IF EXISTS prompt_purposes CASCADE;
DROP TABLE IF EXISTS hints CASCADE;
DROP TABLE IF EXISTS hint_types CASCADE;
DROP TABLE IF EXISTS sample_texts CASCADE;
DROP TABLE IF EXISTS sample_types CASCADE;
DROP TABLE IF EXISTS sentence_structures CASCADE;
DROP TABLE IF EXISTS vocabulary_items CASCADE;
DROP TABLE IF EXISTS topic_vocabulary_sets CASCADE;
DROP TABLE IF EXISTS vocabulary_sets CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS parts CASCADE;
DROP TABLE IF EXISTS part_types CASCADE;
DROP TABLE IF EXISTS exam_structures CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS levels CASCADE;

-- ===================== PHẦN 2: SETUP – TẠO LẠI SCHEMA (ALL UUID) =====================

-- ---------------------------------------------------------------------------
-- 1. LEVELS (PK: level_id UUID)
-- ---------------------------------------------------------------------------
CREATE TABLE levels (
    level_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_code      VARCHAR(5) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    description     VARCHAR(100),
    band_score_min  INT NOT NULL DEFAULT 0,
    band_score_max  INT NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX ix_levels_level_code ON levels(level_code);

-- ---------------------------------------------------------------------------
-- 2. USERS (PK: id UUID)
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username         VARCHAR(100) NOT NULL,
    name             VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL,
    dob              DATE,
    phone_number     VARCHAR(20),
    password_hash    VARCHAR(255),
    role             VARCHAR(20) NOT NULL DEFAULT 'User',
    target_level_id  UUID NULL REFERENCES levels(level_id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ,
    deleted_at       TIMESTAMPTZ,
    is_active        BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT chk_users_role CHECK (role IN ('Guest', 'User', 'Manager', 'Admin'))
);
CREATE UNIQUE INDEX ix_users_username ON users(username);
CREATE UNIQUE INDEX ix_users_email ON users(email);
CREATE UNIQUE INDEX ix_users_phone_number ON users(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX ix_users_target_level_id ON users(target_level_id);

-- ---------------------------------------------------------------------------
-- 3. USER_PROFILES
-- ---------------------------------------------------------------------------
CREATE TABLE user_profiles (
    user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name            VARCHAR(255),
    avatar_url           VARCHAR(500),
    bio                  VARCHAR(1000),
    estimated_band_score  REAL NOT NULL DEFAULT 0,
    streak_days          INT NOT NULL DEFAULT 0,
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4. PASSWORD_RESET_TOKENS
-- ---------------------------------------------------------------------------
CREATE TABLE password_reset_tokens (
    token_id   SERIAL PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(500) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX ix_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- ---------------------------------------------------------------------------
-- 5. EXAM_STRUCTURES
-- ---------------------------------------------------------------------------
CREATE TABLE exam_structures (
    exam_structure_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name             VARCHAR(100) NOT NULL,
    total_parts      INT NOT NULL,
    description      VARCHAR(500),
    duration_minutes INT,
    is_active        BOOLEAN DEFAULT true,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ
);
CREATE UNIQUE INDEX ix_exam_structures_name ON exam_structures(name);

-- ---------------------------------------------------------------------------
-- 6. PART_TYPES
-- ---------------------------------------------------------------------------
CREATE TABLE part_types (
    part_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code         VARCHAR(20) NOT NULL,
    description  VARCHAR(100)
);
CREATE UNIQUE INDEX ix_part_types_code ON part_types(code);

-- ---------------------------------------------------------------------------
-- 7. PARTS
-- ---------------------------------------------------------------------------
CREATE TABLE parts (
    part_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_structure_id  UUID NOT NULL REFERENCES exam_structures(exam_structure_id) ON DELETE CASCADE,
    part_type_id       UUID NOT NULL REFERENCES part_types(part_type_id) ON DELETE RESTRICT,
    part_number        INT,
    title              VARCHAR(200),
    description        VARCHAR(500),
    instructions       TEXT,
    time_limit         INT,
    min_words          INT,
    max_words          INT
);
CREATE INDEX ix_parts_exam_structure_id ON parts(exam_structure_id);
CREATE INDEX ix_parts_part_type_id ON parts(part_type_id);

-- ---------------------------------------------------------------------------
-- 8. TOPICS
-- ---------------------------------------------------------------------------
CREATE TABLE topics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id         UUID NOT NULL REFERENCES parts(part_id) ON DELETE CASCADE,
    level_id        UUID NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    title           VARCHAR(255) NOT NULL,
    prompt          TEXT NOT NULL,
    purpose         VARCHAR(500),
    recipient_role  VARCHAR(100),
    version         INT NOT NULL DEFAULT 1,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_topics_part_id ON topics(part_id);
CREATE INDEX ix_topics_level_id ON topics(level_id);
CREATE INDEX ix_topics_title ON topics(title);

-- ---------------------------------------------------------------------------
-- 9. VOCABULARY_SETS
-- ---------------------------------------------------------------------------
CREATE TABLE vocabulary_sets (
    vocab_set_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id     UUID NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    name         VARCHAR(100),
    is_active    BOOLEAN DEFAULT true
);
CREATE INDEX ix_vocabulary_sets_level_id ON vocabulary_sets(level_id);

-- ---------------------------------------------------------------------------
-- 10. TOPIC_VOCABULARY_SETS
-- ---------------------------------------------------------------------------
CREATE TABLE topic_vocabulary_sets (
    topic_id          UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    vocabulary_set_id UUID NOT NULL REFERENCES vocabulary_sets(vocab_set_id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, vocabulary_set_id)
);
CREATE INDEX ix_topic_vocabulary_sets_vocab_set ON topic_vocabulary_sets(vocabulary_set_id);

-- ---------------------------------------------------------------------------
-- 11. VOCABULARY_ITEMS
-- ---------------------------------------------------------------------------
CREATE TABLE vocabulary_items (
    vocab_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vocab_set_id UUID NOT NULL REFERENCES vocabulary_sets(vocab_set_id) ON DELETE CASCADE,
    word         VARCHAR(100) NOT NULL,
    meaning      VARCHAR(255),
    example      TEXT
);
CREATE INDEX ix_vocabulary_items_vocab_set_id ON vocabulary_items(vocab_set_id);

-- ---------------------------------------------------------------------------
-- 12. SENTENCE_STRUCTURES
-- ---------------------------------------------------------------------------
CREATE TABLE sentence_structures (
    structure_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id          UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    level_id          UUID NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    structure_pattern VARCHAR(255) NOT NULL,
    explanation       TEXT
);
CREATE INDEX ix_sentence_structures_topic_id ON sentence_structures(topic_id);
CREATE INDEX ix_sentence_structures_level_id ON sentence_structures(level_id);

-- ---------------------------------------------------------------------------
-- 13. SAMPLE_TYPES
-- ---------------------------------------------------------------------------
CREATE TABLE sample_types (
    sample_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code          VARCHAR(20) NOT NULL,
    description   VARCHAR(100)
);
CREATE UNIQUE INDEX ix_sample_types_code ON sample_types(code);

-- ---------------------------------------------------------------------------
-- 14. SAMPLE_TEXTS
-- ---------------------------------------------------------------------------
CREATE TABLE sample_texts (
    sample_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id          UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    level_id          UUID NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    content           TEXT NOT NULL,
    sample_band_score REAL NOT NULL,
    version           INT DEFAULT 1
);
CREATE INDEX ix_sample_texts_topic_id ON sample_texts(topic_id);
CREATE INDEX ix_sample_texts_level_id ON sample_texts(level_id);

-- ---------------------------------------------------------------------------
-- 15. HINT_TYPES
-- ---------------------------------------------------------------------------
CREATE TABLE hint_types (
    hint_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code         VARCHAR(30) NOT NULL,
    description  VARCHAR(100)
);
CREATE UNIQUE INDEX ix_hint_types_code ON hint_types(code);

-- ---------------------------------------------------------------------------
-- 16. HINTS
-- ---------------------------------------------------------------------------
CREATE TABLE hints (
    hint_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id      UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    level_id      UUID NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    hint_type_id  UUID NOT NULL REFERENCES hint_types(hint_type_id) ON DELETE RESTRICT,
    content       TEXT NOT NULL,
    display_order INT
);
CREATE INDEX ix_hints_topic_id ON hints(topic_id);
CREATE INDEX ix_hints_level_id ON hints(level_id);
CREATE INDEX ix_hints_hint_type_id ON hints(hint_type_id);

-- ---------------------------------------------------------------------------
-- 17. PROMPT_PURPOSES
-- ---------------------------------------------------------------------------
CREATE TABLE prompt_purposes (
    purpose_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(30) NOT NULL,
    description VARCHAR(100)
);
CREATE UNIQUE INDEX ix_prompt_purposes_code ON prompt_purposes(code);

-- ---------------------------------------------------------------------------
-- 18. SYSTEM_PROMPTS
-- ---------------------------------------------------------------------------
CREATE TABLE system_prompts (
    prompt_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id        UUID NOT NULL REFERENCES parts(part_id) ON DELETE CASCADE,
    level_id       UUID NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    purpose_id     UUID NOT NULL REFERENCES prompt_purposes(purpose_id) ON DELETE RESTRICT,
    prompt_content TEXT NOT NULL,
    is_active      BOOLEAN DEFAULT true,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ
);
CREATE INDEX ix_system_prompts_part_id ON system_prompts(part_id);
CREATE INDEX ix_system_prompts_level_id ON system_prompts(level_id);
CREATE INDEX ix_system_prompts_purpose_id ON system_prompts(purpose_id);

-- ---------------------------------------------------------------------------
-- 19. PRACTICE_MODES
-- ---------------------------------------------------------------------------
CREATE TABLE practice_modes (
    mode_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(30) NOT NULL,
    description VARCHAR(100)
);
CREATE UNIQUE INDEX ix_practice_modes_code ON practice_modes(code);

-- ---------------------------------------------------------------------------
-- 20. EXAM_ATTEMPTS
-- ---------------------------------------------------------------------------
CREATE TABLE exam_attempts (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exam_structure_id UUID NOT NULL REFERENCES exam_structures(exam_structure_id) ON DELETE RESTRICT,
    started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at      TIMESTAMPTZ,
    overall_score     REAL DEFAULT 0,
    estimated_band    REAL DEFAULT 0,
    status            VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS'
);
CREATE INDEX ix_exam_attempts_user_id ON exam_attempts(user_id);
CREATE INDEX ix_exam_attempts_exam_structure_id ON exam_attempts(exam_structure_id);

-- ---------------------------------------------------------------------------
-- 21. PRACTICE_SESSIONS
-- ---------------------------------------------------------------------------
CREATE TABLE practice_sessions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id          UUID REFERENCES topics(id) ON DELETE SET NULL,
    practice_mode_id  UUID REFERENCES practice_modes(mode_id) ON DELETE RESTRICT,
    exam_attempt_id   UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
    status            VARCHAR(50) NOT NULL,
    started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at      TIMESTAMPTZ
);
CREATE INDEX ix_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX ix_practice_sessions_topic_id ON practice_sessions(topic_id);
CREATE INDEX ix_practice_sessions_practice_mode_id ON practice_sessions(practice_mode_id);
CREATE INDEX ix_practice_sessions_exam_attempt_id ON practice_sessions(exam_attempt_id);

-- ---------------------------------------------------------------------------
-- 22. WRITING_SUBMISSIONS
-- ---------------------------------------------------------------------------
CREATE TABLE writing_submissions (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_session_id  UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
    part_id              UUID REFERENCES parts(part_id) ON DELETE SET NULL,
    version_number       INT NOT NULL DEFAULT 1,
    is_final             BOOLEAN NOT NULL DEFAULT false,
    submission_text      TEXT NOT NULL,
    word_count           INT NOT NULL,
    writing_time_seconds INT NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at         TIMESTAMPTZ
);
CREATE INDEX ix_writing_submissions_practice_session_id ON writing_submissions(practice_session_id);
CREATE INDEX ix_writing_submissions_session_version ON writing_submissions(practice_session_id, version_number);

-- ---------------------------------------------------------------------------
-- 23. RUBRICS
-- ---------------------------------------------------------------------------
CREATE TABLE rubrics (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id    UUID NOT NULL REFERENCES parts(part_id) ON DELETE RESTRICT,
    name       VARCHAR(255) NOT NULL,
    version    INT DEFAULT 1,
    is_active  BOOLEAN DEFAULT true
);
CREATE INDEX ix_rubrics_part_id ON rubrics(part_id);

-- ---------------------------------------------------------------------------
-- 24. SCORING_CRITERIA
-- ---------------------------------------------------------------------------
CREATE TABLE scoring_criteria (
    criteria_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rubric_id   UUID NOT NULL REFERENCES rubrics(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    weight      REAL NOT NULL,
    max_score   INT DEFAULT 10
);
CREATE INDEX ix_scoring_criteria_rubric_id ON scoring_criteria(rubric_id);

-- ---------------------------------------------------------------------------
-- 25. SUBMISSION_SCORES
-- ---------------------------------------------------------------------------
CREATE TABLE submission_scores (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id    UUID NOT NULL REFERENCES writing_submissions(id) ON DELETE CASCADE,
    overall_score    REAL NOT NULL,
    estimated_band   VARCHAR(50) NOT NULL,
    ai_model_version VARCHAR(100),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_submission_scores_submission_id ON submission_scores(submission_id);

-- ---------------------------------------------------------------------------
-- 26. CRITERIA_SCORES
-- ---------------------------------------------------------------------------
CREATE TABLE criteria_scores (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_score_id  UUID NOT NULL REFERENCES submission_scores(id) ON DELETE CASCADE,
    criteria_id         UUID NOT NULL REFERENCES scoring_criteria(criteria_id) ON DELETE RESTRICT,
    score                REAL NULL,
    feedback             TEXT NULL
);
CREATE INDEX ix_criteria_scores_submission_score_id ON criteria_scores(submission_score_id);
CREATE INDEX ix_criteria_scores_criteria_id ON criteria_scores(criteria_id);

-- ---------------------------------------------------------------------------
-- 27. LANGUAGE_CHECKS
-- ---------------------------------------------------------------------------
CREATE TABLE language_checks (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_submission_id UUID NOT NULL REFERENCES writing_submissions(id) ON DELETE CASCADE,
    check_type         VARCHAR(50),
    ai_model_version   VARCHAR(50),
    grammar_errors     JSONB,
    spelling_errors    JSONB,
    checked_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_language_checks_user_submission_id ON language_checks(user_submission_id);

-- ---------------------------------------------------------------------------
-- 28. AI_FEEDBACKS
-- ---------------------------------------------------------------------------
CREATE TABLE ai_feedbacks (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id    UUID NOT NULL REFERENCES writing_submissions(id) ON DELETE CASCADE,
    criteria_id      UUID NOT NULL REFERENCES scoring_criteria(criteria_id) ON DELETE RESTRICT,
    feedback_text    VARCHAR(2000),
    suggestions      VARCHAR(2000),
    improved_version VARCHAR(5000)
);
CREATE INDEX ix_ai_feedbacks_submission_id ON ai_feedbacks(submission_id);
CREATE INDEX ix_ai_feedbacks_criteria_id ON ai_feedbacks(criteria_id);

-- ---------------------------------------------------------------------------
-- 29. USER_TOPIC_PROGRESS
-- ---------------------------------------------------------------------------
CREATE TABLE user_topic_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id        UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    attempts_count  INT DEFAULT 0,
    best_band_score VARCHAR(10) DEFAULT '0.0',
    average_score   REAL DEFAULT 0,
    last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mastery_level   VARCHAR(50),
    CONSTRAINT uq_user_topic_progress UNIQUE (user_id, topic_id)
);
CREATE INDEX ix_user_topic_progress_user_id ON user_topic_progress(user_id);
CREATE INDEX ix_user_topic_progress_topic_id ON user_topic_progress(topic_id);

-- ---------------------------------------------------------------------------
-- 30a. LEARNING_PLANS
-- ---------------------------------------------------------------------------
CREATE TABLE learning_plans (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_level_id         UUID NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    total_required_sessions INT NOT NULL DEFAULT 0,
    completed_sessions      INT NOT NULL DEFAULT 0,
    weak_area               VARCHAR(500),
    progress_percentage     REAL NOT NULL DEFAULT 0,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_learning_plans_user_id UNIQUE (user_id)
);
CREATE INDEX ix_learning_plans_user_id ON learning_plans(user_id);
CREATE INDEX ix_learning_plans_target_level_id ON learning_plans(target_level_id);

-- ---------------------------------------------------------------------------
-- 30. USER_ERROR_STATISTICS
-- ---------------------------------------------------------------------------
CREATE TABLE user_error_statistics (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    criteria_id      UUID NOT NULL REFERENCES scoring_criteria(criteria_id) ON DELETE RESTRICT,
    part_id          UUID NOT NULL REFERENCES parts(part_id) ON DELETE RESTRICT,
    level_id         UUID NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    occurrence_count INT DEFAULT 0,
    last_updated     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_user_error_statistics_user_id ON user_error_statistics(user_id);
CREATE INDEX ix_user_error_statistics_criteria_id ON user_error_statistics(criteria_id);

-- ===================== PHẦN 3: SEED DỮ LIỆU MẶC ĐỊNH =====================

-- Levels (A1–C2)
INSERT INTO levels (level_id, level_code, name, description) VALUES
    ('10000000-0000-0000-0000-000000000001'::uuid, 'A1', 'Beginner', 'Beginner'),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'A2', 'Elementary', 'Elementary'),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'B1', 'Intermediate', 'Intermediate'),
    ('10000000-0000-0000-0000-000000000004'::uuid, 'B2', 'Upper Intermediate', 'Upper Intermediate'),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'C1', 'Advanced', 'Advanced'),
    ('10000000-0000-0000-0000-000000000006'::uuid, 'C2', 'Proficiency', 'Proficiency');

-- Part types (Task1, Task2)
INSERT INTO part_types (part_type_id, code, description) VALUES
    ('20000000-0000-0000-0000-000000000001'::uuid, 'Task1', 'Part 1 - Letter/Email'),
    ('20000000-0000-0000-0000-000000000002'::uuid, 'Task2', 'Part 2 - Essay');

-- Practice modes
INSERT INTO practice_modes (mode_id, code, description) VALUES
    ('50000000-0000-0000-0000-000000000001'::uuid, 'Topic', 'Topic-based Practice'),
    ('50000000-0000-0000-0000-000000000002'::uuid, 'Part', 'Part-based Practice'),
    ('50000000-0000-0000-0000-000000000003'::uuid, 'MockExam', 'Mock Exam Mode');

-- VSTEP Exam Structure + 2 Parts
INSERT INTO exam_structures (exam_structure_id, name, total_parts, description, is_active)
VALUES ('30000000-0000-0000-0000-000000000001'::uuid, 'VSTEP Writing', 2, 'VSTEP Writing Exam', true);

INSERT INTO parts (part_id, exam_structure_id, part_type_id, part_number, title, description, time_limit, min_words, max_words) VALUES
    ('40000000-0000-0000-0000-000000000001'::uuid, '30000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000001'::uuid, 1, 'Part 1 - Letter/Email', 'Write a letter or email (120-150 words)', 20, 120, 150),
    ('40000000-0000-0000-0000-000000000002'::uuid, '30000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000002'::uuid, 2, 'Part 2 - Essay', 'Write an essay (250-300 words)', 40, 250, 300);

-- Admin & User test (mật khẩu: password)
INSERT INTO users (id, username, name, email, password_hash, role, is_active, created_at) VALUES
    ('a0000000-0000-0000-0000-000000000001'::uuid, 'admin', 'Admin Test', 'admin@test.local', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', true, NOW()),
    ('a0000000-0000-0000-0000-000000000002'::uuid, 'user', 'User Test', 'user@test.local', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'User', true, NOW());

-- ===================== HOÀN TẤT =====================
-- Database đã được reset và setup lại từ đầu.
-- Có thể gọi POST /api/admin/seed/vstep-questions để import câu hỏi từ VSTEPQuestions.json (nếu có).
