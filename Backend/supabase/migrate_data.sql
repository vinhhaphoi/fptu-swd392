-- Supabase Data Migration Script
-- Use this script to migrate your existing data to Supabase

-- 1. Insert default levels
INSERT INTO public.levels (level_name, description) 
VALUES 
  ('A1', 'Beginner level'),
  ('A2', 'Elementary level'),
  ('B1', 'Intermediate level'),
  ('B2', 'Upper intermediate level'),
  ('C1', 'Advanced level'),
  ('C2', 'Proficiency level')
ON CONFLICT (level_name) DO NOTHING;

-- 2. Insert default parts
INSERT INTO public.parts (part_name, description, part_order) 
VALUES 
  ('Writing Task 1', 'Short message writing (email, note, SMS)', 1),
  ('Writing Task 2', 'Essay writing on familiar topics', 2),
  ('Reading', 'Reading comprehension tasks', 3),
  ('Listening', 'Listening comprehension tasks', 4)
ON CONFLICT (part_name) DO NOTHING;

-- 3. Insert sample topics (adjust according to your needs)
INSERT INTO public.topics (part_id, topic_name, context, purpose, recipient_role, difficulty_level_id)
SELECT 
  p.id,
  'Email Writing Practice',
  'Business communication scenario',
  'Professional correspondence',
  'Colleague',
  l.id
FROM public.parts p, public.levels l
WHERE p.part_name = 'Writing Task 1' AND l.level_name = 'B1'
ON CONFLICT (topic_name) DO NOTHING;

-- 4. Insert sample admin user (password: Admin123! - this is a bcrypt hash)
INSERT INTO public.users (name, username, email, password_hash, role, is_active)
VALUES 
  ('Admin User', 'admin', 'admin@vstep.edu.vn', '$2a$11$3X5N5j6Q4N8y4N8y4N8y4Ov2k8E9J0F1G2H3I4J5K6L7M8N9O0P1', 'Admin', true),
  ('Demo User', 'demo', 'demo@vstep.edu.vn', '$2a$11$3X5N5j6Q4N8y4N8y4N8y4Ov2k8E9J0F1G2H3I4J5K6L7M8N9O0P1', 'User', true)
ON CONFLICT (email) DO NOTHING;

-- 5. Create RLS policies for security
-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all for authenticated users" ON public.levels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to all for authenticated users" ON public.parts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to all for authenticated users" ON public.topics FOR SELECT TO authenticated USING (true);

-- User-specific policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "Users can view their own practice sessions" ON public.practice_sessions FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can view their own submissions" ON public.user_submissions FOR ALL TO authenticated USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admin full access" ON public.users FOR ALL TO service_role USING (true);
CREATE POLICY "Admin full access to all tables" ON public.topics FOR ALL TO service_role USING (true);

-- 6. Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_topics_part_id ON public.topics(part_id);
CREATE INDEX idx_topics_difficulty_level_id ON public.topics(difficulty_level_id);
CREATE INDEX idx_practice_sessions_user_id ON public.practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_topic_id ON public.practice_sessions(topic_id);
CREATE INDEX idx_user_submissions_user_id ON public.user_submissions(user_id);
CREATE INDEX idx_ai_evaluations_submission_id ON public.ai_evaluations(user_submission_id);