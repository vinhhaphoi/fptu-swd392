SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE public.role AS ENUM (
    'Guest',
    'User',
    'Manager',
    'Admin'
);

ALTER TYPE public.role OWNER TO postgres;

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    name character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    phone_number character varying(20),
    password_hash text NOT NULL,
    role public.role DEFAULT 'User'::public.role NOT NULL,
    target_level_id bigint,
    is_active boolean DEFAULT true NOT NULL
);

ALTER TABLE public.users OWNER TO postgres;

CREATE TABLE public.levels (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    level_name character varying(20) NOT NULL,
    description text
);

ALTER TABLE public.levels OWNER TO postgres;

CREATE TABLE public.parts (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    part_name character varying(100) NOT NULL,
    description text,
    part_order integer
);

ALTER TABLE public.parts OWNER TO postgres;

CREATE TABLE public.topics (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    part_id bigint NOT NULL,
    topic_name character varying(200) NOT NULL,
    context text,
    purpose text,
    recipient_role character varying(100),
    difficulty_level_id bigint NOT NULL
);

ALTER TABLE public.topics OWNER TO postgres;

CREATE TABLE public.vocabulary_sets (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    set_name character varying(100) NOT NULL,
    description text,
    topic_id bigint NOT NULL,
    level_id bigint NOT NULL
);

ALTER TABLE public.vocabulary_sets OWNER TO postgres;

CREATE TABLE public.vocabulary_items (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    vocabulary_set_id bigint NOT NULL,
    word character varying(100) NOT NULL,
    definition text NOT NULL,
    example text,
    part_of_speech character varying(20)
);

ALTER TABLE public.vocabulary_items OWNER TO postgres;

CREATE TABLE public.sample_texts (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    title character varying(200) NOT NULL,
    content text NOT NULL,
    sample_type character varying(50),
    topic_id bigint NOT NULL,
    level_id bigint NOT NULL
);

ALTER TABLE public.sample_texts OWNER TO postgres;

CREATE TABLE public.hints (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    topic_id bigint NOT NULL,
    level_id bigint NOT NULL,
    hint_text text NOT NULL,
    hint_type character varying(50)
);

ALTER TABLE public.hints OWNER TO postgres;

CREATE TABLE public.practice_sessions (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id bigint NOT NULL,
    topic_id bigint NOT NULL,
    level_id bigint NOT NULL,
    practice_mode character varying(50) NOT NULL,
    duration_minutes integer,
    started_at timestamp with time zone,
    ended_at timestamp with time zone
);

ALTER TABLE public.practice_sessions OWNER TO postgres;

CREATE TABLE public.user_submissions (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id bigint NOT NULL,
    practice_session_id bigint NOT NULL,
    submission_text text NOT NULL,
    submission_score numeric(5,2),
    feedback text
);

ALTER TABLE public.user_submissions OWNER TO postgres;

CREATE TABLE public.ai_evaluations (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_submission_id bigint NOT NULL,
    evaluation_json jsonb,
    overall_score numeric(5,2),
    criteria_scores jsonb
);

ALTER TABLE public.ai_evaluations OWNER TO postgres;

CREATE TABLE public.password_reset_tokens (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    user_id bigint NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used boolean DEFAULT false NOT NULL
);

ALTER TABLE public.password_reset_tokens OWNER TO postgres;

ALTER TABLE ONLY public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.levels ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.levels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.parts ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.parts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.topics ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.topics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.vocabulary_sets ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.vocabulary_sets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.vocabulary_items ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.vocabulary_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.sample_texts ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.sample_texts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.hints ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.hints_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.practice_sessions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.practice_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.user_submissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.ai_evaluations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.ai_evaluations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.vocabulary_sets
    ADD CONSTRAINT vocabulary_sets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.vocabulary_items
    ADD CONSTRAINT vocabulary_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.sample_texts
    ADD CONSTRAINT sample_texts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.hints
    ADD CONSTRAINT hints_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_submissions
    ADD CONSTRAINT user_submissions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.ai_evaluations
    ADD CONSTRAINT ai_evaluations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);
CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_target_level_id_fkey FOREIGN KEY (target_level_id) REFERENCES public.levels(id);

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_difficulty_level_id_fkey FOREIGN KEY (difficulty_level_id) REFERENCES public.levels(id);
ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_part_id_fkey FOREIGN KEY (part_id) REFERENCES public.parts(id);

ALTER TABLE ONLY public.vocabulary_sets
    ADD CONSTRAINT vocabulary_sets_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(id);
ALTER TABLE ONLY public.vocabulary_sets
    ADD CONSTRAINT vocabulary_sets_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);

ALTER TABLE ONLY public.vocabulary_items
    ADD CONSTRAINT vocabulary_items_vocabulary_set_id_fkey FOREIGN KEY (vocabulary_set_id) REFERENCES public.vocabulary_sets(id);

ALTER TABLE ONLY public.sample_texts
    ADD CONSTRAINT sample_texts_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(id);
ALTER TABLE ONLY public.sample_texts
    ADD CONSTRAINT sample_texts_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);

ALTER TABLE ONLY public.hints
    ADD CONSTRAINT hints_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(id);
ALTER TABLE ONLY public.hints
    ADD CONSTRAINT hints_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(id);
ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);
ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.user_submissions
    ADD CONSTRAINT user_submissions_practice_session_id_fkey FOREIGN KEY (practice_session_id) REFERENCES public.practice_sessions(id);
