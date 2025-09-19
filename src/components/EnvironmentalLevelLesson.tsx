import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, X, Droplets, Bug, Thermometer, Recycle } from 'lucide-react';

interface LevelData {
  level: number;
  title: string;
  icon: string;
  color: string;
  content: {
    causes: string;
    effects: string;
    solutions: string;
  };
  image: string;
  quiz: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

const levelData: Record<number, LevelData> = {
  2: {
    level: 2,
    title: "💧 Ground-Water Depletion Crisis",
    icon: "💧",
    color: "from-blue-400 to-cyan-400",
    content: {
      causes: "Ground water is water stored beneath the soil. In many places, we are using it faster than nature can refill it.\n\n🌾 Heavy irrigation for crops\n🕳️ Too many bore-wells\n🚰 Leaking water pipes\n🏢 Concrete roads block rainwater",
      effects: "When we use too much groundwater, bad things happen to our water supply.\n\n📉 Water levels going down\n🏜️ Wells drying up\n💰 More expensive to pump water\n🧂 Water becomes salty\n☠️ Harmful chemicals in water",
      solutions: "We can save groundwater by being smart about how we use and collect water.\n\n🏠 Collect rainwater from roofs\n⛲ Dig pits to store rainwater\n♻️ Reuse treated water\n🌱 Grow crops that need less water\n💧 Use drip irrigation"
    },
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=300&fit=crop",
    quiz: [
      {
        question: "What percentage of India's groundwater is used for irrigation?",
        options: ["50%", "60%", "70%", "80%"],
        correct: 2
      },
      {
        question: "How much water can drip irrigation save compared to flood irrigation?",
        options: ["10-20%", "20-30%", "30-50%", "60-70%"],
        correct: 2
      },
      {
        question: "How many wells have dried up in India in the past decade?",
        options: ["100,000", "200,000", "256,000", "300,000"],
        correct: 2
      }
    ]
  },
  3: {
    level: 3,
    title: "🐝 Pollinator Crisis & Biodiversity Loss",
    icon: "🐝",
    color: "from-yellow-400 to-orange-400",
    content: {
      causes: "Pollinators like bees and butterflies help plants make seeds by moving pollen. But they are disappearing.\n\n🧪 Harmful chemicals kill bees\n🌾 Big farms destroy flower homes\n🏙️ Cities take away natural spaces\n🌡️ Climate change confuses timing\n🦠 Diseases spread among bees",
      effects: "Without pollinators, we have less food and nature suffers.\n\n📉 Fewer bees and butterflies\n🍎 Less fruits and vegetables\n💰 Food becomes more expensive\n🌸 Wild plants can't reproduce\n🍯 Less honey production",
      solutions: "We can help pollinators by creating safe spaces and using fewer chemicals.\n\n🌻 Plant flowers for bees\n🚫 Use fewer harmful chemicals\n🏞️ Save natural spaces\n🍯 Buy local honey\n🌱 Support organic farming"
    },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    quiz: [
      {
        question: "What percentage of global food production depends on pollinators?",
        options: ["25%", "33%", "50%", "75%"],
        correct: 1
      },
      {
        question: "By how much have butterfly populations declined in Europe?",
        options: ["30%", "50%", "70%", "90%"],
        correct: 2
      },
      {
        question: "What is the main cause of bee colony collapse disorder?",
        options: ["Climate change", "Neonicotinoid pesticides", "Habitat loss", "Disease"],
        correct: 1
      }
    ]
  },
  4: {
    level: 4,
    title: "🌡️ Climate Emergency & Global Warming",
    icon: "🌡️",
    color: "from-red-400 to-orange-400",
    content: {
      causes: "🏭 Fossil fuel combustion releases 36 billion tonnes of CO₂ annually - coal (39%), oil (34%), gas (20%). 🌳 Deforestation destroys 10 million hectares yearly, eliminating carbon sinks that absorb 2.6 billion tonnes CO₂. 🐄 Livestock farming produces 14.5% of global emissions through methane from 1 billion cattle. 🚗 Transportation accounts for 16% of emissions, with aviation growing fastest. 🏗️ Cement and steel production release 8% of global CO₂. 🗑️ Landfills and waste generate 3% of emissions through methane gas.",
      effects: "🌡️ Global temperature has risen 1.1°C since 1880, with 2023 being the hottest year recorded. 🌊 Sea levels rise 3.3mm annually, threatening 630 million people in coastal areas. 🏔️ Arctic ice melts at 13% per decade, disrupting global weather patterns. 🌪️ Extreme weather events increase 5x - heat waves kill 70,000+ annually in Europe. 🌾 Crop yields drop 10-25% due to droughts, floods, and changing precipitation. 🐧 Species extinction rate is 1000x natural levels as habitats shift faster than adaptation. 💰 Economic losses exceed $23 trillion by 2100 without action.",
      solutions: "⚡ Renewable energy expansion - solar costs dropped 90% since 2010, now cheapest electricity source. 🔋 Energy storage and smart grids enable 100% renewable power systems. 🚗 Electric vehicles and public transport can cut transport emissions 70%. 🌳 Reforestation and afforestation can sequester 25% of needed carbon reduction. 🏠 Building efficiency improvements save 50% of energy consumption. 🥩 Plant-based diets reduce individual carbon footprint by 73%. 🏛️ Carbon pricing and international cooperation through Paris Agreement targets 1.5°C limit."
    },
    image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=500&h=300&fit=crop",
    quiz: [
      {
        question: "How much has global temperature risen since 1880?",
        options: ["0.5°C", "1.1°C", "1.5°C", "2.0°C"],
        correct: 1
      },
      {
        question: "What percentage of global emissions come from livestock?",
        options: ["8.5%", "12.5%", "14.5%", "18.5%"],
        correct: 2
      },
      {
        question: "By how much can plant-based diets reduce carbon footprint?",
        options: ["25%", "50%", "73%", "90%"],
        correct: 2
      }
    ]
  },
  5: {
    level: 5,
    title: "♻️ Plastic Pollution & Circular Economy",
    icon: "♻️",
    color: "from-green-400 to-teal-400",
    content: {
      causes: "🏭 Global plastic production reached 380 million tonnes in 2023, with 50% being single-use items used for minutes but lasting centuries. 🛍️ Poor waste management systems in developing countries allow 8 million tonnes to enter oceans annually. 🚮 Inadequate recycling infrastructure processes only 9% of all plastic ever made. 🏙️ Urban littering and illegal dumping contaminate waterways and soil. 📦 E-commerce boom increases packaging waste by 30% annually. 🥤 Beverage industry produces 500 billion plastic bottles yearly, most ending in landfills.",
      effects: "🌊 5 trillion plastic pieces float in oceans, forming garbage patches larger than Texas. 🐢 Marine animals mistake plastic for food - 90% of seabirds have plastic in stomachs. 🐟 Microplastics contaminate seafood, salt, and drinking water consumed by humans. 🏙️ Plastic waste clogs drainage systems, causing urban flooding during monsoons. 🔥 Open burning releases toxic dioxins causing cancer and respiratory diseases. 💰 Economic losses exceed $139 billion annually from marine plastic pollution alone. 🌍 Plastic production accounts for 3.4% of global greenhouse gas emissions.",
      solutions: "🚫 Single-use plastic bans in 60+ countries reduce consumption by 30-70%. 🛍️ Reusable alternatives - cloth bags, steel bottles, bamboo straws prevent 1000+ plastic items per person annually. ♻️ Advanced recycling technologies can process 95% of plastic waste into new products. 🏭 Extended Producer Responsibility makes manufacturers accountable for entire product lifecycle. 🌱 Biodegradable alternatives from seaweed, corn starch decompose in 90 days vs 500 years. 👥 Community initiatives like beach cleanups remove 20 million pounds of plastic annually. 💡 Circular economy models eliminate waste through design, reuse, and regeneration."
    },
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop",
    quiz: [
      {
        question: "What percentage of all plastic ever made has been recycled?",
        options: ["9%", "15%", "25%", "35%"],
        correct: 0
      },
      {
        question: "How many plastic pieces are estimated to be in the oceans?",
        options: ["1 trillion", "3 trillion", "5 trillion", "10 trillion"],
        correct: 2
      },
      {
        question: "How long do biodegradable alternatives take to decompose?",
        options: ["30 days", "90 days", "1 year", "5 years"],
        correct: 1
      }
    ]
  }
};

interface Props {
  level: number;
}

const EnvironmentalLevelLesson: React.FC<Props> = ({ level }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const data = levelData[level];
  if (!data) return null;

  const sections = [
    { title: "🔍 What Causes This?", content: data.content.causes, icon: "🔍" },
    { title: "⚠️ What Happens?", content: data.content.effects, icon: "⚠️" },
    { title: "✅ How Can We Help?", content: data.content.solutions, icon: "✅" },
    { title: "🧠 Ready for Quiz?", content: "Great job learning! Now let's test what you remember with a fun quiz.", icon: "🧠" }
  ];

  const nextSection = () => {
    if (currentSection < sections.length - 2) {
      setCurrentSection(currentSection + 1);
    } else if (currentSection === sections.length - 2) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
    
    if (newAnswers.length === data.quiz.length && !newAnswers.includes(undefined)) {
      setQuizComplete(true);
    }
  };

  const getScore = () => {
    return quizAnswers.reduce((score, answer, index) => {
      return score + (answer === data.quiz[index].correct ? 1 : 0);
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
            🧠 Level {level} Quiz: {data.title}
          </h2>
          <p className="text-slate-300">Test your knowledge!</p>
        </motion.div>

        <div className="space-y-6">
          {data.quiz.map((q, qIndex) => (
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
              {getScore() === data.quiz.length ? '🎉' : getScore() >= data.quiz.length / 2 ? '👍' : '📚'}
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-200">
              Quiz Complete!
            </h3>
            <p className="text-xl mb-6 font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              You scored {getScore()} out of {data.quiz.length}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowQuiz(false);
                setCurrentSection(0);
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
          Level {level}: {data.title}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-300 font-medium">
            {currentSection + 1} / {sections.length - 1}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <motion.div 
            className={`bg-gradient-to-r ${data.color} h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentSection + 1) / (sections.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
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
              {sections[currentSection].icon}
            </motion.div>
            <motion.h3 
              className={`text-4xl font-bold mb-4 bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {sections[currentSection].title}
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
                src={data.image} 
                alt={data.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              />
              
              <div className="flex items-center space-x-2 text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {level === 2 && <Droplets className="w-4 h-4 text-blue-400" />}
                {level === 3 && <Bug className="w-4 h-4 text-yellow-400" />}
                {level === 4 && <Thermometer className="w-4 h-4 text-red-400" />}
                {level === 5 && <Recycle className="w-4 h-4 text-green-400" />}
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
                className="text-slate-100 text-lg leading-relaxed font-medium"
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
                {sections[currentSection].content}
              </motion.div>
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
          onClick={prevSection}
          disabled={currentSection === 0}
          className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
            currentSection === 0 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </motion.button>

        <div className="flex space-x-3">
          {sections.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentSection 
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
          onClick={nextSection}
          className="flex items-center px-6 py-3 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all"
        >
          {currentSection === sections.length - 1 ? 'Take Quiz' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EnvironmentalLevelLesson;