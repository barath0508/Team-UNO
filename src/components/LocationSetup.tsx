import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateLocationBasedTask } from '../lib/gemini';

interface LocationSetupProps {
  onComplete: () => void;
}

const LocationSetup: React.FC<LocationSetupProps> = ({ onComplete }) => {
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  const indianStates = [
    'Punjab', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Gujarat', 
    'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'West Bengal'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Update user location
      await supabase
        .from('profiles')
        .update({ location, state, district })
        .eq('id', user.id);

      // Generate AI task for this location
      const task = await generateLocationBasedTask(location, 1);
      
      // Save generated task
      await supabase
        .from('location_tasks')
        .insert({
          location,
          title: task.title,
          description: task.description,
          points: task.points,
          difficulty: task.difficulty,
          category: task.category,
          local_context: task.localContext
        });
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
        <div className="text-center mb-8">
          <MapPin className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Set Your Location</h1>
          <p className="text-slate-400">Help us create personalized environmental challenges for your area</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select State</option>
              {indianStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              District
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              placeholder="Enter your district"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              City/Town
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              placeholder="Enter your city or town"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              'Generating Local Tasks...'
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LocationSetup;