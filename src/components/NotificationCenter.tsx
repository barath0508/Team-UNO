import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Target, Trophy, Calendar } from 'lucide-react';

interface NotificationCenterProps {
  profile: any;
  taskCompleted: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ profile, taskCompleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const generateNotifications = () => {
      const notifs = [];
      
      if (!taskCompleted) {
        notifs.push({
          id: 1,
          type: 'task',
          title: 'Daily Mission Pending',
          message: 'Complete your daily eco mission to earn points!',
          icon: Target,
          color: 'text-blue-400'
        });
      }

      const pointsToNext = 50 - (profile.eco_points % 50);
      if (pointsToNext <= 10) {
        notifs.push({
          id: 2,
          type: 'level',
          title: 'Level Up Soon!',
          message: `Only ${pointsToNext} points needed for next level`,
          icon: Trophy,
          color: 'text-yellow-400'
        });
      }

      if (profile.eco_points >= 25 && profile.eco_points < 50) {
        notifs.push({
          id: 3,
          type: 'achievement',
          title: 'New Achievement Available',
          message: 'Reach 50 points to unlock "Level Up!" badge',
          icon: Trophy,
          color: 'text-emerald-400'
        });
      }

      setNotifications(notifs);
    };

    generateNotifications();
  }, [profile.eco_points, taskCompleted]);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-slate-800/50 border border-slate-700 rounded-full hover:border-emerald-500/50 transition-all"
      >
        <Bell className="w-5 h-5 text-slate-300" />
        {notifications.length > 0 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
          >
            {notifications.length}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-16 right-0 w-80 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                  >
                    <notif.icon className={`w-5 h-5 mr-3 mt-0.5 ${notif.color}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{notif.title}</div>
                      <div className="text-slate-400 text-xs">{notif.message}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;