import { supabase } from './supabase';

export const generateRobloxGameData = async (userId: string) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('eco_points, level, location')
      .eq('id', userId)
      .single();

    return {
      userId,
      ecoPoints: profile?.eco_points || 0,
      level: profile?.level || 1,
      location: profile?.location || 'Unknown',
      gameData: {
        unlockedAreas: Math.floor((profile?.eco_points || 0) / 25),
        availableItems: getUnlockedItems(profile?.eco_points || 0),
        playerRank: getRankFromPoints(profile?.eco_points || 0)
      }
    };
  } catch (error) {
    return {
      userId,
      ecoPoints: 0,
      level: 1,
      location: 'Unknown',
      gameData: { unlockedAreas: 0, availableItems: [], playerRank: 'Beginner' }
    };
  }
};

const getUnlockedItems = (points: number) => {
  const items = [];
  if (points >= 25) items.push('Solar Panel');
  if (points >= 50) items.push('Wind Turbine');
  if (points >= 100) items.push('Recycling Plant');
  if (points >= 200) items.push('Green House');
  if (points >= 500) items.push('Eco Laboratory');
  return items;
};

const getRankFromPoints = (points: number) => {
  if (points >= 500) return 'Eco Master';
  if (points >= 200) return 'Green Guardian';
  if (points >= 100) return 'Nature Protector';
  if (points >= 50) return 'Eco Warrior';
  if (points >= 25) return 'Eco Explorer';
  return 'Beginner';
};

export const syncRobloxProgress = async (userId: string, gameProgress: any) => {
  try {
    // Store Roblox game progress
    localStorage.setItem(`roblox_progress_${userId}`, JSON.stringify({
      ...gameProgress,
      lastSync: new Date().toISOString()
    }));
    
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};