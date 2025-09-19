import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Trophy, Zap, CheckCircle } from 'lucide-react';

interface RewardsSystemProps {
  profile: any;
  onClaim: (rewardId: string) => void;
}

const RewardsSystem: React.FC<RewardsSystemProps> = ({ profile, onClaim }) => {
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const badges = [
    { id: 'starter', name: 'Eco Starter', icon: '🌱', points: 25, description: 'First steps into eco-consciousness' },
    { id: 'warrior', name: 'Eco Warrior', icon: '⚔️', points: 50, description: 'Fighting for the environment' },
    { id: 'protector', name: 'Nature Protector', icon: '🛡️', points: 100, description: 'Guardian of nature' },
    { id: 'guardian', name: 'Green Guardian', icon: '🌍', points: 200, description: 'Protecting our planet' },
    { id: 'master', name: 'Eco Master', icon: '👑', points: 500, description: 'Master of environmental action' }
  ];

  const rewards = [
    { id: 'tree', name: 'Plant a Tree Certificate', icon: '🌳', points: 100, type: 'certificate' },
    { id: 'discount', name: '10% Eco Store Discount', icon: '🏪', points: 150, type: 'discount' },
    { id: 'badge', name: 'Digital Badge Collection', icon: '🏅', points: 200, type: 'digital' },
    { id: 'experience', name: 'Nature Walk Experience', icon: '🥾', points: 300, type: 'experience' }
  ];

  const handleClaim = (rewardId: string) => {
    setClaimedRewards([...claimedRewards, rewardId]);
    onClaim(rewardId);
  };

  return (
    <div className="space-y-8">
      {/* Badges Section */}
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
          Achievement Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {badges.map((badge) => {
            const isUnlocked = profile.eco_points >= badge.points;
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative p-4 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                    : 'bg-slate-800/30 border-slate-700/50 opacity-60'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className={`font-bold text-sm ${isUnlocked ? 'text-yellow-400' : 'text-slate-500'}`}>
                  {badge.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">{badge.points} pts</div>
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Redeemable Rewards */}
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Gift className="w-6 h-6 mr-3 text-emerald-400" />
          Redeemable Rewards
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {rewards.map((reward) => {
            const canClaim = profile.eco_points >= reward.points;
            const isClaimed = claimedRewards.includes(reward.id);
            
            return (
              <motion.div
                key={reward.id}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-2xl border transition-all ${
                  canClaim && !isClaimed
                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/50'
                    : 'bg-slate-800/30 border-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{reward.icon}</div>
                    <div>
                      <div className="font-bold text-white">{reward.name}</div>
                      <div className="text-sm text-slate-400">{reward.points} points required</div>
                    </div>
                  </div>
                  {isClaimed && (
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      Claimed
                    </div>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClaim(reward.id)}
                  disabled={!canClaim || isClaimed}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    canClaim && !isClaimed
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                      : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isClaimed ? 'Claimed' : canClaim ? 'Claim Reward' : `Need ${reward.points - profile.eco_points} more points`}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Points Summary */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white mb-2">Your Eco Points</div>
            <div className="text-slate-400">Keep earning to unlock more rewards!</div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-400">{profile.eco_points}</div>
            <div className="text-sm text-slate-400">Total Points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsSystem;