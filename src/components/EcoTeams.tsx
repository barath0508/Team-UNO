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
    <div className="min-h-screen bg-slate-950 text-white p-6 relative overflow-hidden">
      {/* Animated background elements - matching Hero */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm">
              👥 Collaboration & Community
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
              Eco
            </span>{' '}
            <span className="text-white">Teams</span>
          </h1>
          <p className="text-slate-300 text-lg">Join forces with fellow eco-warriors to amplify your impact</p>
        </div>

        {/* User's Team */}
        {userTeam && (
          <div className="glass rounded-2xl p-8 mb-8 border-2 border-green-500/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-400" />
              Your Team: {userTeam.name}
            </h2>
            <p className="text-slate-400">Team up with friends to stay motivated!</p>
          </div>
        )}

        {/* Create Team */}
        {!userTeam && (
          <div className="glass rounded-2xl p-8 mb-8 border border-emerald-500/20">
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
        <div className="glass rounded-2xl p-8 border border-blue-500/20">
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