import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Target, TrendingUp, MapPin, BookOpen, Leaf, Award, Users, Sparkles, Play, CheckCircle, Clock, Pause, LogOut, Camera, Upload, BarChart3, Calendar, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { getTodayTask } from '../lib/dailyTasks';
import { addPoints } from '../lib/ecoPointsSystem';
import FirstTimeSetup from './FirstTimeSetup';
import { getCurrentLocation, generateLocationTasks } from '../lib/locationTasks';
import RobloxLearning from './RobloxLearning';

interface Profile {
  eco_points: number;
  level: number;
  full_name: string;
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
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('act');

  useEffect(() => {
    loadProfile();
    loadDailyTask();
    loadLocationTasks();
  }, []);

  const loadLocationTasks = async () => {
    setLoadingTasks(true);
    try {
      // Get GPS location
      const coordinates = await getCurrentLocation();
      
      // Get user profile for location and age
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let location = 'Unknown';
        let age = 18;
        
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('location, age')
            .eq('id', user.id)
            .single();
          
          location = profile?.location || 'Unknown';
          age = profile?.age || 18;
        } catch (dbError) {
          // Database table doesn't exist, use localStorage fallback
          const setupData = localStorage.getItem(`setup_${user.id}`);
          if (setupData) {
            const parsed = JSON.parse(setupData);
            location = parsed.location || 'Unknown';
            age = parsed.age || 18;
          }
        }
        
        // Generate AI tasks based on location and age
        const tasks = await generateLocationTasks(location, age, coordinates);
        setLocationTasks(tasks.map((task, index) => ({ ...task, id: index + 1 })));
      }
    } catch (error) {
      console.log('Location access denied or failed, using default tasks');
      // Fallback to default tasks
      setLocationTasks([
        {
          id: 1,
          title: "Plant a Tree in Your Area",
          description: "Find a suitable spot and plant a sapling",
          points: 50,
          difficulty: "Medium",
          category: "nature"
        },
        {
          id: 2,
          title: "Organize Neighborhood Cleanup",
          description: "Clean up a local park or street with friends",
          points: 75,
          difficulty: "Hard",
          category: "waste"
        },
        {
          id: 3,
          title: "Start Home Composting",
          description: "Set up composting for kitchen waste",
          points: 30,
          difficulty: "Easy",
          category: "waste"
        }
      ]);
    }
    setLoadingTasks(false);
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitMissionProof = async () => {
    if (!selectedMission || !proofImage) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const submissionData = {
        user_id: user.id,
        mission_id: selectedMission.id,
        mission_title: selectedMission.title,
        proof_image: proofImage,
        status: 'pending',
        submitted_at: new Date().toISOString()
      };
      
      // Store in localStorage as fallback
      const submissions = JSON.parse(localStorage.getItem('mission_submissions') || '[]');
      submissions.push(submissionData);
      localStorage.setItem('mission_submissions', JSON.stringify(submissions));
      
      setSelectedMission(null);
      setProofImage('');
      alert('Mission submitted for verification!');
    }
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
            setShowFirstTimeSetup(true);
          }
          return;
        }
      } catch (error) {
        // Database table doesn't exist or other error, continue with localStorage
      }
      
      // Check localStorage for setup data
      const setupData = localStorage.getItem(`setup_${user.id}`);
      if (!setupData) {
        setShowFirstTimeSetup(true);
      }
      
      // Create basic profile with localStorage points
      const points = parseInt(localStorage.getItem(`eco_points_${user.id}`) || '0');
      const setup = setupData ? JSON.parse(setupData) : {};
      
      setProfile({
        eco_points: points,
        level: Math.floor(points / 100) + 1,
        full_name: setup.name || 'User',
        location: setup.location || '',
        state: setup.state || '',
        district: setup.district || ''
      });
    }
  };

  const [locationTasks, setLocationTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [proofImage, setProofImage] = useState<string>('');

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
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-full text-red-400 hover:from-red-500/30 hover:to-pink-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
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
                {profile.level}
              </div>
              <div className="text-slate-400">Current Level</div>
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

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-3 gap-6 mb-8"
        >
          {[
            { id: 'learn', icon: BookOpen, title: 'Learn', color: 'blue' },
            { id: 'act', icon: Target, title: 'Act', color: 'emerald' },
            { id: 'impact', icon: TrendingUp, title: 'Impact', color: 'purple' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`p-8 rounded-2xl border transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-br from-${tab.color}-500/20 to-${tab.color}-600/20 border-${tab.color}-500/50`
                  : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-700/50'
              }`}
            >
              <tab.icon className={`w-12 h-12 mx-auto mb-4 ${
                activeTab === tab.id ? `text-${tab.color}-400` : 'text-slate-400'
              }`} />
              <h3 className={`text-xl font-bold ${
                activeTab === tab.id ? `text-${tab.color}-400` : 'text-slate-300'
              }`}>
                {tab.title}
              </h3>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="w-full">
          <div className="w-full">
            {activeTab === 'act' && (
              <div className="space-y-8">
                {/* Act Tab Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                    Take Action for the Planet
                  </h2>
                  <p className="text-slate-400 text-lg">Complete missions to earn points and make real environmental impact</p>
                </motion.div>

                {/* Mission Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-emerald-400 mb-2">{locationTasks.length}</div>
                    <div className="text-slate-300">Available Missions</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-blue-400 mb-2">{taskCompleted ? 1 : 0}</div>
                    <div className="text-slate-300">Completed Today</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-yellow-400 mb-2">{profile.eco_points}</div>
                    <div className="text-slate-300">Total Points</div>
                  </motion.div>
                </div>

                {/* Mission Categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-4 mb-8 justify-center"
                >
                  {['For You', 'Your Locality', 'Trending', 'Quick Wins'].map((subtab, index) => (
                    <motion.button
                      key={subtab}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-full font-semibold transition-all ${
                        index === 0 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
                      }`}
                    >
                      {subtab}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Missions Grid - Full Width */}
                {loadingTasks ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-2">Generating Personalized Missions</h3>
                    <p className="text-slate-400">Using AI to create tasks based on your location and preferences...</p>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {locationTasks.map((challenge, index) => (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="group relative overflow-hidden bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-all h-full flex flex-col"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <span className="text-2xl">{challenge.category === 'nature' ? '🌱' : challenge.category === 'water' ? '💧' : '♻️'}</span>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold group-hover:text-emerald-400 transition-colors">{challenge.title}</h3>
                                <div className="text-sm text-slate-400 capitalize">{challenge.category} Mission</div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                          <p className="text-slate-300 mb-4 leading-relaxed flex-grow">{challenge.description}</p>
                          {challenge.localContext && (
                            <div className="bg-slate-800/30 rounded-lg p-3 mb-4">
                              <div className="text-sm text-slate-400 mb-1">Why this matters locally:</div>
                              <div className="text-sm text-slate-300">{challenge.localContext}</div>
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-auto">
                            <div className="flex items-center space-x-4">
                              <span className="text-emerald-400 font-bold text-lg">+{challenge.points} points</span>
                              <span className="text-slate-400 text-sm">• 15-30 min</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedMission(challenge)}
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
                            >
                              Start Mission
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'learn' && (
              <div className="space-y-8">
                {/* Learn Tab Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                    Interactive Learning Hub
                  </h2>
                  <p className="text-slate-400 text-lg">Learn environmental science through immersive gameplay and interactive content</p>
                </motion.div>

                {/* Learning Progress Overview */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { icon: '🎮', label: 'Game Areas', value: `${Math.floor(profile.eco_points / 100)}/5`, color: 'blue', desc: 'Unlocked with points' },
                    { icon: '📚', label: 'Lessons', value: `${Math.floor(profile.eco_points / 50)}`, color: 'purple', desc: 'Based on progress' },
                    { icon: '🏆', label: 'Current Level', value: `${profile.level}`, color: 'green', desc: 'Eco warrior rank' },
                    { icon: '⏱️', label: 'Total Points', value: `${profile.eco_points}`, color: 'orange', desc: 'Lifetime earned' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative overflow-hidden bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3">{stat.icon}</div>
                        <div className={`text-2xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
                        <div className="font-semibold text-white mb-1 text-sm">{stat.label}</div>
                        <div className="text-xs text-slate-400">{stat.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Full-Screen Learning Content */}
                <div className="w-full">
                  <RobloxLearning />
                </div>

                {/* Learning Progress & Achievements Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* Enhanced Progress Tracking */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
                  >
                    <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
                      <BarChart3 className="w-7 h-7 mr-3" />
                      Learning Progress
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-3">
                          <span className="text-lg font-semibold">Current Level</span>
                          <span className="text-lg font-bold text-blue-400">Level {profile.level}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" style={{width: `${Math.min((profile.level / 10) * 100, 100)}%`}} />
                        </div>
                        <div className="text-sm text-slate-400 mt-2">Progress to Level {Math.min(profile.level + 1, 10)}</div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-3">
                          <span className="text-lg font-semibold">Game Areas Unlocked</span>
                          <span className="text-lg font-bold text-green-400">{Math.floor(profile.eco_points / 100)}/5</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500" style={{width: `${Math.min((Math.floor(profile.eco_points / 100) / 5) * 100, 100)}%`}} />
                        </div>
                        <div className="text-sm text-slate-400 mt-2">{100 - (profile.eco_points % 100)} points to next area</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Achievements */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
                  >
                    <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center">
                      <Award className="w-7 h-7 mr-3" />
                      Learning Achievements
                    </h3>
                    <div className="space-y-4">
                      {[
                        { icon: '🌱', title: 'Eco Beginner', desc: 'Started environmental journey', unlocked: profile.eco_points >= 0 },
                        { icon: '💧', title: 'Water Warrior', desc: 'Learned water conservation', unlocked: profile.eco_points >= 50 },
                        { icon: '♻️', title: 'Recycling Pro', desc: 'Mastered waste management', unlocked: profile.eco_points >= 100 },
                        { icon: '⚡', title: 'Energy Expert', desc: 'Understood renewable energy', unlocked: profile.eco_points >= 200 }
                      ].map((badge) => (
                        <div key={badge.title} className={`flex items-center p-4 rounded-xl transition-all ${
                          badge.unlocked 
                            ? 'bg-slate-800/50 border border-green-500/30' 
                            : 'bg-slate-800/20 border border-slate-700/30 opacity-50'
                        }`}>
                          <div className={`text-3xl mr-4 ${badge.unlocked ? '' : 'grayscale'}`}>{badge.icon}</div>
                          <div className="flex-grow">
                            <div className={`font-semibold ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>{badge.title}</div>
                            <div className={`text-sm ${badge.unlocked ? 'text-slate-300' : 'text-slate-600'}`}>{badge.desc}</div>
                          </div>
                          {badge.unlocked && <CheckCircle className="w-6 h-6 text-green-400" />}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
            
            {activeTab === 'impact' && (
              <div className="space-y-8">
                {/* Impact Overview Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
                    Your Environmental Impact
                  </h2>
                  <p className="text-slate-400 text-lg">Track your positive contribution to the planet</p>
                </motion.div>

                {/* Impact Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { icon: '💧', label: 'Water Saved', value: `${Math.floor(profile.eco_points * 0.5)}L`, color: 'blue', desc: 'Based on completed missions' },
                    { icon: '🌱', label: 'CO₂ Offset', value: `${Math.floor(profile.eco_points * 0.02)}kg`, color: 'green', desc: 'Environmental impact' },
                    { icon: '♻️', label: 'Items Recycled', value: `${Math.floor(profile.eco_points / 10)}`, color: 'yellow', desc: 'Waste diverted from landfill' },
                    { icon: '⚡', label: 'Energy Saved', value: `${Math.floor(profile.eco_points * 0.1)}kWh`, color: 'purple', desc: 'Power conservation' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative overflow-hidden bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3">{stat.icon}</div>
                        <div className={`text-2xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
                        <div className="font-semibold text-white mb-1 text-sm">{stat.label}</div>
                        <div className="text-xs text-slate-400">{stat.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Rankings & Achievements */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Rankings */}
                    <div className="relative overflow-hidden bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-yellow-500/30 transition-all group">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center">
                          <Trophy className="w-7 h-7 mr-3 text-yellow-400" />
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            Your Rankings
                          </span>
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl">
                            <div>
                              <div className="font-semibold">Current Level</div>
                              <div className="text-sm text-slate-400">Eco Warrior Status</div>
                            </div>
                            <span className="text-3xl font-bold text-yellow-400">{profile.level}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl">
                            <div>
                              <div className="font-semibold">Total Points</div>
                              <div className="text-sm text-slate-400">Lifetime Achievement</div>
                            </div>
                            <span className="text-3xl font-bold text-orange-400">{profile.eco_points}</span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => navigate('/rewards')}
                          className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
                        >
                          View Rewards →
                        </motion.button>
                      </div>
                    </div>

                    {/* Recent Achievements */}
                    <div className="relative overflow-hidden bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <Award className="w-6 h-6 mr-3 text-emerald-400" />
                          Recent Achievements
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center p-3 bg-slate-800/30 rounded-lg">
                            <span className="text-2xl mr-3">🌱</span>
                            <div>
                              <div className="font-semibold text-sm">Tree Hugger</div>
                              <div className="text-xs text-slate-400">Planted your first tree</div>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-slate-800/30 rounded-lg">
                            <span className="text-2xl mr-3">♻️</span>
                            <div>
                              <div className="font-semibold text-sm">Recycling Pro</div>
                              <div className="text-xs text-slate-400">Recycled 10 items</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Progress & Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-6"
                  >
                    {/* Monthly Progress */}
                    <div className="relative overflow-hidden bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <Calendar className="w-6 h-6 mr-3 text-blue-400" />
                          This Month's Progress
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">Daily Task</span>
                              <span className="text-sm font-semibold">{taskCompleted ? 'Completed' : 'Pending'}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className={`h-2 rounded-full ${taskCompleted ? 'bg-green-500 w-full' : 'bg-blue-500 w-0'}`} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">Next Level Progress</span>
                              <span className="text-sm font-semibold">{profile.eco_points % 100}/100</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(profile.eco_points % 100)}%`}} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="relative overflow-hidden bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <Zap className="w-6 h-6 mr-3 text-purple-400" />
                          Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => navigate('/eco-points')}
                            className="p-4 bg-slate-800/30 rounded-xl text-center hover:bg-slate-700/30 transition-colors"
                          >
                            <div className="text-2xl mb-2">📊</div>
                            <div className="text-sm font-semibold">Eco Points</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => navigate('/teams')}
                            className="p-4 bg-slate-800/30 rounded-xl text-center hover:bg-slate-700/30 transition-colors"
                          >
                            <div className="text-2xl mb-2">👥</div>
                            <div className="text-sm font-semibold">Teams</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveTab('learn')}
                            className="p-4 bg-slate-800/30 rounded-xl text-center hover:bg-slate-700/30 transition-colors"
                          >
                            <div className="text-2xl mb-2">🎮</div>
                            <div className="text-sm font-semibold">Play Game</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveTab('act')}
                            className="p-4 bg-slate-800/30 rounded-xl text-center hover:bg-slate-700/30 transition-colors"
                          >
                            <div className="text-2xl mb-2">🎯</div>
                            <div className="text-sm font-semibold">Missions</div>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
      
      <FirstTimeSetup 
        isOpen={showFirstTimeSetup}
        onComplete={() => {
          setShowFirstTimeSetup(false);
          loadProfile();
        }}
      />
      
      {/* Mission Verification Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700"
          >
            <div className="text-center mb-6">
              <Camera className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Submit Proof</h2>
              <p className="text-slate-400">{selectedMission.title}</p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                {proofImage ? (
                  <img src={proofImage} alt="Proof" className="w-full h-32 object-cover rounded-lg mb-4" />
                ) : (
                  <div className="py-8">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400">Upload photo proof</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="proof-upload"
                />
                <label
                  htmlFor="proof-upload"
                  className="inline-block bg-slate-800 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  Choose Photo
                </label>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedMission(null);
                  setProofImage('');
                }}
                className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={submitMissionProof}
                disabled={!proofImage}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;