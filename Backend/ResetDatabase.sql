-- Reset database for Supabase (cannot DROP DATABASE postgres)
-- Run this in Supabase SQL Editor (Database → SQL Editor), then run: dotnet ef database update

-- Drop all tables and the EF migration history
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
