import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Brain, Award, Clock } from 'lucide-react';

interface VerificationResultProps {
  result: {
    verified: boolean;
    confidence: number;
    feedback: string;
  };
  missionTitle: string;
  points: number;
  onContinue: () => void;
}

const VerificationResult: React.FC<VerificationResultProps> = ({ 
  result, 
  missionTitle, 
  points, 
  onContinue 
}) => {
  const getStatusConfig = () => {
    if (result.verified && result.confidence >= 70) {
      return {
        icon: CheckCircle,
        title: 'Mission Verified!',
        subtitle: 'Congratulations! Your submission has been approved.',
        color: 'green',
        bgGradient: 'from-green-500/20 to-emerald-500/20',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-400',
        action: 'approved'
      };
    } else if (result.confidence >= 50) {
      return {
        icon: AlertTriangle,
        title: 'Under Review',
        subtitle: 'Your submission needs manual verification.',
        color: 'yellow',
        bgGradient: 'from-yellow-500/20 to-orange-500/20',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-400',
        action: 'review'
      };
    } else {
      return {
        icon: XCircle,
        title: 'Verification Failed',
        subtitle: 'Please try again with clearer evidence.',
        color: 'red',
        bgGradient: 'from-red-500/20 to-pink-500/20',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        action: 'failed'
      };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} rounded-2xl border ${config.borderColor} p-6`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${config.bgGradient} flex items-center justify-center`}
        >
          <IconComponent className={`w-8 h-8 ${config.textColor}`} />
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-xl font-bold ${config.textColor} mb-2`}
        >
          {config.title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-300 text-sm"
        >
          {config.subtitle}
        </motion.p>
      </div>

      {/* Mission Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/30 rounded-lg p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-semibold text-sm">{missionTitle}</span>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-bold">+{points} pts</span>
          </div>
        </div>
      </motion.div>

      {/* AI Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/20 rounded-lg p-4 mb-4"
      >
        <div className="flex items-center mb-3">
          <Brain className="w-4 h-4 text-blue-400 mr-2" />
          <span className="text-blue-400 font-semibold text-sm">AI Analysis</span>
          <div className="ml-auto flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              result.confidence >= 70 ? 'bg-green-400' :
              result.confidence >= 50 ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            <span className="text-xs text-slate-400">
              {result.confidence}% confidence
            </span>
          </div>
        </div>
        
        {/* Confidence Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className={`h-2 rounded-full ${
              result.confidence >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              result.confidence >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
          />
        </div>
        
        <p className="text-slate-300 text-xs leading-relaxed">
          {result.feedback}
        </p>
      </motion.div>

      {/* Status-specific content */}
      {config.action === 'approved' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4"
        >
          <div className="flex items-center text-green-400 text-sm font-medium">
            <CheckCircle className="w-4 h-4 mr-2" />
            Points awarded automatically!
          </div>
          <p className="text-green-300 text-xs mt-1">
            Your eco points have been updated and achievements unlocked.
          </p>
        </motion.div>
      )}

      {config.action === 'review' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4"
        >
          <div className="flex items-center text-yellow-400 text-sm font-medium">
            <Clock className="w-4 h-4 mr-2" />
            Manual review required
          </div>
          <p className="text-yellow-300 text-xs mt-1">
            Our team will review your submission within 24 hours.
          </p>
        </motion.div>
      )}

      {config.action === 'failed' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4"
        >
          <div className="flex items-center text-red-400 text-sm font-medium">
            <XCircle className="w-4 h-4 mr-2" />
            Try again with better evidence
          </div>
          <p className="text-red-300 text-xs mt-1">
            Make sure your photo clearly shows the completed mission.
          </p>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          config.action === 'approved'
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
            : config.action === 'review'
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
            : 'bg-gradient-to-r from-slate-600 to-slate-500 text-white hover:from-slate-500 hover:to-slate-400'
        }`}
      >
        {config.action === 'approved' ? 'Continue →' :
         config.action === 'review' ? 'Got it' :
         'Try Again'}
      </motion.button>
    </motion.div>
  );
};

export default VerificationResult;