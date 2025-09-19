import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Brain, Trophy } from 'lucide-react';
import { generateQuiz } from '../lib/aiQuiz';
import { addPoints } from '../lib/ecoPointsSystem';
import { supabase } from '../lib/supabase';

interface QuizComponentProps {
  age: number;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ age }) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [age]);

  const loadQuiz = async () => {
    setLoading(true);
    const quizData = await generateQuiz(age);
    setQuiz(quizData);
    setLoading(false);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === quiz.questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        completeQuiz();
      }
    }, 2000);
  };

  const completeQuiz = async () => {
    const finalScore = selectedAnswer === quiz.questions[currentQuestion].correct ? score + 1 : score;
    const points = finalScore * 10;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await addPoints(user.id, points, `Quiz completed: ${finalScore}/${quiz.questions.length}`);
      }
    } catch (error) {
      console.log('Error awarding points:', error);
    }
    
    setQuizCompleted(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Generating personalized quiz...</p>
      </div>
    );
  }

  if (quizCompleted) {
    const finalScore = selectedAnswer === quiz.questions[currentQuestion].correct ? score + 1 : score;
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="relative glass rounded-3xl p-12 border border-yellow-500/30 text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6"
          >
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
          >
            🎉 Quiz Complete!
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="text-3xl font-bold mb-2 text-white">Score: {finalScore}/{quiz.questions.length}</div>
            <div className="text-2xl font-bold text-emerald-400 mb-4">
              🎆 +{finalScore * 10} Eco Points Earned!
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setQuizCompleted(false);
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setScore(0);
              loadQuiz();
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
          >
            🔄 Take Another Quiz
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
      <div className="relative glass rounded-3xl p-8 border border-blue-500/30 card-3d">
      <div className="flex items-center justify-between mb-8">
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold flex items-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mr-3 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
          >
            <Brain className="w-8 h-8 text-blue-400" />
          </motion.div>
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {quiz.title}
          </span>
        </motion.h3>
        <div className="glass px-4 py-2 rounded-full border border-blue-500/30">
          <span className="text-blue-400 font-bold">
            {currentQuestion + 1}/{quiz.questions.length}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative mb-6">
          <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 h-3 rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Question {currentQuestion + 1}</span>
            <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete</span>
          </div>
        </div>
        <motion.h4 
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold mb-6 text-center p-4 glass rounded-2xl border border-purple-500/20"
        >
          <span className="text-2xl mr-3">🤔</span>
          {question.question}
        </motion.h4>
      </div>

      <div className="grid gap-4">
        {question.options.map((option: string, index: number) => {
          const letters = ['A', 'B', 'C', 'D'];
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
              className={`group relative w-full p-6 text-left rounded-2xl border transition-all duration-300 overflow-hidden ${
                showResult
                  ? index === question.correct
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-2xl shadow-green-500/25'
                    : index === selectedAnswer
                    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/50 shadow-2xl shadow-red-500/25'
                    : 'glass border-slate-700/30 opacity-60'
                  : 'glass border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/25'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                    showResult && index === question.correct
                      ? 'bg-green-500 text-white'
                      : showResult && index === selectedAnswer && index !== question.correct
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700/50 text-slate-300 group-hover:bg-blue-500/20 group-hover:text-blue-400'
                  }`}>
                    {letters[index]}
                  </div>
                  <span className={`font-medium ${
                    showResult && index === question.correct
                      ? 'text-green-300'
                      : showResult && index === selectedAnswer && index !== question.correct
                      ? 'text-red-300'
                      : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {option}
                  </span>
                </div>
                <div className="flex items-center">
                  {showResult && index === question.correct && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </motion.div>
                  )}
                  {showResult && index === selectedAnswer && index !== question.correct && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <XCircle className="w-6 h-6 text-red-400" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="mt-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl" />
            <div className="relative glass rounded-2xl p-6 border border-cyan-500/30">
              <h5 className="font-bold text-lg mb-3 flex items-center text-cyan-400">
                <span className="text-2xl mr-2">💡</span>
                Explanation
              </h5>
              <p className="text-slate-200 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  </div>
  );
};

export default QuizComponent;