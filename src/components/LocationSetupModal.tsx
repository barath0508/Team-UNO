import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LocationSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const LocationSetupModal: React.FC<LocationSetupModalProps> = ({ isOpen, onComplete }) => {
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!location || !state || !district) return;
    
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({
            location,
            state,
            district,
            first_login_completed: true
          })
          .eq('id', user.id);
      } catch (error) {
        // Store in localStorage as fallback
        localStorage.setItem(`location_${user.id}`, JSON.stringify({
          location, state, district, first_login_completed: true
        }));
      }
    }
    
    setLoading(false);
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700"
      >
        <div className="text-center mb-6">
          <MapPin className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Setup Your Location</h2>
          <p className="text-slate-400">Help us personalize your eco-missions</p>
        </div>

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
          onClick={handleSave}
          disabled={!location || !state || !district || loading}
          className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 inline mr-2" />
          {loading ? 'Saving...' : 'Save Location'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LocationSetupModal;