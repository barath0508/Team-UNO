import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Target, TrendingUp, MapPin, BookOpen, Leaf, Award, Users, Sparkles, Play, CheckCircle, Clock, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { getTodayTask } from '../lib/dailyTasks';
import { addPoints } from '../lib/ecoPointsSystem';
import LocationSetupModal from './LocationSetupModal';

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
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyTask, setDailyTask] = useState<any>(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    loadProfile();
    loadDailyTask();
  }, []);

  const loadDailyTask = async () => {
    try {
      const task = await getTodayTask();
      setDailyTask(task);
      
      // Check localStorage for completion
      const { data: { user } } = await supabase.auth.getUser();
      if (user && task) {
        const completionKey = `task_completed_${user.id}_${task.date}`;
        const completed = localStorage.getItem(completionKey) === 'true';
        setTaskCompleted(completed);
      }
    } catch (error) {
      console.log('Error loading daily task:', error);
    }
  };

  const startTimer = () => {
    if (dailyTask && !timerActive && !taskCompleted) {
      const minutes = dailyTask.timerMinutes || 5;
      setTimeLeft(minutes * 60);
      setTimerActive(true);
    }
  };

  const completeTask = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && dailyTask && !taskCompleted) {
      try {
        await addPoints(user.id, dailyTask.points, `Daily task: ${dailyTask.title}`);
        
        // Mark as completed in localStorage
        const completionKey = `task_completed_${user.id}_${dailyTask.date}`;
        localStorage.setItem(completionKey, 'true');
        
        setTaskCompleted(true);
        setTimerActive(false);
        loadProfile(); // Refresh points
      } catch (error) {
        console.log('Error completing task:', error);
        setTaskCompleted(true);
        setTimerActive(false);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
          // Check if first login
          if (!data.first_login_completed) {
            setShowLocationModal(true);
          }
        }
      } catch (error) {
        // Check localStorage for location data
        const locationData = localStorage.getItem(`location_${user.id}`);
        if (!locationData) {
          setShowLocationModal(true);
        }
        
        // Create basic profile with localStorage points
        const points = parseInt(localStorage.getItem(`eco_points_${user.id}`) || '0');
        setProfile({
          eco_points: points,
          level: Math.floor(points / 100) + 1,
          full_name: 'User',
          avatar_accessories: [],
          location: '',
          state: '',
          district: ''
        });
      }
    }
  };

  const [locationTasks] = useState([
    {
      id: 1,
      title: "Plant a Tree in Your Neighborhood",
      description: "Find a suitable spot and plant a sapling to contribute to local greenery",
      points: 50,
      difficulty: "Medium"
    },
    {
      id: 2,
      title: "Organize a Cleanup Drive",
      description: "Gather friends and clean up a local park or street",
      points: 75,
      difficulty: "Hard"
    },
    {
      id: 3,
      title: "Start Composting at Home",
      description: "Set up a simple composting system for kitchen waste",
      points: 30,
      difficulty: "Easy"
    }
  ]);

  if (!profile) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 bg-slate-950/80 backdrop-blur-md border-b border-emerald-500/20 p-6"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-20"
              />
              <Leaf className="w-8 h-8 text-emerald-400 relative z-10" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Green Spark
            </span>
          </motion.div>
          
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/rewards')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Rewards</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/teams')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-400 hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Teams</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome back, {profile.full_name}!
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              Level {profile.level}
            </span>{' '}
            <span className="text-white">Eco Warrior</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center items-center space-x-8 mb-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {profile.eco_points}
              </div>
              <div className="text-slate-400">Eco Points</div>
            </div>
            <div className="w-px h-12 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                #{Math.floor(Math.random() * 50) + 1}
              </div>
              <div className="text-slate-400">District Rank</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Daily Mission */}
        {dailyTask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className={`relative overflow-hidden border rounded-2xl p-8 mb-8 ${
              taskCompleted 
                ? 'bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-500/20'
                : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-emerald-500/20'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center">
                  <Target className="w-6 h-6 mr-3 text-emerald-400" />
                  Daily Mission
                  {taskCompleted && <CheckCircle className="w-6 h-6 ml-3 text-green-400" />}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  taskCompleted 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {taskCompleted ? 'Completed!' : `+${dailyTask.points} pts`}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{dailyTask.title}</h3>
              <p className="text-slate-300 mb-4">{dailyTask.description}</p>
              
              {/* Timer Display */}
              {timerActive && (
                <div className="flex items-center justify-center mb-4 p-4 bg-slate-800/50 rounded-lg">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-400">{formatTime(timeLeft)}</span>
                  <span className="ml-2 text-slate-400">remaining</span>
                </div>
              )}
              
              <div className="flex space-x-4">
                {!taskCompleted && !timerActive && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startTimer}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <Play className="w-5 h-5 mr-2" />Start Mission
                    </span>
                  </motion.button>
                )}
                
                {timerActive && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={completeTask}
                    className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />Complete Task
                    </span>
                  </motion.button>
                )}
                
                {taskCompleted && (
                  <motion.button
                    disabled
                    className="px-8 py-4 bg-green-500/20 text-green-400 font-semibold rounded-full cursor-not-allowed"
                  >
                    <span className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />Task Completed
                    </span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Quests */}
          <div className="lg:col-span-2">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="text-3xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
            >
              Your Active Quests
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex space-x-4 mb-8"
            >
              {['For You', 'Your Locality', 'Trending'].map((tab, index) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    index === 0 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </motion.div>

            <div className="space-y-6">
              {locationTasks.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative overflow-hidden bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold group-hover:text-emerald-400 transition-colors">{challenge.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-6 leading-relaxed">{challenge.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400 font-bold text-lg">+{challenge.points} points</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
                      >
                        Start Mission
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="relative overflow-hidden bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-emerald-400" />
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Your Impact
                  </span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="flex items-center">
                      <span className="text-2xl mr-3">💧</span>
                      <span>Water Saved</span>
                    </span>
                    <span className="font-bold text-blue-400">50L</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="flex items-center">
                      <span className="text-2xl mr-3">🌱</span>
                      <span>CO₂ Offset</span>
                    </span>
                    <span className="font-bold text-green-400">5kg</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="flex items-center">
                      <span className="text-2xl mr-3">♻️</span>
                      <span>Items Recycled</span>
                    </span>
                    <span className="font-bold text-yellow-400">10</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full mt-6 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                >
                  View Detailed Report →
                </motion.button>
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="relative overflow-hidden bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-yellow-500/30 transition-all group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Rankings
                  </span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                    <span>District Rank</span>
                    <span className="text-2xl font-bold text-yellow-400">#12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                    <span>State Rank</span>
                    <span className="text-2xl font-bold text-orange-400">#156</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/rewards')}
                  className="w-full mt-6 text-yellow-400 font-semibold hover:text-yellow-300 transition-colors"
                >
                  View Leaderboard →
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2 }}
              className="relative overflow-hidden bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Quick Actions
                  </span>
                </h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/eco-points')}
                    className="w-full p-3 bg-slate-800/30 rounded-lg text-left hover:bg-slate-700/30 transition-colors"
                  >
                    📊 View Eco Points
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/teams')}
                    className="w-full p-3 bg-slate-800/30 rounded-lg text-left hover:bg-slate-700/30 transition-colors"
                  >
                    👥 Join a Team
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full p-3 bg-slate-800/30 rounded-lg text-left hover:bg-slate-700/30 transition-colors"
                  >
                    🎯 Daily Quiz
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <LocationSetupModal 
        isOpen={showLocationModal}
        onComplete={() => {
          setShowLocationModal(false);
          loadProfile();
        }}
      />
    </div>
  );
};

export default Dashboard;