-- ============================================================
-- VSTEP Writing System – Full Supabase database setup
-- Dựa trên Domain entities và Fluent API configurations
-- Chạy trong Supabase SQL Editor (Database → SQL Editor)
-- ============================================================

-- ---------------------------------------------------------------------------
-- 1. LEVELS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS levels (
    level_id   SERIAL PRIMARY KEY,
    level_code VARCHAR(5) NOT NULL,
    name       VARCHAR(100) NOT NULL,
    description VARCHAR(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_levels_level_code ON levels(level_code);

-- Đảm bảo có đủ cột (nếu bảng đã tồn tại với schema cũ)
ALTER TABLE levels ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE levels ADD COLUMN IF NOT EXISTS description VARCHAR(100);
UPDATE levels SET name = level_code WHERE name IS NULL;
UPDATE levels SET description = level_code WHERE description IS NULL;
ALTER TABLE levels ALTER COLUMN name SET NOT NULL;

INSERT INTO levels (level_code, name, description) VALUES
    ('A1', 'Beginner', 'Beginner'),
    ('A2', 'Elementary', 'Elementary'),
    ('B1', 'Intermediate', 'Intermediate'),
    ('B2', 'Upper Intermediate', 'Upper Intermediate'),
    ('C1', 'Advanced', 'Advanced'),
    ('C2', 'Proficiency', 'Proficiency')
ON CONFLICT (level_code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. USERS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username         VARCHAR(100) NOT NULL,
    name             VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL,
    dob              DATE,
    phone_number     VARCHAR(20),
    password_hash    VARCHAR(255),
    role             VARCHAR(20) NOT NULL DEFAULT 'User',
    target_level_id  INT NULL REFERENCES levels(level_id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ,
    deleted_at       TIMESTAMPTZ,
    is_active        BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT chk_users_role CHECK (role IN ('Guest', 'User', 'Manager', 'Admin'))
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON users(username);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_phone_number ON users(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_users_target_level_id ON users(target_level_id);

-- ---------------------------------------------------------------------------
-- 3. USER_PROFILES (1-1 với users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
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
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_id   SERIAL PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(500) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- ---------------------------------------------------------------------------
-- 5. EXAM_STRUCTURES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_structures (
    exam_structure_id SERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    total_parts      INT NOT NULL,
    description      VARCHAR(500),
    duration_minutes INT,
    is_active        BOOLEAN DEFAULT true,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_exam_structures_name ON exam_structures(name);

-- ---------------------------------------------------------------------------
-- 6. PART_TYPES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS part_types (
    part_type_id SERIAL PRIMARY KEY,
    code         VARCHAR(20) NOT NULL,
    description  VARCHAR(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_part_types_code ON part_types(code);

INSERT INTO part_types (code, description) VALUES ('Task1', 'Part 1 - Letter/Email'), ('Task2', 'Part 2 - Essay')
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 7. PARTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS parts (
    part_id            SERIAL PRIMARY KEY,
    exam_structure_id  INT NOT NULL REFERENCES exam_structures(exam_structure_id) ON DELETE CASCADE,
    part_type_id       INT NOT NULL REFERENCES part_types(part_type_id) ON DELETE RESTRICT,
    part_number        INT,
    title              VARCHAR(200),
    description        VARCHAR(500),
    instructions       TEXT,
    time_limit         INT,
    min_words          INT,
    max_words          INT
);
CREATE INDEX IF NOT EXISTS ix_parts_exam_structure_id ON parts(exam_structure_id);
CREATE INDEX IF NOT EXISTS ix_parts_exam_structure_part_type ON parts(exam_structure_id, part_type_id);

-- ---------------------------------------------------------------------------
-- 8. TOPICS (id UUID)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS topics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id         INT NOT NULL REFERENCES parts(part_id) ON DELETE CASCADE,
    level_id        INT NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    title           VARCHAR(255) NOT NULL,
    prompt          TEXT NOT NULL,
    purpose         VARCHAR(500),
    recipient_role  VARCHAR(100),
    version         INT NOT NULL DEFAULT 1,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_topics_part_id ON topics(part_id);
CREATE INDEX IF NOT EXISTS ix_topics_level_id ON topics(level_id);
CREATE INDEX IF NOT EXISTS ix_topics_title ON topics(title);

-- ---------------------------------------------------------------------------
-- 9. VOCABULARY_SETS (chỉ level_id, N:M với topics qua bảng trung gian)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vocabulary_sets (
    vocab_set_id SERIAL PRIMARY KEY,
    level_id     INT NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    name         VARCHAR(100),
    is_active    BOOLEAN DEFAULT true
);
CREATE INDEX IF NOT EXISTS ix_vocabulary_sets_level_id ON vocabulary_sets(level_id);

-- ---------------------------------------------------------------------------
-- 10. TOPIC_VOCABULARY_SETS (composite PK)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS topic_vocabulary_sets (
    topic_id         UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    vocabulary_set_id INT NOT NULL REFERENCES vocabulary_sets(vocab_set_id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, vocabulary_set_id)
);
CREATE INDEX IF NOT EXISTS ix_topic_vocabulary_sets_vocab_set ON topic_vocabulary_sets(vocabulary_set_id);

-- ---------------------------------------------------------------------------
-- 11. VOCABULARY_ITEMS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vocabulary_items (
    vocab_id     SERIAL PRIMARY KEY,
    vocab_set_id INT NOT NULL REFERENCES vocabulary_sets(vocab_set_id) ON DELETE CASCADE,
    word         VARCHAR(100) NOT NULL,
    meaning      VARCHAR(255),
    example      TEXT
);
CREATE INDEX IF NOT EXISTS ix_vocabulary_items_vocab_set_id ON vocabulary_items(vocab_set_id);

-- ---------------------------------------------------------------------------
-- 12. SENTENCE_STRUCTURES (topic_id UUID, level_id)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sentence_structures (
    structure_id      SERIAL PRIMARY KEY,
    topic_id          UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    level_id          INT NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    structure_pattern VARCHAR(255) NOT NULL,
    explanation       TEXT
);
CREATE INDEX IF NOT EXISTS ix_sentence_structures_topic_id ON sentence_structures(topic_id);
CREATE INDEX IF NOT EXISTS ix_sentence_structures_level_id ON sentence_structures(level_id);

-- ---------------------------------------------------------------------------
-- 13. SAMPLE_TYPES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sample_types (
    sample_type_id SERIAL PRIMARY KEY,
    code          VARCHAR(20) NOT NULL,
    description   VARCHAR(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_sample_types_code ON sample_types(code);

-- ---------------------------------------------------------------------------
-- 14. SAMPLE_TEXTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sample_texts (
    sample_id        SERIAL PRIMARY KEY,
    topic_id         UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    level_id         INT NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    content          TEXT NOT NULL,
    sample_band_score REAL NOT NULL,
    version          INT DEFAULT 1
);
CREATE INDEX IF NOT EXISTS ix_sample_texts_topic_id ON sample_texts(topic_id);
CREATE INDEX IF NOT EXISTS ix_sample_texts_level_id ON sample_texts(level_id);

-- ---------------------------------------------------------------------------
-- 15. HINT_TYPES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hint_types (
    hint_type_id SERIAL PRIMARY KEY,
    code         VARCHAR(30) NOT NULL,
    description  VARCHAR(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_hint_types_code ON hint_types(code);

-- ---------------------------------------------------------------------------
-- 16. HINTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hints (
    hint_id       SERIAL PRIMARY KEY,
    topic_id      UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    level_id      INT NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    hint_type_id  INT NOT NULL REFERENCES hint_types(hint_type_id) ON DELETE RESTRICT,
    content       TEXT NOT NULL,
    display_order INT
);
CREATE INDEX IF NOT EXISTS ix_hints_topic_id ON hints(topic_id);
CREATE INDEX IF NOT EXISTS ix_hints_level_id ON hints(level_id);
CREATE INDEX IF NOT EXISTS ix_hints_hint_type_id ON hints(hint_type_id);

-- ---------------------------------------------------------------------------
-- 17. PROMPT_PURPOSES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prompt_purposes (
    purpose_id   SERIAL PRIMARY KEY,
    code         VARCHAR(30) NOT NULL,
    description  VARCHAR(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_prompt_purposes_code ON prompt_purposes(code);

-- ---------------------------------------------------------------------------
-- 18. SYSTEM_PROMPTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_prompts (
    prompt_id     SERIAL PRIMARY KEY,
    part_id       INT NOT NULL REFERENCES parts(part_id) ON DELETE CASCADE,
    level_id      INT NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    purpose_id    INT NOT NULL REFERENCES prompt_purposes(purpose_id) ON DELETE RESTRICT,
    prompt_content TEXT NOT NULL,
    is_active     BOOLEAN DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_system_prompts_part_id ON system_prompts(part_id);
CREATE INDEX IF NOT EXISTS ix_system_prompts_level_id ON system_prompts(level_id);
CREATE INDEX IF NOT EXISTS ix_system_prompts_purpose_id ON system_prompts(purpose_id);

-- ---------------------------------------------------------------------------
-- 19. PRACTICE_MODES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practice_modes (
    mode_id     SERIAL PRIMARY KEY,
    code        VARCHAR(30) NOT NULL,
    description VARCHAR(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_practice_modes_code ON practice_modes(code);

INSERT INTO practice_modes (code, description) VALUES
    ('Topic', 'Topic-based Practice'),
    ('Part', 'Part-based Practice'),
    ('MockExam', 'Mock Exam Mode')
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 20. EXAM_ATTEMPTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_attempts (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exam_structure_id INT NOT NULL REFERENCES exam_structures(exam_structure_id) ON DELETE RESTRICT,
    started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at      TIMESTAMPTZ,
    overall_score     REAL DEFAULT 0,
    estimated_band    REAL DEFAULT 0,
    status            VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS'
);
CREATE INDEX IF NOT EXISTS ix_exam_attempts_user_id ON exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS ix_exam_attempts_exam_structure_id ON exam_attempts(exam_structure_id);

-- ---------------------------------------------------------------------------
-- 21. PRACTICE_SESSIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practice_sessions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id          UUID REFERENCES topics(id) ON DELETE SET NULL,
    practice_mode_id  INT REFERENCES practice_modes(mode_id) ON DELETE RESTRICT,
    exam_attempt_id   UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
    status            VARCHAR(50) NOT NULL,
    started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS ix_practice_sessions_topic_id ON practice_sessions(topic_id);
CREATE INDEX IF NOT EXISTS ix_practice_sessions_practice_mode_id ON practice_sessions(practice_mode_id);
CREATE INDEX IF NOT EXISTS ix_practice_sessions_exam_attempt_id ON practice_sessions(exam_attempt_id);

-- ---------------------------------------------------------------------------
-- 22. WRITING_SUBMISSIONS (UserSubmission)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS writing_submissions (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_session_id  UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
    part_id              INT REFERENCES parts(part_id) ON DELETE SET NULL,
    version_number       INT NOT NULL DEFAULT 1,
    is_final             BOOLEAN NOT NULL DEFAULT false,
    submission_text      TEXT NOT NULL,
    word_count           INT NOT NULL,
    writing_time_seconds INT NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at         TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_writing_submissions_practice_session_id ON writing_submissions(practice_session_id);
CREATE INDEX IF NOT EXISTS ix_writing_submissions_session_version ON writing_submissions(practice_session_id, version_number);

-- ---------------------------------------------------------------------------
-- 23. RUBRICS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rubrics (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id    INT NOT NULL REFERENCES parts(part_id) ON DELETE RESTRICT,
    name       VARCHAR(255) NOT NULL,
    version    INT DEFAULT 1,
    is_active  BOOLEAN DEFAULT true
);
CREATE INDEX IF NOT EXISTS ix_rubrics_part_id ON rubrics(part_id);

-- ---------------------------------------------------------------------------
-- 24. SCORING_CRITERIA
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scoring_criteria (
    criteria_id SERIAL PRIMARY KEY,
    rubric_id   UUID NOT NULL REFERENCES rubrics(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    weight      REAL NOT NULL,
    max_score   INT DEFAULT 10
);
CREATE INDEX IF NOT EXISTS ix_scoring_criteria_rubric_id ON scoring_criteria(rubric_id);

-- ---------------------------------------------------------------------------
-- 25. SUBMISSION_SCORES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_scores (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id    UUID NOT NULL REFERENCES writing_submissions(id) ON DELETE CASCADE,
    overall_score    REAL NOT NULL,
    estimated_band   VARCHAR(50) NOT NULL,
    ai_model_version VARCHAR(100),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_submission_scores_submission_id ON submission_scores(submission_id);

-- ---------------------------------------------------------------------------
-- 26. CRITERIA_SCORES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS criteria_scores (
    id                   SERIAL PRIMARY KEY,
    submission_score_id  UUID NOT NULL REFERENCES submission_scores(id) ON DELETE CASCADE,
    criteria_id          INT NOT NULL REFERENCES scoring_criteria(criteria_id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS ix_criteria_scores_submission_score_id ON criteria_scores(submission_score_id);
CREATE INDEX IF NOT EXISTS ix_criteria_scores_criteria_id ON criteria_scores(criteria_id);

-- ---------------------------------------------------------------------------
-- 27. LANGUAGE_CHECKS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS language_checks (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_submission_id UUID NOT NULL REFERENCES writing_submissions(id) ON DELETE CASCADE,
    check_type         VARCHAR(50),
    ai_model_version   VARCHAR(50),
    grammar_errors     JSONB,
    spelling_errors    JSONB,
    checked_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_language_checks_user_submission_id ON language_checks(user_submission_id);

-- ---------------------------------------------------------------------------
-- 28. AI_FEEDBACKS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_feedbacks (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id    UUID NOT NULL REFERENCES writing_submissions(id) ON DELETE CASCADE,
    criteria_id      INT NOT NULL REFERENCES scoring_criteria(criteria_id) ON DELETE RESTRICT,
    feedback_text    VARCHAR(2000),
    suggestions      VARCHAR(2000),
    improved_version VARCHAR(5000)
);
CREATE INDEX IF NOT EXISTS ix_ai_feedbacks_submission_id ON ai_feedbacks(submission_id);
CREATE INDEX IF NOT EXISTS ix_ai_feedbacks_criteria_id ON ai_feedbacks(criteria_id);

-- ---------------------------------------------------------------------------
-- 29. USER_TOPIC_PROGRESS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_topic_progress (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id       UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    attempts_count INT DEFAULT 0,
    best_band_score VARCHAR(10) DEFAULT '0.0',
    average_score  REAL DEFAULT 0,
    last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mastery_level  VARCHAR(50),
    CONSTRAINT uq_user_topic_progress UNIQUE (user_id, topic_id)
);
CREATE INDEX IF NOT EXISTS ix_user_topic_progress_user_id ON user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS ix_user_topic_progress_topic_id ON user_topic_progress(topic_id);

-- ---------------------------------------------------------------------------
-- 30. USER_ERROR_STATISTICS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_error_statistics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    criteria_id     INT NOT NULL REFERENCES scoring_criteria(criteria_id) ON DELETE RESTRICT,
    part_id         INT NOT NULL REFERENCES parts(part_id) ON DELETE RESTRICT,
    level_id        INT NOT NULL REFERENCES levels(level_id) ON DELETE RESTRICT,
    occurrence_count INT DEFAULT 0,
    last_updated   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_user_error_statistics_user_id ON user_error_statistics(user_id);
CREATE INDEX IF NOT EXISTS ix_user_error_statistics_criteria_id ON user_error_statistics(criteria_id);

-- ---------------------------------------------------------------------------
-- Seed: VSTEP Exam Structure + 2 Parts (nếu chưa có)
-- ---------------------------------------------------------------------------
INSERT INTO exam_structures (name, total_parts, description, is_active)
SELECT 'VSTEP Writing', 2, 'VSTEP Writing Exam', true
WHERE NOT EXISTS (SELECT 1 FROM exam_structures WHERE name = 'VSTEP Writing');

DO $$
DECLARE
    v_es_id INT;
    v_pt1   INT;
    v_pt2   INT;
BEGIN
    SELECT exam_structure_id INTO v_es_id FROM exam_structures WHERE name = 'VSTEP Writing' LIMIT 1;
    SELECT part_type_id INTO v_pt1 FROM part_types WHERE code = 'Task1' LIMIT 1;
    SELECT part_type_id INTO v_pt2 FROM part_types WHERE code = 'Task2' LIMIT 1;
    IF v_es_id IS NOT NULL AND v_pt1 IS NOT NULL AND v_pt2 IS NOT NULL THEN
        INSERT INTO parts (exam_structure_id, part_type_id, part_number, title, description, time_limit, min_words, max_words)
        SELECT v_es_id, v_pt1, 1, 'Part 1 - Letter/Email', 'Write a letter or email (120-150 words)', 20, 120, 150
        WHERE NOT EXISTS (SELECT 1 FROM parts p WHERE p.exam_structure_id = v_es_id AND p.part_number = 1);
        INSERT INTO parts (exam_structure_id, part_type_id, part_number, title, description, time_limit, min_words, max_words)
        SELECT v_es_id, v_pt2, 2, 'Part 2 - Essay', 'Write an essay (250-300 words)', 40, 250, 300
        WHERE NOT EXISTS (SELECT 1 FROM parts p WHERE p.exam_structure_id = v_es_id AND p.part_number = 2);
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Seed: Admin & User test (mật khẩu: password)
-- ---------------------------------------------------------------------------
INSERT INTO users (id, username, name, email, password_hash, role, is_active, created_at)
VALUES
    ('a0000000-0000-0000-0000-000000000001'::uuid, 'admin', 'Admin Test', 'admin@test.local',
     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', true, NOW()),
    ('a0000000-0000-0000-0000-000000000002'::uuid, 'user', 'User Test', 'user@test.local',
     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'User', true, NOW())
ON CONFLICT (username) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Ghi chú
-- ---------------------------------------------------------------------------
-- - Bảng users dùng UUID (id); password_reset_tokens.user_id, user_profiles.user_id tham chiếu users(id).
-- - topics, practice_sessions, exam_attempts, writing_submissions, rubrics, submission_scores, language_checks, ai_feedbacks, user_topic_progress, user_error_statistics dùng UUID cho PK.
-- - Các bảng còn lại dùng SERIAL (integer) cho PK.
-- - Sau khi chạy, có thể gọi POST /api/admin/seed/vstep-questions để import câu hỏi từ VSTEPQuestions.json.
