# Eco Points System

## Features
- User-specific point storage in Supabase database
- Real-time leaderboard showing top 10 users
- Quick action buttons to award points
- Automatic database updates

## Database Setup
Run the SQL in `database-setup.sql` in your Supabase SQL editor:
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS eco_points INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_profiles_eco_points ON profiles(eco_points DESC);
```

## Usage
1. Navigate to `/eco-points` route
2. View your current points
3. Use quick action buttons to add points
4. Check leaderboard to see rankings

## API Functions
- `addPoints(userId, points, reason)` - Add points to user
- `getUserPoints(userId)` - Get user's current points
- `getLeaderboard()` - Get top 10 users by points