-- Daily tasks table
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 10,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User daily task completions
CREATE TABLE IF NOT EXISTS user_daily_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES daily_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- Enable RLS
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_completions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view daily tasks" ON daily_tasks FOR SELECT USING (true);
CREATE POLICY "Users can view own completions" ON user_daily_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON user_daily_completions FOR INSERT WITH CHECK (auth.uid() = user_id);