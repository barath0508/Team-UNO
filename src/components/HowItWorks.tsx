import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Zap, TrendingUp, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const navigate = useNavigate();

  const steps = [
    {
      icon: BookOpen,
      title: 'LEARN',
      description: 'Interactive, curriculum-aligned content with AR experiences and localized case studies.',
      color: 'from-emerald-400 to-teal-400'
    },
    {
      icon: Zap,
      title: 'ACT',
      description: 'Complete personalized challenges, school campaigns, and community projects.',
      color: 'from-teal-400 to-blue-400'
    },
    {
      icon: TrendingUp,
      title: 'IMPACT',
      description: 'Measure individual and collective environmental impact with real-time analytics.',
      color: 'from-blue-400 to-purple-400'
    }
  ];

  return (
    <section id="how-it-works" ref={ref} className="py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm mb-6">
            <Repeat className="w-4 h-4 mr-2" />
            The Process
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Learn-Act-Impact Loop
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our continuous cycle transforms learning into lasting behavioral change 
            and measurable environmental impact.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative text-center group"
              >
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-white border border-slate-600">
                  {index + 1}
                </div>

                {/* Icon container */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`relative mx-auto w-24 h-24 rounded-full bg-gradient-to-r ${step.color} p-6 mb-6 group-hover:shadow-2xl transition-all duration-300`}
                >
                  <step.icon className="w-full h-full text-white" />
                  
                  {/* Glow effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>

                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                  {step.title}
                </h3>
                
                <p className="text-slate-300 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                    className="hidden lg:block absolute top-12 -right-8 z-10"
                  >
                    <div className="w-16 h-16 flex items-center justify-center">
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl"
                      >
                        →
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
          >
            <Repeat className="w-5 h-5 mr-2" />
            Start the Loop
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;