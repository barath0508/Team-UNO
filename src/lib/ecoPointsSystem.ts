import { supabase } from './supabase';

export const addPoints = async (userId: string, points: number, reason: string) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('eco_points')
    .eq('id', userId)
    .single();

  const newPoints = (profile?.eco_points || 0) + points;
  
  await supabase
    .from('profiles')
    .update({ eco_points: newPoints })
    .eq('id', userId);

  return newPoints;
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
  const { data } = await supabase
    .from('profiles')
    .select('eco_points')
    .eq('id', userId)
    .single();

  return data?.eco_points || 0;
};