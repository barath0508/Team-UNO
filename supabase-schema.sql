-- ============================================
-- COMPLETE DATABASE RESET AND SCHEMA SETUP
-- ============================================

-- Drop all existing tables and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profile_age ON profiles;
DROP TRIGGER IF EXISTS update_profile_level ON profiles;

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_age_from_dob();
DROP FUNCTION IF EXISTS update_level_from_points();

DROP TABLE IF EXISTS location_tasks CASCADE;
DROP TABLE IF EXISTS daily_tasks CASCADE;
DROP TABLE IF EXISTS mission_submissions CASCADE;
DROP TABLE IF EXISTS eco_points_history CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  mobile TEXT,
  date_of_birth DATE,
  roblox_id TEXT,
  age INTEGER DEFAULT 18 CHECK (age >= 0 AND age <= 150),
  location TEXT DEFAULT '',
  state TEXT DEFAULT '',
  district TEXT DEFAULT '',
  eco_points INTEGER DEFAULT 0 CHECK (eco_points >= 0),
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  first_login_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eco points history
CREATE TABLE eco_points_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mission submissions
CREATE TABLE mission_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id INTEGER,
  mission_title TEXT,
  proof_image TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily tasks
CREATE TABLE daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_data JSONB,
  date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location tasks
CREATE TABLE location_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT,
  title TEXT,
  description TEXT,
  points INTEGER,
  difficulty TEXT,
  category TEXT,
  local_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eco teams
CREATE TABLE eco_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES eco_teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Team messages
CREATE TABLE team_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES eco_teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Eco points history policies
CREATE POLICY "Users can view own points history" ON eco_points_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own points history" ON eco_points_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mission submissions policies
CREATE POLICY "Users can view own mission submissions" ON mission_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mission submissions" ON mission_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily tasks policies
CREATE POLICY "Users can view own daily tasks" ON daily_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily tasks" ON daily_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily tasks" ON daily_tasks FOR UPDATE USING (auth.uid() = user_id);

-- Location tasks policies
CREATE POLICY "Everyone can view location tasks" ON location_tasks FOR SELECT TO authenticated;
CREATE POLICY "Users can insert location tasks" ON location_tasks FOR INSERT TO authenticated;

-- Eco teams policies
CREATE POLICY "Users can view all teams" ON eco_teams FOR SELECT TO authenticated;
CREATE POLICY "Users can create teams" ON eco_teams FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Team members policies
CREATE POLICY "Users can view team members" ON team_members FOR SELECT TO authenticated;
CREATE POLICY "Users can join teams" ON team_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave teams" ON team_members FOR DELETE USING (auth.uid() = user_id);

-- Team messages policies
CREATE POLICY "Team members can view messages" ON team_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = team_messages.team_id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can send messages" ON team_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = team_messages.team_id 
      AND team_members.user_id = auth.uid()
    )
  );

-- ============================================
-- CREATE FUNCTIONS
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, mobile, date_of_birth, roblox_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'mobile',
    (NEW.raw_user_meta_data->>'date_of_birth')::DATE,
    NEW.raw_user_meta_data->>'roblox_id'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update age from date_of_birth
CREATE OR REPLACE FUNCTION update_age_from_dob()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.date_of_birth IS NOT NULL THEN
    NEW.age := EXTRACT(YEAR FROM AGE(NEW.date_of_birth));
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update level from eco_points
CREATE OR REPLACE FUNCTION update_level_from_points()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := FLOOR(NEW.eco_points / 50) + 1;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CREATE TRIGGERS
-- ============================================

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to auto-update age
CREATE TRIGGER update_profile_age
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_age_from_dob();

-- Trigger to auto-update level
CREATE TRIGGER update_profile_level
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_level_from_points();

-- ============================================
-- SCHEMA SETUP COMPLETE
-- ============================================