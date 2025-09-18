import { supabase } from './supabase';

export const awardPoints = async (userId: string, points: number, reason: string) => {
  try {
    // Get current points
    const { data: profile } = await supabase
      .from('profiles')
      .select('eco_points, level')
      .eq('id', userId)
      .single();

    if (profile) {
      const newPoints = (profile.eco_points || 0) + points;
      const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points

      // Update profile with new points and level
      await supabase
        .from('profiles')
        .update({ 
          eco_points: newPoints,
          level: newLevel
        })
        .eq('id', userId);

      // Record the point transaction
      await supabase
        .from('point_transactions')
        .insert({
          user_id: userId,
          points,
          reason,
          transaction_type: 'earned'
        });

      return { success: true, newPoints, newLevel, leveledUp: newLevel > profile.level };
    }
  } catch (error) {
    console.error('Error awarding points:', error);
    return { success: false };
  }
};

export const getLeaderboard = async (type: 'global' | 'state' | 'district', location?: string) => {
  try {
    let query = supabase
      .from('profiles')
      .select('id, full_name, eco_points, level, location, state, district')
      .order('eco_points', { ascending: false })
      .limit(50);

    if (type === 'state' && location) {
      query = query.eq('state', location);
    } else if (type === 'district' && location) {
      query = query.eq('district', location);
    }

    const { data } = await query;
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const getUserRank = async (userId: string, type: 'global' | 'state' | 'district', location?: string) => {
  try {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('eco_points, state, district')
      .eq('id', userId)
      .single();

    if (!userProfile) return null;

    let query = supabase
      .from('profiles')
      .select('id')
      .gt('eco_points', userProfile.eco_points);

    if (type === 'state') {
      query = query.eq('state', userProfile.state);
    } else if (type === 'district') {
      query = query.eq('district', userProfile.district);
    }

    const { count } = await query;
    return (count || 0) + 1;
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
};