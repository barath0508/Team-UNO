import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, Target, RefreshCw } from 'lucide-react';
import { generateLearningContent } from '../lib/aiQuiz';

interface LearningContentProps {
  age: number;
}

const LearningContent: React.FC<LearningContentProps> = ({ age }) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTopic, setCurrentTopic] = useState('Climate Change');

  const topics = ['Climate Change', 'Renewable Energy', 'Water Conservation', 'Recycling', 'Biodiversity'];

  useEffect(() => {
    loadContent();
  }, [age, currentTopic]);

  const loadContent = async () => {
    setLoading(true);
    const contentData = await generateLearningContent(age, currentTopic);
    setContent(contentData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading learning content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Topic Selector */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 rounded-2xl blur-xl" />
        <div className="relative glass rounded-2xl p-6 border border-blue-500/20">
          <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎓 Choose Your Learning Adventure
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {topics.map((topic, index) => {
              const icons = ['🌍', '⚡', '💧', '♻️', '🌿'];
              return (
                <motion.button
                  key={topic}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentTopic(topic)}
                  className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                    currentTopic === topic
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/25'
                      : 'glass border border-slate-700/50 text-slate-300 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center">
                    <span className="text-lg mr-2">{icons[index]}</span>
                    {topic}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <motion.div
        key={currentTopic}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-blue-500/5 rounded-3xl" />
        <div className="relative glass rounded-3xl p-8 border border-emerald-500/20 card-3d">
        <div className="flex items-center justify-between mb-6">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold flex items-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mr-3 p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full"
            >
              <BookOpen className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              {content.title}
            </span>
          </motion.h3>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={loadContent}
            className="p-3 glass rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all group"
          >
            <RefreshCw className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
          </motion.button>
        </div>

        <div className="space-y-8">
          {/* Enhanced Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl" />
            <div className="relative glass rounded-2xl p-6 border border-blue-500/20">
              <p className="text-slate-200 leading-relaxed text-lg font-medium">{content.content}</p>
            </div>
          </motion.div>

          {/* Enhanced Key Points */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl" />
            <div className="relative glass rounded-2xl p-6 border border-blue-500/30">
              <h4 className="font-bold text-xl mb-4 flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-3 p-2 bg-blue-500/20 rounded-full"
                >
                  <Target className="w-6 h-6 text-blue-400" />
                </motion.div>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Key Learning Points
                </span>
              </h4>
              <div className="grid gap-3">
                {content.keyPoints.map((point: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.5, rotate: 360 }}
                      className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:shadow-lg group-hover:shadow-blue-400/50"
                    />
                    <span className="text-slate-200 group-hover:text-white transition-colors">{point}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Fun Fact */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl" />
            <div className="relative glass rounded-2xl p-6 border border-yellow-500/30 holographic">
              <h4 className="font-bold text-xl mb-4 flex items-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mr-3 p-2 bg-yellow-500/20 rounded-full"
                >
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  💡 Amazing Fact!
                </span>
              </h4>
              <p className="text-slate-200 text-lg font-medium">{content.funFact}</p>
            </div>
          </motion.div>

          {/* Enhanced Action Tip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
            <div className="relative glass rounded-2xl p-6 border border-emerald-500/30 magnetic">
              <h4 className="font-bold text-xl mb-4 flex items-center">
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mr-3 p-2 bg-emerald-500/20 rounded-full"
                >
                  <Target className="w-6 h-6 text-emerald-400" />
                </motion.div>
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  🎯 Take Action Now!
                </span>
              </h4>
              <p className="text-slate-200 text-lg font-medium">{content.actionTip}</p>
            </div>
          </motion.div>
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LearningContent;