ALTER TABLE ONLY public.user_submissions
    ADD CONSTRAINT user_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.ai_evaluations
    ADD CONSTRAINT ai_evaluations_user_submission_id_fkey FOREIGN KEY (user_submission_id) REFERENCES public.user_submissions(id);

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

CREATE POLICY "Enable read access for all users" ON public.levels FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.parts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.topics FOR SELECT USING (true);

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

CREATE POLICY "Authenticated users can access their own data" ON public.users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can view their own practice sessions" ON public.practice_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own submissions" ON public.user_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own AI evaluations" ON public.ai_evaluations FOR ALL USING (auth.uid() = (SELECT u.id FROM public.users u JOIN public.user_submissions us ON u.id = us.user_id JOIN public.ai_evaluations ae ON ae.user_submission_id = us.id WHERE ae.id = ai_evaluations.id));

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

GRANT ALL ON TABLE public.users TO postgres;
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;

GRANT ALL ON TABLE public.levels TO postgres;
GRANT ALL ON TABLE public.levels TO anon;
GRANT ALL ON TABLE public.levels TO authenticated;
GRANT ALL ON TABLE public.levels TO service_role;

GRANT ALL ON TABLE public.parts TO postgres;
GRANT ALL ON TABLE public.parts TO anon;
GRANT ALL ON TABLE public.parts TO authenticated;
GRANT ALL ON TABLE public.parts TO service_role;

GRANT ALL ON TABLE public.topics TO postgres;
GRANT ALL ON TABLE public.topics TO anon;
GRANT ALL ON TABLE public.topics TO authenticated;
GRANT ALL ON TABLE public.topics TO service_role;

GRANT ALL ON TABLE public.vocabulary_sets TO postgres;
GRANT ALL ON TABLE public.vocabulary_sets TO anon;
GRANT ALL ON TABLE public.vocabulary_sets TO authenticated;
GRANT ALL ON TABLE public.vocabulary_sets TO service_role;

GRANT ALL ON TABLE public.vocabulary_items TO postgres;
GRANT ALL ON TABLE public.vocabulary_items TO anon;
GRANT ALL ON TABLE public.vocabulary_items TO authenticated;
GRANT ALL ON TABLE public.vocabulary_items TO service_role;

GRANT ALL ON TABLE public.sample_texts TO postgres;
GRANT ALL ON TABLE public.sample_texts TO anon;
GRANT ALL ON TABLE public.sample_texts TO authenticated;
GRANT ALL ON TABLE public.sample_texts TO service_role;

GRANT ALL ON TABLE public.hints TO postgres;
GRANT ALL ON TABLE public.hints TO anon;
GRANT ALL ON TABLE public.hints TO authenticated;
GRANT ALL ON TABLE public.hints TO service_role;

GRANT ALL ON TABLE public.practice_sessions TO postgres;
GRANT ALL ON TABLE public.practice_sessions TO anon;
GRANT ALL ON TABLE public.practice_sessions TO authenticated;
GRANT ALL ON TABLE public.practice_sessions TO service_role;

GRANT ALL ON TABLE public.user_submissions TO postgres;
GRANT ALL ON TABLE public.user_submissions TO anon;
GRANT ALL ON TABLE public.user_submissions TO authenticated;
GRANT ALL ON TABLE public.user_submissions TO service_role;

GRANT ALL ON TABLE public.ai_evaluations TO postgres;
GRANT ALL ON TABLE public.ai_evaluations TO anon;
GRANT ALL ON TABLE public.ai_evaluations TO authenticated;
GRANT ALL ON TABLE public.ai_evaluations TO service_role;

GRANT ALL ON TABLE public.password_reset_tokens TO postgres;
GRANT ALL ON TABLE public.password_reset_tokens TO anon;
GRANT ALL ON TABLE public.password_reset_tokens TO authenticated;
GRANT ALL ON TABLE public.password_reset_tokens TO service_role;

GRANT ALL ON SEQUENCE public.users_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.users_id_seq TO anon;
GRANT ALL ON SEQUENCE public.users_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.users_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.levels_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.levels_id_seq TO anon;
GRANT ALL ON SEQUENCE public.levels_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.levels_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.parts_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.parts_id_seq TO anon;
GRANT ALL ON SEQUENCE public.parts_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.parts_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.topics_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.topics_id_seq TO anon;
GRANT ALL ON SEQUENCE public.topics_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.topics_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.vocabulary_sets_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.vocabulary_sets_id_seq TO anon;
GRANT ALL ON SEQUENCE public.vocabulary_sets_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.vocabulary_sets_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.vocabulary_items_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.vocabulary_items_id_seq TO anon;
GRANT ALL ON SEQUENCE public.vocabulary_items_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.vocabulary_items_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.sample_texts_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.sample_texts_id_seq TO anon;
GRANT ALL ON SEQUENCE public.sample_texts_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.sample_texts_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.hints_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.hints_id_seq TO anon;
GRANT ALL ON SEQUENCE public.hints_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.hints_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.practice_sessions_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.practice_sessions_id_seq TO anon;
GRANT ALL ON SEQUENCE public.practice_sessions_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.practice_sessions_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.user_submissions_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.user_submissions_id_seq TO anon;
GRANT ALL ON SEQUENCE public.user_submissions_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.user_submissions_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.ai_evaluations_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.ai_evaluations_id_seq TO anon;
GRANT ALL ON SEQUENCE public.ai_evaluations_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.ai_evaluations_id_seq TO service_role;

GRANT ALL ON SEQUENCE public.password_reset_tokens_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.password_reset_tokens_id_seq TO anon;
GRANT ALL ON SEQUENCE public.password_reset_tokens_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.password_reset_tokens_id_seq TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;