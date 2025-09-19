import React, { useState, useEffect } from 'react';
import { Trophy, Plus } from 'lucide-react';
import { addPoints, getLeaderboard, getUserPoints } from '../lib/ecoPointsSystem';
import { checkAndAwardBadges, generateCertificate } from '../lib/rewardsSystem';
import { supabase } from '../lib/supabase';

const EcoPoints: React.FC = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const points = await getUserPoints(user.id);
      setUserPoints(points);
    }
    
    const leaders = await getLeaderboard();
    setLeaderboard(leaders);
  };

  const handleAddPoints = async (points: number, reason: string) => {
    if (userId) {
      const newPoints = await addPoints(userId, points, reason);
      setUserPoints(newPoints);
      
      // Check for new badges and certificates
      const newBadges = await checkAndAwardBadges(userId, newPoints);
      const certificate = await generateCertificate(userId, newPoints);
      
      if (newBadges.length > 0) {
        alert(`🎉 New badge earned: ${newBadges[0].name}!`);
      }
      if (certificate) {
        alert(`🏆 Certificate unlocked for ${certificate} points!`);
      }
      
      loadData(); // Refresh leaderboard
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
            <span className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm">
              🏆 Points & Achievements
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              Eco Points
            </span>{' '}
            <span className="text-white">System</span>
          </h1>
          <p className="text-slate-300 text-lg">Track your environmental impact and compete with others</p>
        </div>
        
        {/* User Points */}
        <div className="glass rounded-2xl p-8 mb-8 border border-emerald-500/20">
          <h2 className="text-xl font-semibold mb-4">Your Points</h2>
          <div className="text-3xl font-bold text-green-400">{userPoints}</div>
          
          {/* Quick Actions */}
          <div className="mt-4 space-x-2">
            <button 
              onClick={() => handleAddPoints(10, 'Recycled item')}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Recycle (+10)
            </button>
            <button 
              onClick={() => handleAddPoints(25, 'Planted tree')}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Plant Tree (+25)
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            Leaderboard
          </h2>
          <div className="space-y-2">
            {leaderboard.map((user, index) => (
              <div key={user.id} className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span>{user.full_name || 'Anonymous'}</span>
                </div>
                <span className="text-green-400 font-semibold">{user.eco_points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoPoints;