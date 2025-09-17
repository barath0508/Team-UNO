import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Smartphone, Camera, Cloud, Database, Cpu, Shield } from 'lucide-react';

const Technology: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const techStack = [
    {
      icon: Smartphone,
      title: 'React Native',
      description: 'Cross-platform mobile development',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Camera,
      title: 'AR Integration',
      description: 'ARKit & ARCore for immersive experiences',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'AWS/Azure for scalable deployment',
      color: 'from-emerald-400 to-teal-400'
    },
    {
      icon: Database,
      title: 'PostgreSQL',
      description: 'Robust data management system',
      color: 'from-orange-400 to-red-400'
    },
    {
      icon: Cpu,
      title: 'AI Analytics',
      description: 'Smart impact calculation algorithms',
      color: 'from-indigo-400 to-purple-400'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'End-to-end data protection',
      color: 'from-green-400 to-emerald-400'
    }
  ];

  return (
    <section id="technology" ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #10b981 1px, transparent 1px),
              linear-gradient(180deg, #10b981 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium backdrop-blur-sm mb-6">
            <Cpu className="w-4 h-4 mr-2" />
            Technology Stack
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cutting-Edge Technology
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Built with modern technologies to deliver seamless user experiences 
            and scalable performance across all devices.
          </p>
        </motion.div>

        {/* AR Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Phone mockup */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-4 mx-auto w-80 shadow-2xl">
              <div className="bg-slate-950 rounded-2xl aspect-[9/16] relative overflow-hidden">
                {/* AR content simulation */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-blue-400/20 to-purple-400/20">
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-60 blur-xl"
                  />
                  <motion.div
                    animate={{
                      y: [0, 15, 0],
                      x: [0, 10, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 blur-xl"
                  />
                </div>
                
                <div className="absolute inset-4 flex flex-col justify-center items-center text-center">
                  <Camera className="w-12 h-12 text-emerald-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">AR Learning Mode</h3>
                  <p className="text-slate-300 text-sm">Point camera at textbook for 3D models</p>
                </div>
              </div>
            </div>

            {/* Floating AR elements */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 blur-xl"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"
            />
          </div>
        </motion.div>

        {/* Tech stack grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-300`} />
              
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300">
                <motion.div
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.6 }
                  }}
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${tech.color} mb-6`}
                >
                  <tech.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {tech.title}
                </h3>
                
                <p className="text-slate-300 leading-relaxed">
                  {tech.description}
                </p>

                {/* Connecting lines */}
                {index < techStack.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 origin-left"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { metric: '99.9%', label: 'Uptime' },
              { metric: '<100ms', label: 'Response Time' },
              { metric: '50M+', label: 'API Calls/Day' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl p-6"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {item.metric}
                </div>
                <div className="text-slate-300 mt-2">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Technology;