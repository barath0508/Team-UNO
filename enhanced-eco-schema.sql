-- Enhanced eco-points schema with rewards and social features

-- Badges system
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_required INTEGER DEFAULT 0,
  badge_type TEXT DEFAULT 'achievement' CHECK (badge_type IN ('achievement', 'milestone', 'seasonal')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eco teams
CREATE TABLE IF NOT EXISTS eco_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES eco_teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenges/Quests
CREATE TABLE IF NOT EXISTS eco_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  points_reward INTEGER DEFAULT 0,
  challenge_type TEXT DEFAULT 'daily' CHECK (challenge_type IN ('daily', 'weekly', 'seasonal', 'offline')),
  requires_proof BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User challenge submissions
CREATE TABLE IF NOT EXISTS challenge_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES eco_challenges(id) ON DELETE CASCADE,
  proof_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL,
  milestone_points INTEGER,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Login streaks
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_date DATE;

-- Insert default badges
INSERT INTO badges (name, description, icon, points_required, badge_type) VALUES
('Eco Starter', 'Welcome to the eco journey!', '🌱', 0, 'milestone'),
('Tree Hugger', 'Planted your first tree', '🌳', 25, 'achievement'),
('Recycling Pro', 'Recycled 10 items', '♻️', 100, 'achievement'),
('Water Saver', 'Saved 100L of water', '💧', 150, 'achievement'),
('Plastic-Free Pro', 'Completed plastic-free challenge', '🚫', 200, 'achievement'),
('Eco Champion', 'Reached 1000 points', '🏆', 1000, 'milestone'),
('Green Warrior', 'Reached 5000 points', '⚔️', 5000, 'milestone')
ON CONFLICT DO NOTHING;

-- Insert sample challenges
INSERT INTO eco_challenges (title, description, points_reward, challenge_type, requires_proof) VALUES
('Daily Water Save', 'Save water by taking shorter showers', 10, 'daily', FALSE),
('Plant a Sapling', 'Plant a tree or sapling in your area', 50, 'offline', TRUE),
('Plastic-Free Day', 'Go one day without using single-use plastic', 25, 'daily', FALSE),
('Community Cleanup', 'Organize or join a local cleanup drive', 100, 'offline', TRUE),
('Eco Photo Share', 'Share your eco-friendly action on social media', 15, 'weekly', TRUE)
ON CONFLICT DO NOTHING;