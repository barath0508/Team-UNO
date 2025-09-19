import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, X, Lightbulb, AlertTriangle, Leaf, Wind } from 'lucide-react';

const Level1StubbleBurning: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const slides = [
    {
      title: "🌾 What is Stubble Burning?",
      content: "After harvesting rice or wheat, dry stalks (called stubble) are left in the fields. To quickly clear the land for the next crop, many farmers set the stubble on fire.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
      icon: "🌾",
      color: "from-yellow-400 to-orange-400"
    },
    {
      title: "💨 Why It's a Problem",
      content: "Burning just 1 tonne of stubble releases harmful gases:\n• 3 kg of fine dust (PM) that hurts our lungs\n• 60 kg Carbon Monoxide (CO)\n• 1,460 kg Carbon Dioxide (CO₂)\n• 200 kg Sulphur Dioxide (SO₂)",
      image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=500&h=300&fit=crop",
      icon: "💨",
      color: "from-red-400 to-pink-400"
    },
    {
      title: "🕒 What Really Happens to Stubble",
      content: "If left to rot naturally, tiny microbes slowly break it down:\n• Waiting stage – nothing much happens at first\n• Active stage – microbes grow and eat the stubble\n• Finish stage – stubble turns into nutrients that enrich the soil",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop",
      icon: "🔄",
      color: "from-green-400 to-emerald-400"
    },
    {
      title: "⚙️ Why Farmers Burn It",
      content: "Farmers face challenges:\n• Little time before next planting\n• Machines to remove stubble are costly\n• Selling stubble as fuel is still small-scale",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=300&fit=crop",
      icon: "⚙️",
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "✅ Better Alternatives",
      content: "Green solutions exist:\n• Use Happy Seeder machines\n• Convert stubble into biogas or compost\n• Support programs that give subsidy for machinery",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop",
      icon: "✅",
      color: "from-green-500 to-teal-500"
    }
  ];

  const quizQuestions = [
    {
      question: "What is stubble?",
      options: ["Green leaves", "Dry stalks left after harvest", "Seeds", "Roots"],
      correct: 1
    },
    {
      question: "How much CO₂ does burning 1 tonne of stubble release?",
      options: ["60 kg", "200 kg", "1,460 kg", "3 kg"],
      correct: 2
    },
    {
      question: "What happens when stubble decomposes naturally?",
      options: ["It disappears", "It becomes nutrients for soil", "It causes pollution", "It attracts pests"],
      correct: 1
    },
    {
      question: "Which machine can help plant without burning stubble?",
      options: ["Tractor", "Happy Seeder", "Harvester", "Plough"],
      correct: 1
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
    
    if (newAnswers.length === quizQuestions.length && !newAnswers.includes(undefined)) {
      setQuizComplete(true);
    }
  };

  const getScore = () => {
    return quizAnswers.reduce((score, answer, index) => {
      return score + (answer === quizQuestions[index].correct ? 1 : 0);
    }, 0);
  };

  if (showQuiz) {
    return (
      <div className="glass rounded-3xl p-8 border border-blue-500/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🧠 Level 1 Quiz: Stubble Burning
          </h2>
          <p className="text-slate-300">Test your knowledge about what you just learned!</p>
        </motion.div>

        <div className="space-y-6">
          {quizQuestions.map((q, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: qIndex * 0.1 }}
              className="bg-slate-800/30 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {qIndex + 1}. {q.question}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((option, oIndex) => (
                  <motion.button
                    key={oIndex}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuizAnswer(qIndex, oIndex)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      quizAnswers[qIndex] === oIndex
                        ? quizComplete
                          ? oIndex === q.correct
                            ? 'bg-green-500/20 border-2 border-green-500 text-green-300'
                            : 'bg-red-500/20 border-2 border-red-500 text-red-300'
                          : 'bg-blue-500/20 border-2 border-blue-500 text-blue-300'
                        : 'bg-slate-700/30 border border-slate-600 text-slate-200 hover:bg-slate-600/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center mr-3 shadow-lg">
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      <span className="font-medium">{option}</span>
                      {quizComplete && quizAnswers[qIndex] === oIndex && (
                        <div className="ml-auto">
                          {oIndex === q.correct ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <X className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {quizComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 text-center"
          >
            <div className="text-4xl mb-4">
              {getScore() === quizQuestions.length ? '🎉' : getScore() >= quizQuestions.length / 2 ? '👍' : '📚'}
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-200">
              Quiz Complete!
            </h3>
            <p className="text-xl mb-6 font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              You scored {getScore()} out of {quizQuestions.length}
            </p>
            <div className="space-y-3 text-base font-medium">
              <p className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center">
                🔥 Burning fields harms people and the planet
              </p>
              <p className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center justify-center">
                🌱 Composting keeps air clean and improves soil
              </p>
              <p className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center">
                💡 Encourage your community to choose green solutions!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowQuiz(false);
                setCurrentSlide(0);
                setQuizAnswers([]);
                setQuizComplete(false);
              }}
              className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors"
            >
              Learn Again
            </motion.button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8 border border-blue-500/30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Level 1: Stubble Burning Basics
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-300 font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="min-h-[400px]"
        >
          <div className="text-center mb-6">
            <motion.div 
              className="text-6xl mb-4 inline-block"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {slides[currentSlide].icon}
            </motion.div>
            <motion.h3 
              className={`text-4xl font-bold mb-4 bg-gradient-to-r ${slides[currentSlide].color} bg-clip-text text-transparent`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {slides[currentSlide].title}
            </motion.h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="glass rounded-2xl p-6 border border-slate-700/50"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="w-full h-48 object-cover rounded-xl mb-4"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              />
              
              <div className="flex items-center space-x-2 text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentSlide === 0 && <Leaf className="w-4 h-4 text-green-400" />}
                {currentSlide === 1 && <Wind className="w-4 h-4 text-red-400" />}
                {currentSlide === 2 && <Leaf className="w-4 h-4 text-green-400" />}
                {currentSlide === 3 && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                {currentSlide === 4 && <Lightbulb className="w-4 h-4 text-blue-400" />}
                <span>✨ Interactive Learning</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass rounded-2xl p-6 border border-slate-700/50"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="text-slate-100 text-lg leading-relaxed whitespace-pre-line font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.9) 0%, rgba(203, 213, 225, 0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {slides[currentSlide].content}
              </motion.div>
              
              {currentSlide === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20"
                >
                  <div className="text-red-300 font-bold mb-3 text-lg bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                    ⚠️ Health Effects:
                  </div>
                  <div className="text-slate-200 font-medium leading-relaxed">
                    <div className="flex items-center mb-2"><span className="text-red-400 mr-2">👁️</span> Eye & throat irritation</div>
                    <div className="flex items-center mb-2"><span className="text-red-400 mr-2">🫁</span> Coughing and breathing trouble</div>
                    <div className="flex items-center mb-2"><span className="text-red-400 mr-2">😴</span> Sleepless nights from constant coughing</div>
                    <div className="flex items-center"><span className="text-red-400 mr-2">🌡️</span> Warmer climate because of CO₂</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div 
        className="flex justify-between items-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
            currentSlide === 0 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </motion.button>

        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="flex items-center px-6 py-3 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all"
        >
          {currentSlide === slides.length - 1 ? 'Take Quiz' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Level1StubbleBurning;