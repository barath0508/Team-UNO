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
    <div className="space-y-6">
      {/* Topic Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {topics.map((topic) => (
          <motion.button
            key={topic}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTopic(topic)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              currentTopic === topic
                ? 'bg-green-500 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            {topic}
          </motion.button>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        key={currentTopic}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-green-400" />
            {content.title}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={loadContent}
            className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </motion.button>
        </div>

        <div className="space-y-6">
          {/* Main Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed">{content.content}</p>
          </div>

          {/* Key Points */}
          <div className="bg-slate-800/30 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2 text-blue-400" />
              Key Points
            </h4>
            <ul className="space-y-2">
              {content.keyPoints.map((point: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-slate-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fun Fact */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center text-yellow-400">
              <Lightbulb className="w-4 h-4 mr-2" />
              Fun Fact
            </h4>
            <p className="text-slate-300">{content.funFact}</p>
          </div>

          {/* Action Tip */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center text-emerald-400">
              <Target className="w-4 h-4 mr-2" />
              What You Can Do
            </h4>
            <p className="text-slate-300">{content.actionTip}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LearningContent;