import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Target, TrendingUp, MapPin, BookOpen, Leaf, Award, Users, Sparkles, Play, CheckCircle, Clock, Pause, LogOut, Camera, Upload, Calendar, Zap, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { getTodayTask } from '../lib/dailyTasks';
import { addPoints } from '../lib/ecoPointsSystem';
import FirstTimeSetup from './FirstTimeSetup';
import { getCurrentLocation, generateLocationTasks } from '../lib/locationTasks';
import RobloxLearning from './RobloxLearning';
import Level1StubbleBurning from './Level1StubbleBurning';
import EnvironmentalLevelLesson from './EnvironmentalLevelLesson';
import QuizComponent from './QuizComponent';
import LearningContent from './LearningContent';

import StubbleBurningLesson from './StubbleBurningLesson';
import ProfileEditor from './ProfileEditor';
import NotificationCenter from './NotificationCenter';
import RewardsSystem from './RewardsSystem';
import SupportChat from './SupportChat';
import { verifyMissionWithAI } from '../lib/aiVerification';
import VerificationResult from './VerificationResult';
import VerificationHistory from './VerificationHistory';

interface Profile {
  eco_points: number;
  level: number;
  full_name: string;
  location: string;
  state: string;
  district: string;
  age?: number;
  date_of_birth?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyTask, setDailyTask] = useState<any>(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    loadProfile();
    loadDailyTask();
    loadLocationTasks();
  }, []);

  const loadLocationTasks = async () => {
    setLoadingTasks(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let age = 18;
        
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('age')
            .eq('id', user.id)
            .maybeSingle();
          
          if (!error && profile) {
            age = profile.age || 18;
          }
        } catch (dbError) {
          const setupData = localStorage.getItem(`setup_${user.id}`);
          if (setupData) {
            const parsed = JSON.parse(setupData);
            age = parsed.age || 18;
          }
        }
        
        const tasks = await generateLocationTasks('General', age);
        setLocationTasks(tasks.map((task, index) => ({ ...task, id: index + 1 })));
      }
    } catch (error) {
      setLocationTasks(getOfflineTasks());
    }
    setLoadingTasks(false);
  };

  const getOfflineTasks = () => {
    return [
      {
        id: 1,
        title: "Plant a Tree in Your Area",
        description: "Find a suitable spot and plant a sapling",
        points: 50,
        difficulty: "Medium",
        category: "nature",
        localContext: "Help green your local community"
      },
      {
        id: 2,
        title: "Organize Neighborhood Cleanup",
        description: "Clean up a local park or street with friends",
        points: 75,
        difficulty: "Hard",
        category: "waste",
        localContext: "Keep your area clean and beautiful"
      },
      {
        id: 3,
        title: "Start Home Composting",
        description: "Set up composting for kitchen waste",
        points: 30,
        difficulty: "Easy",
        category: "waste",
        localContext: "Reduce household waste effectively"
      }
    ];
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
        const newPoints = await addPoints(user.id, dailyTask.points, `Daily task: ${dailyTask.title}`);
        
        // Mark as completed in localStorage
        const completionKey = `task_completed_${user.id}_${dailyTask.date}`;
        localStorage.setItem(completionKey, 'true');
        
        setTaskCompleted(true);
        setTimerActive(false);
        
        // Update profile with new points
        if (profile) {
          setProfile({
            ...profile,
            eco_points: newPoints,
            level: Math.floor(newPoints / 50) + 1
          });
        }
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
    
    setVerifying(true);
    setVerificationResult(null);
    
    try {
      // AI Verification
      const aiResult = await verifyMissionWithAI(
        proofImage,
        selectedMission.title,
        selectedMission.description
      );
      
      setVerificationResult(aiResult);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const submissionData = {
          user_id: user.id,
          mission_id: selectedMission.id,
          mission_title: selectedMission.title,
          proof_image: proofImage,
          status: aiResult.verified && aiResult.confidence >= 70 ? 'approved' : 'pending',
          ai_verification: aiResult,
          submitted_at: new Date().toISOString()
        };
        
        // Store in localStorage as fallback
        const submissions = JSON.parse(localStorage.getItem('mission_submissions') || '[]');
        submissions.push(submissionData);
        localStorage.setItem('mission_submissions', JSON.stringify(submissions));
        
        // Auto-approve if AI confidence is high
        if (aiResult.verified && aiResult.confidence >= 70) {
          await addPoints(user.id, selectedMission.points, `Mission completed: ${selectedMission.title}`);
          setProfile(prev => prev ? {
            ...prev,
            eco_points: prev.eco_points + selectedMission.points
          } : null);
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        verified: false,
        confidence: 0,
        feedback: 'Verification failed. Your submission will be manually reviewed.'
      });
    }
    
    setVerifying(false);
  };

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.log('Profile query error:', error);
          throw error;
        }
        
        if (data) {
          const calculateAge = (dob: string) => {
            if (!dob) return 18;
            const today = new Date();
            const birthDate = new Date(dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            return age;
          };
          
          setProfile({
            ...data,
            age: data.date_of_birth ? calculateAge(data.date_of_birth) : 18
          });
          
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
        level: Math.floor(points / 50) + 1,
        full_name: setup.name || 'User',
        location: setup.location || '',
        state: setup.state || '',
        district: setup.district || '',
        age: setup.age || 18,
        date_of_birth: setup.date_of_birth
      });
    }
  };

  const [locationTasks, setLocationTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [proofImage, setProofImage] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Check connection status
  useEffect(() => {
    const checkConnection = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    };
    
    checkConnection();
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

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
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop" 
            alt="Nature background" 
            className="w-full h-full object-cover"
          />
        </div>
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
            {/* Profile Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowProfileEditor(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 rounded-full text-slate-300 hover:text-white transition-all"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {profile.full_name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm">{profile.full_name}</span>
            </motion.button>
            
            {/* Notifications */}
            <div className="relative">
              <NotificationCenter profile={profile} taskCompleted={taskCompleted} />
            </div>
            
            {/* Connection Status Indicator */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
              connectionStatus === 'online' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : connectionStatus === 'offline'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'online' ? 'bg-green-400' :
                connectionStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
              }`} />
              <span>{connectionStatus === 'online' ? 'Online' : connectionStatus === 'offline' ? 'Offline' : 'Checking'}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowRewards(!showRewards)}
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
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
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              Level {profile.level}
            </span>{' '}
            <span className="text-white">Eco Warrior</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center items-center space-x-12 mb-12"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-2xl bg-slate-900/30 border border-emerald-500/20 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2"
              >
                {profile.eco_points}
              </motion.div>
              <div className="text-slate-300 font-medium">Eco Points</div>
            </motion.div>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-2xl bg-slate-900/30 border border-yellow-500/20 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2"
              >
                {profile.level}
              </motion.div>
              <div className="text-slate-300 font-medium">Current Level</div>
            </motion.div>
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
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop" 
                alt="Environmental mission" 
                className="w-full h-full object-cover"
              />
            </div>
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {[
            { id: 'learn', icon: BookOpen, title: 'Learn', color: 'blue' },
            { id: 'act', icon: Target, title: 'Act', color: 'emerald' },
            { id: 'impact', icon: TrendingUp, title: 'Impact', color: 'purple' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + (tab.id === 'learn' ? 0 : tab.id === 'act' ? 0.1 : 0.2) }}
              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative p-10 rounded-3xl border transition-all duration-300 overflow-hidden group ${
                activeTab === tab.id
                  ? `bg-gradient-to-br from-${tab.color}-500/20 to-${tab.color}-600/20 border-${tab.color}-500/50 shadow-2xl shadow-${tab.color}-500/25`
                  : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-900/60'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <tab.icon className={`w-16 h-16 mx-auto mb-6 transition-colors duration-300 ${
                  activeTab === tab.id ? `text-${tab.color}-400` : 'text-slate-400 group-hover:text-slate-300'
                }`} />
              </motion.div>
              <h3 className={`text-2xl font-bold transition-colors duration-300 ${
                activeTab === tab.id ? `text-${tab.color}-400` : 'text-slate-300 group-hover:text-white'
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

                {/* Mission Stats - Real-time calculations */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-purple-400 mb-2">{Math.floor(profile.eco_points / 50) + 1}</div>
                    <div className="text-slate-300">Current Level</div>
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
                              Complete Mission
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
                {/* Level Selection - Real-time progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl" />
                  <div className="absolute inset-0 opacity-10 rounded-3xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&crop=center" 
                      alt="Forest background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 py-8">
                    <motion.div 
                      className="text-6xl mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      🌱
                    </motion.div>
                    <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Choose Your Learning Adventure
                    </h2>
                    <p className="text-slate-300 text-lg mb-8">Explore environmental topics and make a difference! 🌍</p>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const levelNames = ['Beginner', 'Explorer', 'Innovator', 'Expert', 'Master'];
                      const levelIcons = ['🌱', '🌿', '🌳', '🌍', '🌟'];
                      const levelTopics = ['Stubble Burning', 'Water Crisis', 'Pollinators', 'Climate Change', 'Plastic Pollution'];
                      // Real-time calculation based on user level
                      const userLevel = Math.floor(profile.eco_points / 50) + 1;
                      const isCompleted = level <= userLevel;
                      const isUnlocked = level <= userLevel || level === userLevel + 1;
                      
                      return (
                        <motion.div
                          key={level}
                          whileHover={{ 
                            scale: 1.08, 
                            y: -8,
                            rotateY: 5,
                            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedLevel(level)}
                          className={`relative p-6 rounded-2xl border transition-all cursor-pointer group ${
                            selectedLevel === level
                              ? 'glass border-blue-500/70 bg-blue-500/20 shadow-lg shadow-blue-500/25'
                              : 'glass border-blue-500/30 hover:border-blue-500/60'
                          }`}
                        >
                          {isCompleted && (
                            <motion.div 
                              className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <CheckCircle className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                          
                          <div className="text-center">
                            <motion.div 
                              className="text-4xl mb-2"
                              whileHover={{ scale: 1.3, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {levelIcons[level - 1]}
                            </motion.div>
                            <div className="text-2xl font-bold mb-1 text-blue-400">
                              {level}
                            </div>
                            <div className="text-xs font-medium text-slate-300 mb-1">
                              {levelNames[level - 1]}
                            </div>
                            <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                              {levelTopics[level - 1]}
                            </div>
                            
                            {selectedLevel === level && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-3 px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300 font-medium"
                              >
                                Active ✨
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Interactive Progress Bar - Real-time calculation */}
                {selectedLevel && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 glass rounded-2xl p-6 border border-emerald-500/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className="text-2xl"
                          animate={{ bounce: [0, -10, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          🏆
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-emerald-400">Learning Progress</h3>
                          <p className="text-sm text-slate-400">Level {selectedLevel} Journey</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {(() => {
                          const userLevel = Math.floor(profile.eco_points / 50) + 1;
                          const progressPercent = selectedLevel <= userLevel ? 100 : 
                            selectedLevel === userLevel + 1 ? ((profile.eco_points % 50) / 50) * 100 : 0;
                          return (
                            <>
                              <div className="text-2xl font-bold text-emerald-400">{Math.round(progressPercent)}%</div>
                              <div className="text-xs text-slate-400">Complete</div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(() => {
                            const userLevel = Math.floor(profile.eco_points / 50) + 1;
                            return selectedLevel <= userLevel ? 100 : 
                              selectedLevel === userLevel + 1 ? ((profile.eco_points % 50) / 50) * 100 : 0;
                          })()}%`
                        }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                      <span>📚 Learn</span>
                      <span>🧠 Quiz</span>
                      <span>🎆 Complete</span>
                    </div>
                  </motion.div>
                )}

                {/* Level Content */}
                {selectedLevel === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-8"
                  >
                    <Level1StubbleBurning />
                  </motion.div>
                )}

                {selectedLevel && selectedLevel > 1 && selectedLevel <= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-8"
                  >
                    <EnvironmentalLevelLesson level={selectedLevel} />
                  </motion.div>
                )}

                {/* Interactive Learning Tips */}
                {selectedLevel && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-2xl p-6 border border-blue-500/30 mb-8 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-5">
                      <img 
                        src="https://images.unsplash.com/photo-1497436072909-f5e4be1713d1?w=600&h=300&fit=crop" 
                        alt="Learning background" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-4">
                        <motion.div 
                          className="text-2xl"
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          💡
                        </motion.div>
                        <h3 className="font-bold text-blue-400">Learning Tips</h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          { icon: '📝', tip: 'Take notes while learning', color: 'text-yellow-400', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=60&fit=crop' },
                          { icon: '🤔', tip: 'Think about real examples', color: 'text-green-400', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=60&fit=crop' },
                          { icon: '💬', tip: 'Discuss with friends', color: 'text-blue-400', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=60&fit=crop' }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="relative flex items-center space-x-2 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-700/30 transition-all cursor-pointer overflow-hidden"
                          >
                            <div className="absolute inset-0 opacity-10">
                              <img src={item.img} alt={item.tip} className="w-full h-full object-cover" />
                            </div>
                            <div className="relative z-10 flex items-center space-x-2">
                              <span className="text-xl">{item.icon}</span>
                              <span className={`text-sm font-medium ${item.color}`}>{item.tip}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}



                {/* Interactive Learning */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center">
                      <span className="mr-2">🧠</span> Interactive Quiz
                    </h3>
                    <QuizComponent age={profile.age || 18} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-orange-400 flex items-center">
                      <span className="mr-2">📖</span> Learning Topics
                    </h3>
                    <LearningContent age={profile.age || 18} />
                  </div>
                </div>

                {/* Game Learning */}
                <div className="w-full">
                  <RobloxLearning />
                </div>
              </div>
            )}
            
            {activeTab === 'impact' && (
              <div className="space-y-8">
                {/* Impact Overview Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-emerald-500/10 rounded-3xl blur-2xl" />
                  <div className="relative glass rounded-3xl p-12 border border-purple-500/30">
                    <motion.div 
                      className="text-6xl mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      🌍
                    </motion.div>
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
                      Your Environmental Impact
                    </h2>
                    <p className="text-slate-300 text-xl mb-6">Track your positive contribution to the planet</p>
                    <div className="inline-flex items-center px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 font-semibold">
                      <Trophy className="w-5 h-5 mr-2" />
                      Level {Math.floor(profile.eco_points / 50) + 1} Eco Warrior
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Impact Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { icon: '💧', label: 'Water Saved', verified: Math.floor(profile.eco_points * 1.2), pending: Math.floor(profile.eco_points * 0.6), unit: 'L', color: 'blue', gradient: 'from-blue-500/20 to-cyan-500/20', img: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=120&fit=crop' },
                    { icon: '🌱', label: 'CO₂ Offset', verified: (profile.eco_points * 0.05).toFixed(1), pending: (profile.eco_points * 0.03).toFixed(1), unit: 'kg', color: 'green', gradient: 'from-green-500/20 to-emerald-500/20', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=120&fit=crop' },
                    { icon: '♻️', label: 'Items Recycled', verified: Math.floor(profile.eco_points / 8), pending: Math.floor(profile.eco_points / 12), unit: '', color: 'yellow', gradient: 'from-yellow-500/20 to-orange-500/20', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=120&fit=crop' },
                    { icon: '⚡', label: 'Energy Saved', verified: (profile.eco_points * 0.15).toFixed(1), pending: (profile.eco_points * 0.08).toFixed(1), unit: 'kWh', color: 'purple', gradient: 'from-purple-500/20 to-pink-500/20', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=120&fit=crop' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="relative group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="relative overflow-hidden glass border border-slate-700/50 group-hover:border-emerald-500/50 rounded-3xl p-8 transition-all duration-500">
                        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                          <img src={stat.img} alt={stat.label} className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-10 text-center">
                          <motion.div 
                            className="text-4xl mb-4 p-3 rounded-2xl bg-slate-800/30"
                            animate={index === 0 ? { 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            } : {}}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {stat.icon}
                          </motion.div>
                          <div className={`text-3xl font-bold text-${stat.color}-400 mb-3`}>
                            {stat.verified}{stat.unit}
                          </div>
                          <div className="font-semibold text-white mb-4 text-lg">{stat.label}</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-center text-sm bg-green-500/10 rounded-full px-3 py-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              <span className="text-green-400 font-medium">Verified: {stat.verified}{stat.unit}</span>
                            </div>
                            <div className="flex items-center justify-center text-sm bg-yellow-500/10 rounded-full px-3 py-1">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                              <span className="text-yellow-400 font-medium">Pending: {stat.pending}{stat.unit}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Environmental Impact Visualization */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative overflow-hidden glass rounded-3xl p-8 border border-emerald-500/30 mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
                      <span className="text-3xl mr-3">🌿</span>
                      <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Real-World Impact Equivalent
                      </span>
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-slate-800/30 rounded-2xl">
                        <div className="text-4xl mb-3">🌳</div>
                        <div className="text-2xl font-bold text-green-400 mb-2">
                          {Math.floor(profile.eco_points / 25)}
                        </div>
                        <div className="text-slate-300">Trees Worth of CO₂ Absorbed</div>
                      </div>
                      <div className="text-center p-6 bg-slate-800/30 rounded-2xl">
                        <div className="text-4xl mb-3">🏠</div>
                        <div className="text-2xl font-bold text-blue-400 mb-2">
                          {Math.floor(profile.eco_points / 100)}
                        </div>
                        <div className="text-slate-300">Homes Powered for a Day</div>
                      </div>
                      <div className="text-center p-6 bg-slate-800/30 rounded-2xl">
                        <div className="text-4xl mb-3">🚗</div>
                        <div className="text-2xl font-bold text-purple-400 mb-2">
                          {Math.floor(profile.eco_points * 0.5)}
                        </div>
                        <div className="text-slate-300">Miles of Car Emissions Offset</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Rankings & Achievements */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-6"
                  >
                    {/* Enhanced Rankings */}
                    <div className="relative overflow-hidden glass border border-yellow-500/30 rounded-3xl p-8 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-8 flex items-center">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                          >
                            <Trophy className="w-8 h-8 mr-4 text-yellow-400" />
                          </motion.div>
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            Your Rankings
                          </span>
                        </h3>
                        <div className="space-y-6">
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex justify-between items-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50"
                          >
                            <div>
                              <div className="font-bold text-lg">Current Level</div>
                              <div className="text-emerald-400 font-medium">
                                {(() => {
                                  const level = Math.floor(profile.eco_points / 50) + 1;
                                  if (level >= 10) return '🌟 Eco Master';
                                  if (level >= 7) return '🛡️ Green Guardian';
                                  if (level >= 5) return '🌳 Nature Protector';
                                  if (level >= 3) return '⚔️ Eco Warrior';
                                  return '🌱 Eco Beginner';
                                })()}
                              </div>
                            </div>
                            <span className="text-4xl font-bold text-yellow-400">{Math.floor(profile.eco_points / 50) + 1}</span>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex justify-between items-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50"
                          >
                            <div>
                              <div className="font-bold text-lg">Total Points</div>
                              <div className="text-slate-400">Lifetime Achievement</div>
                            </div>
                            <span className="text-4xl font-bold text-orange-400">{profile.eco_points}</span>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex justify-between items-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50"
                          >
                            <div>
                              <div className="font-bold text-lg">Next Level</div>
                              <div className="text-slate-400">Points needed</div>
                            </div>
                            <span className="text-3xl font-bold text-emerald-400">{50 - (profile.eco_points % 50)}</span>
                          </motion.div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/leaderboard')}
                          className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg shadow-yellow-500/25"
                        >
                          View Global Leaderboard 🏆
                        </motion.button>
                      </div>
                    </div>

                    {/* Enhanced Achievements */}
                    <div className="relative overflow-hidden glass border border-emerald-500/30 rounded-3xl p-8 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center">
                          <Award className="w-7 h-7 mr-3 text-emerald-400" />
                          Recent Achievements
                        </h3>
                        <div className="space-y-4">
                          {(() => {
                            const achievements = [];
                            if (profile.eco_points >= 25) achievements.push({ icon: '🌱', name: 'Eco Starter', desc: 'Earned first 25 points', color: 'text-green-400' });
                            if (profile.eco_points >= 50) achievements.push({ icon: '🏆', name: 'Level Up!', desc: 'Reached Level 2', color: 'text-yellow-400' });
                            if (profile.eco_points >= 100) achievements.push({ icon: '♻️', name: 'Recycling Pro', desc: 'Earned 100+ points', color: 'text-blue-400' });
                            if (profile.eco_points >= 200) achievements.push({ icon: '🌍', name: 'Planet Protector', desc: 'Earned 200+ points', color: 'text-purple-400' });
                            if (profile.eco_points >= 500) achievements.push({ icon: '🌟', name: 'Eco Master', desc: 'Earned 500+ points', color: 'text-pink-400' });
                            
                            return achievements.slice(-4).map((achievement, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-emerald-500/50 transition-all"
                              >
                                <span className="text-3xl mr-4">{achievement.icon}</span>
                                <div className="flex-1">
                                  <div className={`font-bold ${achievement.color}`}>{achievement.name}</div>
                                  <div className="text-sm text-slate-400">{achievement.desc}</div>
                                </div>
                                <div className="text-emerald-400 text-sm font-medium">✓ Unlocked</div>
                              </motion.div>
                            ));
                          })()}
                          {profile.eco_points < 25 && (
                            <div className="flex items-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 opacity-60">
                              <span className="text-3xl mr-4">🔒</span>
                              <div className="flex-1">
                                <div className="font-bold text-slate-400">Eco Starter</div>
                                <div className="text-sm text-slate-500">Earn 25 points to unlock</div>
                              </div>
                              <div className="text-slate-500 text-sm">{25 - profile.eco_points} points needed</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Progress & Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="space-y-6"
                  >
                    {/* Enhanced Monthly Progress */}
                    <div className="relative overflow-hidden glass border border-blue-500/30 rounded-3xl p-8 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center">
                          <Calendar className="w-7 h-7 mr-3 text-blue-400" />
                          Progress Tracker
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between mb-3">
                              <span className="font-semibold">Daily Task</span>
                              <span className={`font-bold ${taskCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
                                {taskCompleted ? '✅ Completed' : '⏳ Pending'}
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3">
                              <motion.div 
                                className={`h-3 rounded-full ${taskCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                                initial={{ width: 0 }}
                                animate={{ width: taskCompleted ? '100%' : '0%' }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-3">
                              <span className="font-semibold">Next Level Progress</span>
                              <span className="font-bold text-emerald-400">{profile.eco_points % 50}/50</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3">
                              <motion.div 
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${((profile.eco_points % 50) / 50) * 100}%` }}
                                transition={{ duration: 2, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Quick Actions */}
                    <div className="relative overflow-hidden glass border border-purple-500/30 rounded-3xl p-8 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center">
                          <Zap className="w-7 h-7 mr-3 text-purple-400" />
                          Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/eco-points')}
                            className="p-6 bg-slate-800/30 rounded-2xl text-center hover:bg-slate-700/30 transition-all border border-slate-700/50 hover:border-emerald-500/50"
                          >
                            <div className="text-3xl mb-3">📊</div>
                            <div className="font-bold">Eco Points</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/leaderboard')}
                            className="p-6 bg-slate-800/30 rounded-2xl text-center hover:bg-slate-700/30 transition-all border border-slate-700/50 hover:border-yellow-500/50"
                          >
                            <div className="text-3xl mb-3">🏆</div>
                            <div className="font-bold">Leaderboard</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/teams')}
                            className="p-6 bg-slate-800/30 rounded-2xl text-center hover:bg-slate-700/30 transition-all border border-slate-700/50 hover:border-blue-500/50"
                          >
                            <div className="text-3xl mb-3">👥</div>
                            <div className="font-bold">Teams</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('learn')}
                            className="p-6 bg-slate-800/30 rounded-2xl text-center hover:bg-slate-700/30 transition-all border border-slate-700/50 hover:border-purple-500/50"
                          >
                            <div className="text-3xl mb-3">🎮</div>
                            <div className="font-bold">Play Game</div>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
            
            {/* Rewards System Modal */}
            {showRewards && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowRewards(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white">Rewards & Achievements</h2>
                    <button
                      onClick={() => setShowRewards(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <RewardsSystem 
                    profile={profile} 
                    onClaim={(rewardId) => console.log('Claimed:', rewardId)} 
                  />
                </motion.div>
              </motion.div>
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
      
      <ProfileEditor
        isOpen={showProfileEditor}
        onClose={() => setShowProfileEditor(false)}
        profile={profile}
        onUpdate={(updatedProfile) => setProfile(updatedProfile)}
      />
      
      <SupportChat />
      
      {/* Mission Verification Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Complete Mission</h2>
              <p className="text-slate-400 mb-2">{selectedMission.title}</p>
              <div className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                +{selectedMission.points} Eco Points
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-white mb-2">Mission Requirements:</h4>
                <p className="text-slate-300 text-sm">{selectedMission.description}</p>
              </div>
              
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors">
                {proofImage ? (
                  <div className="space-y-4">
                    <img src={proofImage} alt="Proof" className="w-full h-32 object-cover rounded-lg" />
                    <div className="text-green-400 text-sm font-medium">✓ Photo uploaded successfully</div>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 mb-2">Upload photo proof of completion</p>
                    <p className="text-xs text-slate-500">Required for mission verification</p>
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
                  className="inline-block bg-gradient-to-r from-slate-700 to-slate-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:from-slate-600 hover:to-slate-500 transition-all mt-4"
                >
                  {proofImage ? 'Change Photo' : 'Choose Photo'}
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
                  setVerificationResult(null);
                  setVerifying(false);
                }}
                className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={submitMissionProof}
                disabled={!proofImage || verifying}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {verifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    AI Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit for Verification
                  </>
                )}
              </motion.button>
            </div>
            
            {verificationResult && (
              <div className="mt-4">
                <VerificationResult
                  result={verificationResult}
                  missionTitle={selectedMission.title}
                  points={selectedMission.points}
                  onContinue={() => {
                    setSelectedMission(null);
                    setProofImage('');
                    setVerificationResult(null);
                    setVerifying(false);
                  }}
                />
              </div>
            )}
            
            {!verificationResult && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-xs text-center">
                  🤖 AI will instantly verify your submission. High-confidence verifications get immediate points!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;