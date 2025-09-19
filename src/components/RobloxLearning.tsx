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
    { name: 'Eco World', requiredPoints: 0, description: 'Learn about solar energy' },
    { name: 'Wind Valley', requiredPoints: 25, description: 'Explore wind power generation' },
    { name: 'Recycling Hub', requiredPoints: 50, description: 'Master waste management' },
    { name: 'Green Forest', requiredPoints: 100, description: 'Discover biodiversity' },
    { name: 'Ocean Cleanup', requiredPoints: 200, description: 'Save marine life' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-3xl blur-2xl" />
        <div className="relative glass rounded-3xl p-12 border border-blue-500/30">
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent"
          >
            🎮 Eco Learning Universe
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 mb-8 text-xl"
          >
            Embark on an epic environmental adventure through immersive gameplay
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl" />
            <div className="relative glass rounded-2xl p-8 border border-emerald-500/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">
                    {gameData?.ecoPoints || 0}
                  </div>
                  <div className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                    🎆 Eco Points
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="text-4xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">
                    {gameAreas.filter(area => (gameData?.ecoPoints || 0) >= area.requiredPoints).length}
                  </div>
                  <div className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                    🏝️ Areas Unlocked
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">
                    {(() => {
                      const points = gameData?.ecoPoints || 0;
                      if (points >= 500) return 'Eco Master';
                      if (points >= 200) return 'Green Guardian';
                      if (points >= 100) return 'Nature Protector';
                      if (points >= 50) return 'Eco Warrior';
                      return 'Beginner';
                    })()}
                  </div>
                  <div className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                    🏆 Current Rank
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gameAreas.map((area, index) => {
          const isUnlocked = (gameData?.ecoPoints || 0) >= area.requiredPoints;
          const areaIcons = ['☀️', '🌪️', '♻️', '🌳', '🌊'];
          const gradients = [
            'from-yellow-500/20 to-orange-500/20',
            'from-cyan-500/20 to-blue-500/20', 
            'from-green-500/20 to-emerald-500/20',
            'from-emerald-500/20 to-teal-500/20',
            'from-blue-500/20 to-purple-500/20'
          ];
          
          return (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
                isUnlocked
                  ? 'glass border-blue-500/30 group-hover:border-blue-500/50 shadow-2xl shadow-blue-500/10'
                  : 'bg-slate-900/30 border-slate-700/50 opacity-60'
              }`}>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <motion.div
                        animate={isUnlocked ? { 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 3, repeat: Infinity }}
                        className={`text-4xl mr-4 p-3 rounded-2xl ${
                          isUnlocked ? 'bg-blue-500/20' : 'bg-slate-800/30'
                        }`}
                      >
                        {areaIcons[index]}
                      </motion.div>
                      <h3 className={`text-2xl font-bold ${
                        isUnlocked ? 'text-white group-hover:text-blue-300' : 'text-slate-500'
                      } transition-colors`}>
                        {area.name}
                      </h3>
                    </div>
                    <motion.div
                      animate={isUnlocked ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isUnlocked ? (
                        <Unlock className="w-8 h-8 text-green-400" />
                      ) : (
                        <Lock className="w-8 h-8 text-slate-500" />
                      )}
                    </motion.div>
                  </div>
                  
                  <p className={`mb-6 text-lg leading-relaxed ${
                    isUnlocked ? 'text-slate-200 group-hover:text-white' : 'text-slate-500'
                  } transition-colors`}>
                    {area.description}
                  </p>
                  
                  {!isUnlocked && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass rounded-xl p-4 mb-6 border border-orange-500/30"
                    >
                      <div className="text-orange-400 font-semibold text-center">
                        🔒 Requires {area.requiredPoints} eco points to unlock
                      </div>
                      <div className="text-slate-400 text-sm text-center mt-2">
                        {Math.max(0, area.requiredPoints - (gameData?.ecoPoints || 0))} points needed
                      </div>
                    </motion.div>
                  )}
                  
                  {isUnlocked ? (
                    <div className="space-y-3">
                      <motion.a
  href="https://www.roblox.com/games/99201565048691/EcoWorld"
  target="_blank"
  rel="noopener noreferrer"
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className="block w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-center"
>
  🎮 Enter World
</motion.a>

                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="py-2 px-3 bg-slate-800/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700/50 transition-colors"
                        >
                          🎲 Mini-Game
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="py-2 px-3 bg-slate-800/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700/50 transition-colors"
                        >
                          🔍 AR View
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      disabled
                      className="w-full py-4 rounded-2xl font-bold text-lg bg-slate-700/50 text-slate-500 cursor-not-allowed transition-all duration-300"
                    >
                      🔒 Locked
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
        <div className="relative glass rounded-3xl p-12 border border-green-500/30">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
          >
            🚀 Ready for Adventure?
          </motion.h3>
          <motion.a
            href="https://www.roblox.com/games/your-game-id"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center px-12 py-6 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-bold rounded-3xl overflow-hidden shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative z-10 mr-4"
            >
              <Gamepad2 className="w-8 h-8" />
            </motion.div>
            <span className="relative z-10 text-2xl mr-4">
              Launch Eco Universe
            </span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10"
            >
              <ExternalLink className="w-6 h-6" />
            </motion.div>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default RobloxLearning;