import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FirstTimeSetupProps {
  isOpen: boolean;
  onComplete: () => void;
}

const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ isOpen, onComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => completeSetup(), 1000);
      }, 1000);
    }
  }, [isOpen]);

  const completeSetup = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const calculateAge = (dob: string) => {
        if (!dob) return 18;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };
      
      const userAge = user.user_metadata?.date_of_birth ? calculateAge(user.user_metadata.date_of_birth) : 18;
      
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name || '',
            mobile: user.user_metadata?.mobile || '',
            date_of_birth: user.user_metadata?.date_of_birth || null,
            age: userAge,
            first_login_completed: true
          }, {
            onConflict: 'id'
          });
          
        if (error) {
          throw error;
        }
      } catch (error) {
        // Fallback to localStorage
        console.log('Profile save error:', error);
        localStorage.setItem(`setup_${user.id}`, JSON.stringify({
          age: userAge, date_of_birth: user.user_metadata?.date_of_birth, first_login_completed: true
        }));
      }
    }
    
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700"
      >
        {loading ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Setting Up Your Profile</h2>
            <p className="text-slate-400 mb-6">Preparing your eco-warrior dashboard...</p>
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Setup Complete!</h2>
            <p className="text-slate-400">Redirecting to dashboard...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FirstTimeSetup;