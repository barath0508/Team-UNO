import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FirstTimeSetupProps {
  isOpen: boolean;
  onComplete: () => void;
}

const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [ecoAnswers, setEcoAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    { q: "How do you usually commute?", options: ["Walk/Bike", "Public Transport", "Private Car"] },
    { q: "How often do you recycle?", options: ["Always", "Sometimes", "Rarely"] },
    { q: "Your water usage habits?", options: ["Very Conscious", "Moderate", "High Usage"] }
  ];

  const handleLocationNext = () => {
    if (location && state && district) {
      setStep(1);
    }
  };

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
            location,
            state,
            district,
            eco_footprint_score: footprintScore,
            age: 18, // Default age, can be updated later
            first_login_completed: true
          })
          .eq('id', user.id);
      } catch (error) {
        localStorage.setItem(`setup_${user.id}`, JSON.stringify({
          location, state, district, eco_footprint_score: footprintScore, first_login_completed: true
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
        {step === 0 ? (
          <div className="text-center">
            <MapPin className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Set Your Location</h2>
            <p className="text-slate-400 mb-6">Help us personalize your eco-missions</p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="City/Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLocationNext}
              disabled={!location || !state || !district}
              className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Next: Eco Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </div>
        ) : (
          <div className="text-center">
            <User className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Eco-Footprint Quiz</h2>
            
            <div className="mb-6">
              <div className="text-sm text-slate-400 mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
                  className="w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-left"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FirstTimeSetup;