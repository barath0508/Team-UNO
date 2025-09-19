import { supabase } from './supabase';

export interface TeamMessage {
  id: string;
  team_id: string;
  user_id: string;
  message: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

export const createTeam = async (name: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('eco_teams')
      .insert({ name, created_by: userId })
      .select()
      .single();
    
    if (error) {
      console.error('Team creation error:', error);
      throw error;
    }
    
    // Add creator as member
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({ team_id: data.id, user_id: userId });
    
    if (memberError) {
      console.error('Member addition error:', memberError);
      throw memberError;
    }
    
    return data;
  } catch (error) {
    console.error('Create team service error:', error);
    throw error;
  }
};

export const joinTeam = async (teamId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('team_members')
      .insert({ team_id: teamId, user_id: userId });
    
    if (error) {
      console.error('Join team error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Join team service error:', error);
    throw error;
  }
};

export const getUserTeam = async (userId: string) => {
  const { data } = await supabase
    .from('team_members')
    .select('eco_teams(*)')
    .eq('user_id', userId)
    .single();
  
  return data?.eco_teams || null;
};

export const getTeamMessages = async (teamId: string) => {
  const { data, error } = await supabase
    .from('team_messages')
    .select(`
      *,
      profiles(full_name)
    `)
    .eq('team_id', teamId)
    .order('created_at', { ascending: true })
    .limit(50);
  
  if (error) throw error;
  return data;
};

export const sendTeamMessage = async (teamId: string, userId: string, message: string) => {
  const { data, error } = await supabase
    .from('team_messages')
    .insert({
      team_id: teamId,
      user_id: userId,
      message
    })
    .select(`
      *,
      profiles(full_name)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const subscribeToTeamMessages = (teamId: string, callback: (message: TeamMessage) => void) => {
  return supabase
    .channel(`team_messages:${teamId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'team_messages',
        filter: `team_id=eq.${teamId}`
      },
      async (payload) => {
        // Fetch the complete message with profile data
        const { data } = await supabase
          .from('team_messages')
          .select(`
            *,
            profiles(full_name)
          `)
          .eq('id', payload.new.id)
          .single();
        
        if (data) callback(data);
      }
    )
    .subscribe();
};