'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Star, Users, Heart, Calendar, Activity, Zap, Award } from 'lucide-react';

interface Stats {
  todayPredictions: number;
  weeklyActivity: number;
  favoriteFeature: string;
  streakDays: number;
}

export default function QuickStatsWidget() {
  const [stats, setStats] = useState<Stats>({
    todayPredictions: 0,
    weeklyActivity: 0,
    favoriteFeature: 'Charts',
    streakDays: 0
  });

  useEffect(() => {
    // Load stats from localStorage
    const loadStats = () => {
      const stored = localStorage.getItem('userActivityStats');
      if (stored) {
        try {
          setStats(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse stats:', e);
        }
      }
    };

    loadStats();
    
    // Update stats periodically
    const interval = setInterval(loadStats, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  // Track activity (to be called from other components)
  const trackActivity = (feature: string) => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('userActivityStats');
    let currentStats = stats;
    
    if (stored) {
      try {
        currentStats = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stats:', e);
      }
    }

    const lastActive = localStorage.getItem('lastActiveDate');
    let newStreak = currentStats.streakDays;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive === yesterday.toDateString()) {
        newStreak++;
      } else {
        newStreak = 1;
      }
      
      localStorage.setItem('lastActiveDate', today);
    }

    const updatedStats = {
      ...currentStats,
      todayPredictions: lastActive === today ? currentStats.todayPredictions + 1 : 1,
      weeklyActivity: currentStats.weeklyActivity + 1,
      favoriteFeature: feature,
      streakDays: newStreak
    };

    localStorage.setItem('userActivityStats', JSON.stringify(updatedStats));
    setStats(updatedStats);
  };

  const statItems = [
    {
      icon: TrendingUp,
      label: 'Today',
      value: stats.todayPredictions,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Activity,
      label: 'This Week',
      value: stats.weeklyActivity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Zap,
      label: 'Streak',
      value: `${stats.streakDays}d`,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: Star,
      label: 'Favorite',
      value: stats.favoriteFeature,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Your Activity
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`${item.bgColor} rounded-xl p-4 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {item.value}
              </div>
              <div className="text-xs text-gray-400">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {stats.streakDays >= 7 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-400">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">
              🔥 Amazing! {stats.streakDays} day streak!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Export tracking function for use in other components
export const trackActivity = (feature: string) => {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent('trackActivity', { detail: { feature } });
  window.dispatchEvent(event);
};
