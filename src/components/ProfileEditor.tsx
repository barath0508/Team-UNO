import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onUpdate: (updatedProfile: any) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ isOpen, onClose, profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            ...formData,
            updated_at: new Date().toISOString()
          });

        if (!error) {
          onUpdate({ ...profile, ...formData });
          onClose();
        }
      }
    } catch (error) {
      console.log('Profile update error:', error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <User className="w-6 h-6 mr-2 text-emerald-400" />
            Edit Profile
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {formData.full_name.charAt(0) || 'U'}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 hover:bg-blue-600">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileEditor;