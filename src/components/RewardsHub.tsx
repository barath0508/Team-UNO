import React, { useState, useEffect } from 'react';
import { Trophy, Award, Users, Camera, Download } from 'lucide-react';
import { getUserBadges, getChallenges, submitChallenge } from '../lib/rewardsSystem';
import { getUserPoints } from '../lib/ecoPointsSystem';
import { supabase } from '../lib/supabase';

const RewardsHub: React.FC = () => {
  const [badges, setBadges] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const [userBadges, activeChallenges, points] = await Promise.all([
        getUserBadges(user.id),
        getChallenges(),
        getUserPoints(user.id)
      ]);
      setBadges(userBadges);
      setChallenges(activeChallenges);
      setUserPoints(points);
    }
  };

  const handleChallengeSubmit = async (challengeId: string) => {
    await submitChallenge(userId, challengeId);
    alert('Challenge submitted! Awaiting approval.');
  };

  const downloadCertificate = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    if (ctx) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#10b981';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ECO CHAMPION CERTIFICATE', 400, 150);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText(`${userPoints} Eco Points Achieved`, 400, 300);
      ctx.fillText('Keep Making a Difference!', 400, 400);
    }

    const link = document.createElement('a');
    link.download = 'eco-certificate.png';
    link.href = canvas.toDataURL();
    link.click();
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
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-medium backdrop-blur-sm">
              🏆 Achievements & Rewards
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Rewards
            </span>{' '}
            <span className="text-white">Hub</span>
          </h1>
          <p className="text-slate-300 text-lg">Celebrate your environmental achievements and unlock rewards</p>
        </div>

        {/* Points & Certificate */}
        <div className="glass rounded-2xl p-8 mb-8 border border-yellow-500/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-green-400">{userPoints} Points</h2>
              <p className="text-slate-400">Your eco impact score</p>
            </div>
            <button 
              onClick={downloadCertificate}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="glass rounded-2xl p-8 mb-8 border border-emerald-500/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-400" />
            Your Badges ({badges.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className="font-semibold text-sm">{badge.name}</h3>
                <p className="text-xs text-slate-400">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Challenges */}
        <div className="glass rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-blue-400" />
            Active Challenges
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-slate-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{challenge.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{challenge.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-semibold">+{challenge.points_reward} points</span>
                  <button 
                    onClick={() => handleChallengeSubmit(challenge.id)}
                    className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    {challenge.requires_proof ? 'Submit Proof' : 'Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsHub;