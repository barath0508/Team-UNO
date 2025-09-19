import React, { useState, useEffect } from 'react';
import { Users, Plus, Crown, Camera, Upload, CheckCircle, Trophy, Target, ArrowLeft, LogOut, Settings, Bell, MessageCircle, Send, X, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { verifyMissionWithAI } from '../lib/aiVerification';
import { addPoints } from '../lib/ecoPointsSystem';
import { createTeam, joinTeam, getUserTeam, getTeamMessages, sendTeamMessage, subscribeToTeamMessages, TeamMessage } from '../lib/teamService';

const EcoTeams: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<any[]>([]);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [proofImage, setProofImage] = useState<string>('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTeamChat, setShowTeamChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [theme, setTheme] = useState('dark');
  const [chatMessages, setChatMessages] = useState<TeamMessage[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  
  const teamTasks = [
    {
      id: 1,
      title: 'Community Garden Project',
      description: 'Create a small garden in your school or community area with at least 5 different plants',
      points: 200,
      difficulty: 'Medium',
      category: 'nature'
    },
    {
      id: 2,
      title: 'Neighborhood Cleanup Drive',
      description: 'Organize and execute a cleanup drive covering at least 2 blocks with proper waste segregation',
      points: 150,
      difficulty: 'Easy',
      category: 'waste'
    },
    {
      id: 3,
      title: 'Water Conservation Campaign',
      description: 'Install 10+ water-saving devices and create awareness materials for your community',
      points: 250,
      difficulty: 'Hard',
      category: 'water'
    }
  ];

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (userTeam) {
      loadChatMessages();
      setupRealtimeSubscription();
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [userTeam]);

  const loadTeams = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const team = await getUserTeam(user.id);
        setUserTeam(team);

        const { data: teamsData } = await supabase
          .from('eco_teams')
          .select('*, team_members(count)')
          .order('created_at', { ascending: false });

        setTeams(teamsData || []);
      } catch (error) {
        console.error('Error loading teams:', error);
      }
    }
  };

  const handleCreateTeam = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && teamName.trim()) {
      try {
        await createTeam(teamName, user.id);
        setShowCreateForm(false);
        setTeamName('');
        loadTeams();
        alert('Team created successfully!');
      } catch (error: any) {
        console.error('Error creating team:', error);
        alert(`Failed to create team: ${error.message || 'Unknown error'}`);
      }
    } else {
      alert('Please enter a team name');
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await joinTeam(teamId, user.id);
        loadTeams();
      } catch (error) {
        console.error('Error joining team:', error);
      }
    }
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
  
  const submitTeamTaskProof = async () => {
    if (!selectedTask || !proofImage || !userTeam) return;
    
    setVerifying(true);
    setVerificationResult(null);
    
    try {
      const aiResult = await verifyMissionWithAI(
        proofImage,
        selectedTask.title,
        selectedTask.description
      );
      
      setVerificationResult(aiResult);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user && aiResult.verified && aiResult.confidence >= 70) {
        await addPoints(user.id, selectedTask.points, `Team task completed: ${selectedTask.title}`);
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
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  const loadChatMessages = async () => {
    if (userTeam) {
      try {
        const messages = await getTeamMessages(userTeam.id);
        setChatMessages(messages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  };

  const setupRealtimeSubscription = () => {
    if (userTeam) {
      const sub = subscribeToTeamMessages(userTeam.id, (newMessage) => {
        setChatMessages(prev => [...prev, newMessage]);
      });
      setSubscription(sub);
    }
  };

  const handleSendMessage = async () => {
    if (chatMessage.trim() && userTeam) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          await sendTeamMessage(userTeam.id, user.id, chatMessage);
          setChatMessage('');
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Top Navigation Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 p-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Side - Back Button */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-slate-300 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Eco Teams
            </h1>
          </div>
          
          {/* Right Side - Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Team Chat */}
            {userTeam && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowTeamChat(!showTeamChat)}
                className="relative p-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-slate-300 hover:text-blue-400 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
              </motion.button>
            )}
            
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-slate-300 hover:text-yellow-400 transition-all"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </motion.button>
            
            {/* Messages */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowMessages(!showMessages)}
              className="relative p-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-slate-300 hover:text-green-400 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
            </motion.button>
            
            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-slate-300 hover:text-purple-400 transition-all"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            
            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="p-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-slate-300 hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Dropdown Panels */}
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 right-4 w-80 bg-slate-900 border border-slate-700 rounded-xl p-4 z-40"
        >
          <h3 className="font-bold mb-3 text-yellow-400">Notifications</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-sm font-medium">Team Challenge Available</div>
              <div className="text-xs text-slate-400">New water conservation task</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-sm font-medium">Points Awarded</div>
              <div className="text-xs text-slate-400">+150 points for cleanup drive</div>
            </div>
          </div>
        </motion.div>
      )}
      
      {showMessages && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 right-4 w-80 bg-slate-900 border border-slate-700 rounded-xl p-4 z-40"
        >
          <h3 className="font-bold mb-3 text-green-400">Messages</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-slate-400">Welcome to Eco Teams!</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-sm font-medium">Support</div>
              <div className="text-xs text-slate-400">How can we help you today?</div>
            </div>
          </div>
        </motion.div>
      )}
      
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 right-4 w-80 bg-slate-900 border border-slate-700 rounded-xl p-4 z-40"
        >
          <h3 className="font-bold mb-3 text-purple-400">Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center space-x-2 px-3 py-1 bg-slate-800 rounded-lg"
              >
                <Palette className="w-4 h-4" />
                <span className="text-xs">{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Notifications</span>
              <div className="w-10 h-6 bg-slate-700 rounded-full relative">
                <div className="w-4 h-4 bg-green-500 rounded-full absolute top-1 right-1" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Team Chat Box */}
      {showTeamChat && userTeam && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 w-80 h-96 bg-slate-900 border border-slate-700 rounded-xl z-40 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="font-bold text-blue-400">{userTeam.name} Chat</h3>
            <button onClick={() => setShowTeamChat(false)}>
              <X className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="bg-slate-800/50 rounded-lg p-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-blue-400">
                    {msg.profiles?.full_name || 'Unknown User'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-slate-300 mt-1">{msg.message}</div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="p-6">
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
              <span className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm">
                👥 Collaboration & Community
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                Eco
              </span>{' '}
              <span className="text-white">Teams</span>
            </h1>
            <p className="text-slate-300 text-lg">Join forces with fellow eco-warriors to amplify your impact</p>
          </div>

          {/* User's Team */}
          {userTeam && (
            <div className="glass rounded-2xl p-8 mb-8 border-2 border-green-500/50">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                Your Team: {userTeam.name}
              </h2>
              <p className="text-slate-400">Team up with friends to stay motivated!</p>
            </div>
          )}

          {/* Team Tasks */}
          {userTeam && (
            <div className="glass rounded-2xl p-8 mb-8 border border-purple-500/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Team Challenges
                </span>
              </h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {teamTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative group"
                  >
                    <div className="relative bg-slate-800/50 border border-slate-700/50 group-hover:border-purple-500/50 rounded-2xl p-6 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">
                              {task.category === 'nature' ? '🌱' : 
                               task.category === 'waste' ? '🧹' :
                               task.category === 'water' ? '💧' : '♻️'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors">{task.title}</h3>
                            <div className="text-sm text-slate-400 capitalize">{task.category} Challenge</div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          task.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          task.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {task.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-slate-300 mb-4">{task.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-purple-400 font-bold text-lg">+{task.points} points</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedTask(task)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold"
                        >
                          Start Challenge
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Create Team */}
          {!userTeam && (
            <div className="glass rounded-2xl p-8 mb-8 border border-emerald-500/20">
              {!showCreateForm ? (
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-3 bg-slate-800 rounded border border-slate-700"
                  />
                  <div className="space-x-2">
                    <button 
                      onClick={handleCreateTeam}
                      className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                    >
                      Create
                    </button>
                    <button 
                      onClick={() => setShowCreateForm(false)}
                      className="bg-slate-600 px-4 py-2 rounded hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* All Teams */}
          <div className="glass rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              All Teams
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <div key={team.id} className="bg-slate-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{team.name}</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    {team.team_members?.[0]?.count || 0} members
                  </p>
                  {!userTeam && (
                    <button 
                      onClick={() => handleJoinTeam(team.id)}
                      className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Join Team
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Team Task Verification Modal */}
          {selectedTask && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Complete Team Challenge</h2>
                  <p className="text-slate-400 mb-2">{selectedTask.title}</p>
                  <div className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                    +{selectedTask.points} Team Points
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-white mb-2">Challenge Requirements:</h4>
                    <p className="text-slate-300 text-sm">{selectedTask.description}</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors">
                    {proofImage ? (
                      <div className="space-y-4">
                        <img src={proofImage} alt="Proof" className="w-full h-32 object-cover rounded-lg" />
                        <div className="text-green-400 text-sm font-medium">✓ Photo uploaded successfully</div>
                      </div>
                    ) : (
                      <div className="py-8">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-400 mb-2">Upload team photo proof</p>
                        <p className="text-xs text-slate-500">Show your team completing the challenge</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="team-proof-upload"
                    />
                    <label
                      htmlFor="team-proof-upload"
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
                      setSelectedTask(null);
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
                    onClick={submitTeamTaskProof}
                    disabled={!proofImage || verifying}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  <div className="mt-4 p-4 rounded-lg border">
                    <div className={`text-center ${verificationResult.verified ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                      <div className="text-lg font-bold mb-2">
                        {verificationResult.verified ? '✓ Verified!' : '✗ Not Verified'}
                      </div>
                      <div className="text-sm mb-2">Confidence: {Math.round(verificationResult.confidence)}%</div>
                      <div className="text-xs">{verificationResult.feedback}</div>
                      {verificationResult.verified && verificationResult.confidence >= 70 && (
                        <div className="mt-2 text-emerald-400 font-bold">
                          +{selectedTask.points} points awarded to team!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcoTeams;