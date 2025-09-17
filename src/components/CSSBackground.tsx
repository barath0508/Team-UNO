import React from 'react';
import { motion } from 'framer-motion';

const CSSBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
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
      
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-16 h-16 border border-emerald-400/20 rotate-45"
        animate={{
          rotate: [45, 405, 45],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-12 h-12 border border-blue-400/20 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/3 w-8 h-8 bg-purple-400/10 transform rotate-12"
        animate={{
          rotate: [12, 372, 12],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default CSSBackground;