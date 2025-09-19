import { supabase } from './supabase';

export const addPoints = async (userId: string, points: number, reason: string) => {
  try {
    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('eco_points')
      .eq('id', userId)
      .maybeSingle();

    const currentPoints = profile?.eco_points || 0;
    const newTotal = currentPoints + points;

    // Update profile with new points (triggers level update automatically)
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        eco_points: newTotal
      }, {
        onConflict: 'id'
      });

    if (updateError) throw updateError;

    // Add to points history
    await supabase
      .from('eco_points_history')
      .insert({
        user_id: userId,
        points,
        reason
      });

    return newTotal;
  } catch (error) {
    console.log('Points save error:', error);
    // Fallback to localStorage
    const currentPoints = parseInt(localStorage.getItem(`eco_points_${userId}`) || '0');
    const newTotal = currentPoints + points;
    localStorage.setItem(`eco_points_${userId}`, newTotal.toString());
    
    // Store history in localStorage
    const history = JSON.parse(localStorage.getItem(`points_history_${userId}`) || '[]');
    history.push({ points, reason, date: new Date().toISOString() });
    localStorage.setItem(`points_history_${userId}`, JSON.stringify(history));
    
    return newTotal;
  }
};

export const getLeaderboard = async () => {
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, eco_points')
    .order('eco_points', { ascending: false })
    .limit(10);

  return data || [];
};

export const getUserPoints = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('eco_points, level')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return {
      points: data?.eco_points || 0,
      level: data?.level || 1
    };
  } catch (error) {
    console.log('Get points error:', error);
    const points = parseInt(localStorage.getItem(`eco_points_${userId}`) || '0');
    return {
      points,
      level: Math.floor(points / 50) + 1
    };
  }
};

export const getPointsHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('eco_points_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.log('Points history error:', error);
    return JSON.parse(localStorage.getItem(`points_history_${userId}`) || '[]');
  }
};