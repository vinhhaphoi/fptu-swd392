-- Run this script in Supabase Dashboard → SQL Editor → New query
-- Creates user_profiles table and marks the migration as applied so the app works.

-- 1. Create user_profiles table (same as migration 20260301190000_AddUserProfilesTable)
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id integer NOT NULL,
    full_name character varying(255),
    avatar_url character varying(500),
    bio character varying(1000),
    estimated_band_score real NOT NULL DEFAULT 0,
    streak_days integer NOT NULL DEFAULT 0,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_user_profiles" PRIMARY KEY (user_id),
    CONSTRAINT "FK_user_profiles_users_user_id" FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);

-- 2. Tell EF Core this migration was applied (so "dotnet ef database update" won't try to run it again)
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
SELECT '20260301190000_AddUserProfilesTable', '8.0.0'
WHERE NOT EXISTS (
    SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260301190000_AddUserProfilesTable'
);
