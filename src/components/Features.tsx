import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Users, 
  Trophy, 
  Smartphone, 
  Target, 
  BarChart3, 
  Gamepad2,
  Leaf,
  Camera
} from 'lucide-react';

const Features: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const features = [
    {
      icon: Users,
      title: 'Digital Avatar & Eco-Footprint',
      description: 'Create your unique avatar that evolves based on your real-world environmental actions.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Smartphone,
      title: 'Interactive AR Learning',
      description: 'Experience environmental concepts through augmented reality and localized case studies.',
      gradient: 'from-teal-500 to-blue-500'
    },
    {
      icon: Target,
      title: 'Green Quest Challenges',
      description: 'Complete daily micro-actions, school campaigns, and community mega-quests.',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: Trophy,
      title: 'Gamified Rewards',
      description: 'Earn Eco Points, unlock badges, and redeem eco-friendly rewards.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Impact Analytics',
      description: 'Track your individual and collective environmental impact in real-time.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Gamepad2,
      title: 'Teacher Dashboard',
      description: 'Comprehensive tools for educators to manage classes and create custom challenges.',
      gradient: 'from-rose-500 to-emerald-500'
    }
  ];

  return (
    <section id="features" ref={ref} className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm mb-6">
            <Leaf className="w-4 h-4 mr-2" />
            Key Features
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Revolutionary Platform
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the future of environmental education with our innovative features 
            designed to engage, educate, and empower students.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl from-emerald-500/20 to-teal-500/20" />
              
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 h-full hover:border-emerald-500/50 transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>

                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Camera className="w-5 h-5 text-emerald-400" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 right-10 w-16 h-16 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"
        />
        
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 left-10 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        />
      </div>
    </section>
  );
};

export default Features;