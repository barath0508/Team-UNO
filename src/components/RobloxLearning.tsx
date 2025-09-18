import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, ExternalLink, Trophy, Lock, Unlock } from 'lucide-react';
import { generateRobloxGameData } from '../lib/robloxIntegration';
import { supabase } from '../lib/supabase';

const RobloxLearning: React.FC = () => {
  const [gameData, setGameData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const data = await generateRobloxGameData(user.id);
      setGameData(data);
    }
    setLoading(false);
  };

  const gameAreas = [
    { name: 'Solar City', requiredPoints: 0, description: 'Learn about solar energy' },
    { name: 'Wind Valley', requiredPoints: 100, description: 'Explore wind power generation' },
    { name: 'Recycling Hub', requiredPoints: 200, description: 'Master waste management' },
    { name: 'Green Forest', requiredPoints: 300, description: 'Discover biodiversity' },
    { name: 'Ocean Cleanup', requiredPoints: 500, description: 'Save marine life' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Gamepad2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-blue-400 mb-4">Eco Learning Game</h2>
        <p className="text-slate-400 mb-6">Learn environmental science through interactive Roblox gameplay</p>
        
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{gameData?.ecoPoints || 0}</div>
              <div className="text-sm text-slate-400">Eco Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{gameData?.gameData.unlockedAreas || 0}</div>
              <div className="text-sm text-slate-400">Areas Unlocked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{gameData?.gameData.playerRank || 'Beginner'}</div>
              <div className="text-sm text-slate-400">Rank</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {gameAreas.map((area, index) => {
          const isUnlocked = (gameData?.ecoPoints || 0) >= area.requiredPoints;
          return (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-slate-800/50 border-blue-500/30 hover:border-blue-500/50'
                  : 'bg-slate-900/30 border-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${isUnlocked ? 'text-blue-400' : 'text-slate-500'}`}>
                  {area.name}
                </h3>
                {isUnlocked ? (
                  <Unlock className="w-6 h-6 text-green-400" />
                ) : (
                  <Lock className="w-6 h-6 text-slate-500" />
                )}
              </div>
              
              <p className={`mb-4 ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                {area.description}
              </p>
              
              {!isUnlocked && (
                <div className="text-sm text-slate-400 mb-4">
                  Requires {area.requiredPoints} eco points to unlock
                </div>
              )}
              
              <motion.button
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                disabled={!isUnlocked}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isUnlocked ? 'Play Area' : 'Locked'}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <motion.a
          href="https://www.roblox.com/games/your-game-id"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-full hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
        >
          <Gamepad2 className="w-6 h-6 mr-3" />
          Launch Roblox Game
          <ExternalLink className="w-5 h-5 ml-2" />
        </motion.a>
      </div>
    </div>
  );
};

export default RobloxLearning;