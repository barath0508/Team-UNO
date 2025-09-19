import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

interface VerificationHistoryProps {
  userId: string;
}

const VerificationHistory: React.FC<VerificationHistoryProps> = ({ userId }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  useEffect(() => {
    loadSubmissions();
  }, [userId]);

  const loadSubmissions = () => {
    const stored = localStorage.getItem('mission_submissions') || '[]';
    const allSubmissions = JSON.parse(stored);
    const userSubmissions = allSubmissions
      .filter((sub: any) => sub.user_id === userId)
      .sort((a: any, b: any) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    setSubmissions(userSubmissions);
  };

  const getStatusConfig = (submission: any) => {
    if (submission.status === 'approved') {
      return {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        label: 'Approved'
      };
    } else if (submission.status === 'pending') {
      return {
        icon: Clock,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        label: 'Under Review'
      };
    } else {
      return {
        icon: XCircle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        label: 'Rejected'
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <History className="w-5 h-5 text-blue-400 mr-2" />
        <h3 className="text-lg font-bold text-white">Verification History</h3>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No submissions yet</p>
          <p className="text-sm">Complete missions to see your verification history</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission, index) => {
            const config = getStatusConfig(submission);
            const IconComponent = config.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${config.bg} ${config.border} border rounded-lg p-4 hover:bg-opacity-80 transition-all cursor-pointer`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-5 h-5 ${config.color}`} />
                    <div>
                      <div className="font-semibold text-white text-sm">
                        {submission.mission_title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                    {submission.ai_verification && (
                      <div className="text-xs text-slate-400">
                        AI: {submission.ai_verification.confidence}%
                      </div>
                    )}
                    <Eye className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Submission Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-white mb-1">
                  {selectedSubmission.mission_title}
                </div>
                <div className="text-xs text-slate-400">
                  Submitted: {new Date(selectedSubmission.submitted_at).toLocaleString()}
                </div>
              </div>

              {selectedSubmission.proof_image && (
                <div>
                  <div className="text-sm font-semibold text-white mb-2">Proof Image</div>
                  <img
                    src={selectedSubmission.proof_image}
                    alt="Submission proof"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              {selectedSubmission.ai_verification && (
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <div className="text-sm font-semibold text-blue-400 mb-2">AI Analysis</div>
                  <div className="text-xs text-slate-300 mb-2">
                    Confidence: {selectedSubmission.ai_verification.confidence}%
                  </div>
                  <p className="text-xs text-slate-300">
                    {selectedSubmission.ai_verification.feedback}
                  </p>
                </div>
              )}

              <div className={`${getStatusConfig(selectedSubmission).bg} ${getStatusConfig(selectedSubmission).border} border rounded-lg p-3`}>
                <div className={`text-sm font-semibold ${getStatusConfig(selectedSubmission).color}`}>
                  Status: {getStatusConfig(selectedSubmission).label}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubmission(null)}
              className="w-full mt-4 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VerificationHistory;