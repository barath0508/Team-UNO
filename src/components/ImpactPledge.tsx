import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImpactPledgeProps {
  onComplete: () => void;
}

const ImpactPledge: React.FC<ImpactPledgeProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);

  const takePledge = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ 
          has_taken_pledge: true, 
          eco_points: 25 
        })
        .eq('id', user.id);
    }
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <Leaf className="w-24 h-24 text-emerald-400 mx-auto" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Welcome, Future Eco-Warrior!
        </h1>

        <p className="text-xl text-slate-300 mb-12">
          Take the pledge to make a difference for our planet. 
          Every small action creates a ripple of positive change.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={takePledge}
          disabled={loading}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 px-12 rounded-full text-xl disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center">
              <Award className="w-6 h-6 mr-2 animate-spin" />
              Awarding Points...
            </div>
          ) : (
            "I Pledge to Act!"
          )}
        </motion.button>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-emerald-400"
          >
            🎉 Congratulations! You earned 25 Eco Points and the Pledge Badge!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ImpactPledge;