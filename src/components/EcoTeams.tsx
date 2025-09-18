import React, { useState, useEffect } from 'react';
import { Users, Plus, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EcoTeams: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Get user's team
      const { data: memberData } = await supabase
        .from('team_members')
        .select('eco_teams(*)')
        .eq('user_id', user.id)
        .single();

      if (memberData) setUserTeam(memberData.eco_teams);

      // Get all teams
      const { data: teamsData } = await supabase
        .from('eco_teams')
        .select('*, team_members(count)')
        .order('created_at', { ascending: false });

      setTeams(teamsData || []);
    }
  };

  const createTeam = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && teamName.trim()) {
      const { data: team } = await supabase
        .from('eco_teams')
        .insert({ name: teamName, created_by: user.id })
        .select()
        .single();

      if (team) {
        await supabase
          .from('team_members')
          .insert({ team_id: team.id, user_id: user.id });
        
        setShowCreateForm(false);
        setTeamName('');
        loadTeams();
      }
    }
  };

  const joinTeam = async (teamId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('team_members')
        .insert({ team_id: teamId, user_id: user.id });
      loadTeams();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Eco Teams</h1>

        {/* User's Team */}
        {userTeam && (
          <div className="bg-slate-900 rounded-lg p-6 mb-8 border-2 border-green-500">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-400" />
              Your Team: {userTeam.name}
            </h2>
            <p className="text-slate-400">Team up with friends to stay motivated!</p>
          </div>
        )}

        {/* Create Team */}
        {!userTeam && (
          <div className="bg-slate-900 rounded-lg p-6 mb-8">
            {!showCreateForm ? (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-3 bg-slate-800 rounded border border-slate-700"
                />
                <div className="space-x-2">
                  <button 
                    onClick={createTeam}
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                  >
                    Create
                  </button>
                  <button 
                    onClick={() => setShowCreateForm(false)}
                    className="bg-slate-600 px-4 py-2 rounded hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* All Teams */}
        <div className="bg-slate-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            All Teams
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="bg-slate-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{team.name}</h3>
                <p className="text-slate-400 text-sm mb-3">
                  {team.team_members?.[0]?.count || 0} members
                </p>
                {!userTeam && (
                  <button 
                    onClick={() => joinTeam(team.id)}
                    className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Join Team
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoTeams;