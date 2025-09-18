-- Create point_transactions table for tracking eco points
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  transaction_type TEXT DEFAULT 'earned' CHECK (transaction_type IN ('earned', 'spent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for point_transactions
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for point_transactions
CREATE POLICY "Users can view own transactions" ON point_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON point_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON point_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_eco_points ON profiles(eco_points DESC);

-- Create function to get leaderboard with ranking
CREATE OR REPLACE FUNCTION get_leaderboard_with_rank(
  filter_type TEXT DEFAULT 'global',
  filter_location TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  eco_points INTEGER,
  level INTEGER,
  location TEXT,
  state TEXT,
  district TEXT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.eco_points,
    p.level,
    p.location,
    p.state,
    p.district,
    ROW_NUMBER() OVER (ORDER BY p.eco_points DESC) as rank
  FROM profiles p
  WHERE 
    CASE 
      WHEN filter_type = 'state' AND filter_location IS NOT NULL THEN p.state = filter_location
      WHEN filter_type = 'district' AND filter_location IS NOT NULL THEN p.district = filter_location
      ELSE TRUE
    END
  ORDER BY p.eco_points DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;