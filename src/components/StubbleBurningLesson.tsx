import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle, Volume2, VolumeX, RotateCcw, Zap, Brain, Eye } from 'lucide-react';

const StubbleBurningLesson: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'normal' | 'immersive'>('normal');
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (currentSlide > 0) {
      setCompletedSlides(prev => new Set([...prev, currentSlide - 1]));
    }
  }, [currentSlide]);

  const slides = [
    {
      title: "🌾 What is Stubble Burning?",
      content: "After harvesting rice or wheat, farmers are left with dry stalks called 'stubble' covering their fields. These golden-brown remains contain the lower portions of crop stems that couldn't be harvested.\n\n🔥 The Quick Fix: To rapidly clear land for the next planting season, many farmers choose to burn this stubble.\n\n🌍 Global Impact: This practice affects over 23 million hectares worldwide, with India alone burning 35 million tonnes annually.\n\n⏰ Time Pressure: Farmers have only 15-20 days between harvest and next sowing, making burning seem like the fastest solution.",
      icon: "🌾",
      color: "from-yellow-400 to-orange-400",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
      stats: { affected: "23M hectares", countries: "50+ countries", timeframe: "15-20 days" }
    },
    {
      title: "💨 Environmental Pollution Crisis",
      content: "When farmers burn just 1 tonne of stubble, it releases a cocktail of harmful pollutants into our atmosphere:\n\n🐫 Fine Particulate Matter (PM2.5): 3 kg - These microscopic particles penetrate deep into lungs\n☠️ Carbon Monoxide: 60 kg - A deadly colorless, odorless gas\n🌡️ Carbon Dioxide: 1,460 kg - Major greenhouse gas driving climate change\n💨 Sulfur Dioxide: 200 kg - Causes acid rain and respiratory problems\n🔥 Nitrogen Oxides: 2 kg - Forms ground-level ozone (smog)\n\n🌍 Impact Scale: Delhi's air quality drops to 'severe' category during burning season, with PM2.5 levels reaching 15x WHO limits!",
      icon: "💨",
      color: "from-red-400 to-pink-400",
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop&crop=center",
      stats: { pm25: "3kg/tonne", co2: "1,460kg/tonne", cities: "500+ affected" }
    },
    {
      title: "🏥 Devastating Health Impact",
      content: "Stubble burning smoke creates a public health emergency affecting millions:\n\n👁️ Eye Problems: Burning, watering, and severe irritation lasting days\n🫁 Respiratory Issues: Persistent coughing, wheezing, and shortness of breath\n😴 Sleep Disruption: Families can't sleep due to constant coughing and burning sensation\n👶 Children at Risk: Young lungs are especially vulnerable to permanent damage\n👴 Elderly Suffering: Pre-existing conditions worsen dramatically\n🏥 Hospital Surge: 40% increase in respiratory admissions during burning season\n\n📊 Shocking Stats: Over 1 million premature deaths annually in India linked to air pollution, with stubble burning being a major contributor.",
      icon: "🏥",
      color: "from-red-500 to-red-600",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop&crop=center",
      stats: { deaths: "1M+ annually", hospitals: "40% increase", affected: "50M people" }
    },
    {
      title: "🕒 Nature's Smart Recycling System",
      content: "When stubble decomposes naturally, it follows nature's perfect recycling process:\n\n🕰️ Stage 1 - Waiting (0-30 days): Stubble begins to soften as moisture and microorganisms start the breakdown\n🧬 Stage 2 - Active Decomposition (30-90 days): Billions of beneficial microbes, fungi, and bacteria feast on the organic matter\n🌱 Stage 3 - Nutrient Release (90-180 days): Stubble transforms into rich humus, releasing nitrogen, phosphorus, and potassium\n🌿 Final Stage - Soil Enrichment: The soil becomes more fertile, retains water better, and supports healthier crops\n\n💰 Economic Benefit: Natural decomposition adds $200-400 worth of nutrients per hectare - that's free fertilizer!\n🐛 Biodiversity Boost: Supports 1000+ species of beneficial soil organisms.",
      icon: "🔄",
      color: "from-green-400 to-emerald-400",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
      stats: { nutrients: "$200-400/hectare", timeline: "180 days", species: "1000+ organisms" }
    },
    {
      title: "⚙️ Understanding Farmers' Challenges",
      content: "Farmers face real pressures that drive them to burn stubble:\n\n⏰ Time Crunch: Only 15-20 days between rice harvest and wheat sowing in Punjab/Haryana\n💰 Financial Strain: Happy Seeder machines cost $8,000-15,000, unaffordable for small farmers\n🚜 Labor Shortage: Manual stubble removal requires 25-30 workers per hectare\n🏭 Market Gap: Limited buyers for stubble as biomass fuel or fodder\n🌧️ Weather Window: Monsoon delays create even tighter planting schedules\n📊 Scale Challenge: Punjab alone generates 20 million tonnes of rice stubble annually\n\n👥 Human Story: 'We know burning is bad, but what choice do we have?' - Typical farmer sentiment reflecting the difficult reality they face.",
      icon: "⚙️",
      color: "from-blue-400 to-cyan-400",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop&crop=center",
      stats: { timeframe: "15-20 days", cost: "$8K-15K", volume: "20M tonnes" }
    },
    {
      title: "✅ Revolutionary Green Solutions",
      content: "Innovative technologies and policies are transforming stubble management:\n\n🌱 Happy Seeder Technology: Plants wheat directly through stubble, eliminating burning need\n⚡ Biomass Power Plants: Convert stubble into clean electricity for 50,000+ homes\n🟢 Biogas Production: 1 tonne stubble = 300 cubic meters of cooking gas\n🌿 Mushroom Cultivation: Stubble becomes growing medium for high-value crops\n📜 Paper & Packaging: Eco-friendly alternatives to wood-based products\n💰 Government Incentives: $150 per hectare subsidy for mechanical management\n🤝 Cooperative Models: Farmer groups share expensive machinery costs\n\n🎆 Success Story: Ludhiana district reduced burning by 85% using these combined approaches, proving change is possible!",
      icon: "✅",
      color: "from-green-500 to-teal-500",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
      stats: { reduction: "85% in Ludhiana", subsidy: "$150/hectare", energy: "50K+ homes" }
    },
    {
      title: "🌍 Your Role in the Solution",
      content: "Every student can be a change agent in solving the stubble burning crisis:\n\n📱 Spread Awareness: Share facts with family and friends about stubble burning impacts\n📝 School Projects: Create presentations showing alternative solutions to farmers\n🌿 Community Action: Organize tree plantation drives to offset carbon emissions\n📰 Social Media: Use platforms to educate others about sustainable farming\n👥 Farmer Connect: Visit local farms to understand challenges firsthand\n📚 Research Projects: Study successful case studies from other regions\n🎨 Creative Campaigns: Design posters and videos promoting green alternatives\n\n🎆 Youth Power: Students in Punjab created a mobile app connecting farmers with machinery rental services, helping reduce burning by 30% in their district!",
      icon: "🌍",
      color: "from-purple-500 to-indigo-500",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop&crop=center",
      stats: { impact: "30% reduction", reach: "1M+ students", projects: "500+ schools" }
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`
            }}
          />
        ))}
      </div>

      <div className={`relative glass rounded-3xl p-8 border border-blue-500/30 transition-all duration-500 ${
        viewMode === 'immersive' ? 'scale-105 shadow-2xl shadow-blue-500/20' : ''
      }`}>
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            className="text-2xl font-bold flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
            >
              <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
            </motion.div>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Level 1: Stubble Burning
            </span>
          </motion.h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode(viewMode === 'normal' ? 'immersive' : 'normal')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'immersive' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-blue-400'
                }`}
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-lg transition-all ${
                  isPlaying ? 'bg-blue-500 text-white' : 'bg-slate-800 text-blue-400'
                }`}
              >
                {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-300 font-medium">
                {currentSlide + 1} / {slides.length}
              </span>
              <motion.div
                className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-4 h-4 text-blue-400" />
              </motion.div>
            </div>
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
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 15 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="min-h-[400px]"
            style={{
              transform: viewMode === 'immersive' ? `rotateX(${(mousePosition.y - window.innerHeight/2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth/2) * 0.01}deg)` : 'none'
            }}
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
              
              <div className="flex justify-center space-x-4 mb-4">
                <motion.div
                  className="w-3 h-3 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div
                  className="w-3 h-3 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-3 h-3 rounded-full bg-teal-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Main Content Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  className="glass rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)" }}
                >
                  <motion.div 
                    className="text-slate-200 text-base leading-relaxed whitespace-pre-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {slides[currentSlide].content}
                  </motion.div>
                  
                  <motion.div
                    className="mt-6 flex items-center space-x-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300 font-medium">Deep Learning Content</span>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="glass rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm overflow-hidden"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.img 
                    src={slides[currentSlide].image} 
                    alt={slides[currentSlide].title}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                  />
                  
                  {/* Stats Display */}
                  {slides[currentSlide].stats && (
                    <motion.div
                      className="grid grid-cols-3 gap-2 mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      {Object.entries(slides[currentSlide].stats).map(([key, value], index) => (
                        <div key={key} className="text-center p-2 bg-slate-800/50 rounded-lg">
                          <div className="text-lg font-bold text-blue-400">{value}</div>
                          <div className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </div>
              
              {/* Interactive Elements */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {['🌱 Eco-Friendly', '📊 Data-Driven', '🔬 Scientific', '💡 Innovative'].map((tag, index) => (
                  <motion.div
                    key={tag}
                    className="text-center p-3 bg-slate-800/30 rounded-xl border border-slate-700/50"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-sm font-medium text-slate-300">{tag}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div 
          className="flex justify-between items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
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
                className={`relative w-4 h-4 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-blue-500 scale-125' 
                    : completedSlides.has(index)
                    ? 'bg-blue-400'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
                {completedSlides.has(index) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
              currentSlide === slides.length - 1
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {currentSlide === slides.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mt-8 p-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, (i % 2 ? 1 : -1) * 100],
                      y: [0, -100]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    style={{
                      left: `${20 + i * 10}%`,
                      top: '50%'
                    }}
                  />
                ))}
              </div>
              
              <div className="text-center relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                </motion.div>
                <motion.h4 
                  className="text-2xl font-bold text-slate-200 mb-4"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  🎉 Lesson Complete! Key Takeaways
                </motion.h4>
                <motion.div
                  className="space-y-3 text-slate-300 font-medium text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    🔥 Burning fields harms people and the planet
                  </motion.p>
                  <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    🌱 Composting keeps air clean and improves soil
                  </motion.p>
                  <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    💡 Encourage your community to choose green solutions!
                  </motion.p>
                </motion.div>
                
                <motion.button
                  className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentSlide(0)}
                >
                  <RotateCcw className="w-5 h-5 inline mr-2" />
                  Restart Lesson
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StubbleBurningLesson;