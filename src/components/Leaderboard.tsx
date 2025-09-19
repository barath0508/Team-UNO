import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, MapPin, Globe, Building, Star } from 'lucide-react';
import { getLeaderboard, getUserRank } from '../lib/ecoPoints';
import { supabase } from '../lib/supabase';

const getGrade = (points: number): { grade: string; color: string; bgColor: string } => {
  if (points >= 1000) return { grade: 'A+', color: 'text-purple-400', bgColor: 'bg-purple-500/20' };
  if (points >= 750) return { grade: 'A', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
  if (points >= 500) return { grade: 'B+', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' };
  if (points >= 300) return { grade: 'B', color: 'text-green-400', bgColor: 'bg-green-500/20' };
  if (points >= 150) return { grade: 'C+', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
  if (points >= 75) return { grade: 'C', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
  return { grade: 'D', color: 'text-red-400', bgColor: 'bg-red-500/20' };
};

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'state' | 'district'>('global');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setUserProfile(profile);

      const location = activeTab === 'state' ? profile?.state : profile?.district;
      const data = await getLeaderboard(activeTab, location);
      const rank = await getUserRank(user.id, activeTab, location);
      
      setLeaderboardData(data);
      setUserRank(rank);
    }
    
    setLoading(false);
  };

  const getRankIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (position === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (position === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">{position}</span>;
  };

  const tabs = [
    { id: 'global', label: 'Global', icon: Globe },
    { id: 'state', label: 'State', icon: MapPin },
    { id: 'district', label: 'District', icon: Building }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Eco Warriors Leaderboard
          </h1>
          <p className="text-slate-400">See how you rank among environmental champions</p>
        </motion.div>

        {/* User Rank Card */}
        {userProfile && userRank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-lg">
                  #{userRank}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{userProfile.full_name}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-emerald-400 font-medium">Level {userProfile.level}</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${getGrade(userProfile.eco_points).bgColor} ${getGrade(userProfile.eco_points).color}`}>
                      Grade {getGrade(userProfile.eco_points).grade}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">{userProfile.eco_points}</div>
                <div className="text-sm text-slate-400">Eco Points</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {activeTab === 'global' ? 'Global Rankings' : 
                 activeTab === 'state' ? `${userProfile?.state} Rankings` : 
                 `${userProfile?.district} Rankings`}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Points</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>Level</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>Grade</span>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors ${
                    user.id === userProfile?.id ? 'bg-emerald-500/10' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(index + 1)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.full_name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-emerald-400">Level {user.level}</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${getGrade(user.eco_points).bgColor} ${getGrade(user.eco_points).color}`}>
                          {getGrade(user.eco_points).grade}
                        </div>
                        <span className="text-xs text-slate-500">• {user.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400 text-lg">{user.eco_points}</div>
                    <div className="text-xs text-slate-400">eco points</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;