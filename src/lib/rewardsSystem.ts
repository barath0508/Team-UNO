import { supabase } from './supabase';

export const checkAndAwardBadges = async (userId: string, currentPoints: number) => {
  const { data: badges } = await supabase
    .from('badges')
    .select('*')
    .lte('points_required', currentPoints);

  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);

  const earnedBadgeIds = userBadges?.map(ub => ub.badge_id) || [];
  const newBadges = badges?.filter(b => !earnedBadgeIds.includes(b.id)) || [];

  for (const badge of newBadges) {
    await supabase
      .from('user_badges')
      .insert({ user_id: userId, badge_id: badge.id });
  }

  return newBadges;
};

export const generateCertificate = async (userId: string, points: number) => {
  const milestones = [100, 500, 1000, 5000];
  const milestone = milestones.find(m => points >= m && points < m + 100);
  
  if (milestone) {
    await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        certificate_type: `${milestone}_points`,
        milestone_points: milestone
      });
    return milestone;
  }
  return null;
};

export const getUserBadges = async (userId: string) => {
  const { data } = await supabase
    .from('user_badges')
    .select('badges(*)')
    .eq('user_id', userId);

  return data?.map(ub => ub.badges) || [];
};

export const getChallenges = async () => {
  const { data } = await supabase
    .from('eco_challenges')
    .select('*')
    .eq('is_active', true);

  return data || [];
};

export const submitChallenge = async (userId: string, challengeId: string, proofUrl?: string) => {
  const { data } = await supabase
    .from('challenge_submissions')
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      proof_url: proofUrl
    })
    .select()
    .single();

  return data;
};