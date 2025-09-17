import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Droplets, Zap, TreePine, Recycle, Users, Trophy, TrendingUp } from 'lucide-react';

const Impact: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  
  const impactStats = [
    {
      icon: Droplets,
      value: 1000000,
      label: 'Litres Water Saved',
      color: 'from-blue-400 to-cyan-400',
      suffix: 'L'
    },
    {
      icon: TreePine,
      value: 5000,
      label: 'Trees Equivalent CO₂ Reduction',
      color: 'from-green-400 to-emerald-400',
      suffix: ''
    },
    {
      icon: Recycle,
      value: 50000,
      label: 'Kg Waste Recycled',
      color: 'from-purple-400 to-pink-400',
      suffix: 'kg'
    },
    {
      icon: Zap,
      value: 750000,
      label: 'kWh Energy Saved',
      color: 'from-yellow-400 to-orange-400',
      suffix: 'kWh'
    },
    {
      icon: Users,
      value: 10000,
      label: 'Active Warriors',
      color: 'from-teal-400 to-blue-400',
      suffix: '+'
    },
    {
      icon: Trophy,
      value: 500,
      label: 'Partner Schools',
      color: 'from-emerald-400 to-teal-400',
      suffix: '+'
    }
  ];

  return (
    <section id="impact" ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            scale: [1, 1.1, 1],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 40% 80%, #8b5cf6 0%, transparent 50%)`,
            backgroundSize: '100% 100%',
          }}
        />
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-flex items-center px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}
            animate={{ 
              boxShadow: ['0 0 0px rgba(16, 185, 129, 0)', '0 0 20px rgba(16, 185, 129, 0.2)', '0 0 0px rgba(16, 185, 129, 0)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
            </motion.div>
            Real Impact
          </motion.span>
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          >
            Collective Achievement
          </motion.h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Together, our Prakriti Warriors community has created measurable environmental impact 
            across Punjab and beyond.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50, rotateY: -90 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 50, rotateY: -90 }}
              transition={{ duration: 0.8, delay: index * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ 
                y: -15, 
                scale: 1.05, 
                rotateY: 5,
                transition: { type: 'spring', stiffness: 300 }
              }}
              className="group relative"
            >
              {/* Enhanced glow effect */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-30 rounded-2xl blur-xl transition-all duration-300`}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0, 0.1, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              />
              
              <motion.div 
                className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 text-center hover:border-emerald-500/50 transition-all duration-300"
                whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1, type: 'spring' }}
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1,
                    transition: { duration: 0.5 }
                  }}
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${stat.color} mb-6 relative overflow-hidden`}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  <stat.icon className="w-8 h-8 text-white relative z-10" />
                </motion.div>

                <AnimatedCounter
                  value={stat.value}
                  isInView={isInView}
                  delay={0.5 + index * 0.1}
                  suffix={stat.suffix}
                  color={stat.color}
                />
                
                <p className="text-slate-300 font-medium mt-2">
                  {stat.label}
                </p>

                {/* CSS animated shape */}
                <motion.div
                  className="absolute top-2 right-2 w-8 h-8 border border-emerald-400/30 rounded-full"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Enhanced floating particles */}
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [-10, 10, -10],
                      x: [-5, 5, -5],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3 + i + index,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                    className={`absolute w-1 h-1 bg-gradient-to-r ${stat.color} rounded-full`}
                    style={{
                      top: `${20 + i * 20}%`,
                      left: `${15 + i * 10}%`,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Progress visualization */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Our Journey to 2030</h3>
            <div className="space-y-4">
              {[
                { label: 'Carbon Footprint Reduction', progress: 65, color: 'from-green-400 to-emerald-400' },
                { label: 'Waste Reduction Target', progress: 78, color: 'from-blue-400 to-cyan-400' },
                { label: 'Water Conservation Goal', progress: 82, color: 'from-purple-400 to-pink-400' },
              ].map((item, index) => (
                <div key={item.label} className="text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-white font-semibold">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${item.progress}%` } : { width: 0 }}
                      transition={{ duration: 1.5, delay: 1 + index * 0.2, ease: 'easeOut' }}
                      className={`h-2 bg-gradient-to-r ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface AnimatedCounterProps {
  value: number;
  isInView: boolean;
  delay: number;
  suffix: string;
  color: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, isInView, delay, suffix, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);

      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
      {formatNumber(count)}{suffix}
    </div>
  );
};

export default Impact;