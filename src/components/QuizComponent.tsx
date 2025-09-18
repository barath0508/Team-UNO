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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
        <p className="text-lg mb-4">Score: {finalScore}/{quiz.questions.length}</p>
        <p className="text-emerald-400 font-semibold">+{finalScore * 10} Eco Points Earned!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            setQuizCompleted(false);
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setShowResult(false);
            setScore(0);
            loadQuiz();
          }}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          Take Another Quiz
        </motion.button>
      </motion.div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <Brain className="w-6 h-6 mr-2 text-blue-400" />
          {quiz.title}
        </h3>
        <span className="text-sm text-slate-400">
          {currentQuestion + 1}/{quiz.questions.length}
        </span>
      </div>

      <div className="mb-6">
        <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <h4 className="text-lg font-semibold mb-4">{question.question}</h4>
      </div>

      <div className="space-y-3">
        {question.options.map((option: string, index: number) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !showResult && handleAnswer(index)}
            disabled={showResult}
            className={`w-full p-4 text-left rounded-lg border transition-all ${
              showResult
                ? index === question.correct
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : index === selectedAnswer
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {showResult && index === question.correct && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              {showResult && index === selectedAnswer && index !== question.correct && (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-slate-800/30 rounded-lg"
        >
          <p className="text-sm text-slate-300">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
};

export default QuizComponent;