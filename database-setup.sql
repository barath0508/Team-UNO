-- Ensure eco_points column exists in profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS eco_points INTEGER DEFAULT 0;

-- Create index for better leaderboard performance
CREATE INDEX IF NOT EXISTS idx_profiles_eco_points ON profiles(eco_points DESC);