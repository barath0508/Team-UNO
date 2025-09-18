import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AvatarSetupProps {
  onComplete: () => void;
}

const AvatarSetup: React.FC<AvatarSetupProps> = ({ onComplete }) => {
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [ecoAnswers, setEcoAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const accessories = ['🌱', '🌿', '🍃', '🌳', '♻️', '🌍'];
  const questions = [
    { q: "How do you usually commute?", options: ["Walk/Bike", "Public Transport", "Private Car"] },
    { q: "How often do you recycle?", options: ["Always", "Sometimes", "Rarely"] },
    { q: "Your water usage habits?", options: ["Very Conscious", "Moderate", "High Usage"] }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...ecoAnswers, answerIndex];
    setEcoAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeSetup(newAnswers);
    }
  };

  const completeSetup = async (answers: number[]) => {
    const footprintScore = answers.reduce((sum, answer) => sum + (answer + 1), 0) * 10;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ 
            avatar_accessories: selectedAccessories,
            eco_footprint_score: footprintScore,
            first_login_completed: true
          })
          .eq('id', user.id);
      } catch (error) {
        // Store in localStorage as fallback
        localStorage.setItem(`avatar_${user.id}`, JSON.stringify({
          avatar_accessories: selectedAccessories,
          eco_footprint_score: footprintScore,
          first_login_completed: true
        }));
      }
    }
    
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {currentQuestion < questions.length ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">Eco-Footprint Quiz</h2>
            <div className="mb-6">
              <div className="text-sm text-slate-400 mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            <h3 className="text-xl mb-6">{questions[currentQuestion].q}</h3>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">Customize Your Avatar</h2>
            
            <div className="mb-8">
              <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                <User className="w-12 h-12" />
                {selectedAccessories.map((acc, i) => (
                  <span key={i} className="absolute">{acc}</span>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {accessories.map((acc, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (selectedAccessories.includes(acc)) {
                        setSelectedAccessories(selectedAccessories.filter(a => a !== acc));
                      } else {
                        setSelectedAccessories([...selectedAccessories, acc]);
                      }
                    }}
                    className={`p-3 rounded-lg text-2xl ${
                      selectedAccessories.includes(acc) 
                        ? 'bg-emerald-500' 
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {acc}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentQuestion(0)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center"
            >
              Complete Setup
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AvatarSetup;