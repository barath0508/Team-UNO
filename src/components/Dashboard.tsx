import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Target, TrendingUp, MapPin, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Profile {
  eco_points: number;
  level: number;
  full_name: string;
  avatar_accessories: string[];
  location: string;
  state: string;
  district: string;
}

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyAction, setDailyAction] = useState({
    title: "🌱 Your Daily Mission: Read a 2-minute tip on saving water",
    points: 10
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) setProfile(data);
    }
  };

  const [challenges, setChallenges] = useState([]);
  const [locationTasks, setLocationTasks] = useState([]);

  const loadLocationTasks = async () => {
    if (profile?.location) {
      const { data } = await supabase
        .from('location_tasks')
        .select('*')
        .eq('location', profile.location)
        .eq('is_active', true)
        .limit(3);
      
      if (data) setLocationTasks(data);
    }
  };

  useEffect(() => {
    if (profile) {
      loadLocationTasks();
    }
  }, [profile]);

  if (!profile) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center relative">
              <User className="w-8 h-8" />
              {profile.avatar_accessories?.map((acc, i) => (
                <span key={i} className="absolute text-lg">{acc}</span>
              ))}
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile.full_name}</h1>
              <p className="text-emerald-400">Level {profile.level} Sapling</p>
              <div className="w-32 bg-slate-700 rounded-full h-2 mt-1">
                <div className="bg-emerald-500 h-2 rounded-full w-3/4" />
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">{profile.eco_points}</div>
            <div className="text-sm text-slate-400">Prakriti Points</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Daily Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold mb-2">Daily Action</h2>
          <p className="text-slate-300 mb-4">{dailyAction.title}</p>
          <div className="flex justify-between items-center">
            <span className="text-emerald-400 font-semibold">Reward: {dailyAction.points} pts</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Start Mission
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Quests */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Your Active Quests</h2>
            
            <div className="flex space-x-4 mb-6">
              {['For You', 'Your Locality', 'Trending'].map((tab, index) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    index === 0 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {locationTasks.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-4">{challenge.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-semibold">{challenge.points} points</span>
                    <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
                      Start Mission
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Widget */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                Your Impact
              </h3>
              <div className="space-y-3 text-sm">
                <div>💧 Saved 50L of water</div>
                <div>🌱 Offset 5kg of CO₂</div>
                <div>♻️ Recycled 10 items</div>
              </div>
              <button className="text-emerald-400 text-sm mt-4 hover:underline">
                View Detailed Report →
              </button>
            </div>

            {/* Leaderboard */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Leaderboard
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>District Rank:</span>
                  <span className="text-emerald-400">#12</span>
                </div>
                <div className="flex justify-between">
                  <span>State Rank:</span>
                  <span className="text-emerald-400">#156</span>
                </div>
              </div>
              <button className="text-emerald-400 text-sm mt-4 hover:underline">
                See More →
              </button>
            </div>

            {/* Learn Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                Learn
              </h3>
              <div className="space-y-3 text-sm">
                <div>Continue: Waste Management</div>
                <div>Try: Quiz of the Day</div>
              </div>
              <button className="text-blue-400 text-sm mt-4 hover:underline">
                Explore Lessons →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;