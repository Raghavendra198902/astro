'use client';

import { useState, useEffect } from 'react';
import {
  User, TrendingUp, Heart, Calendar, Star, Eye, Download,
  FileText, Zap, Users, Hash, Globe, Target, BookOpen,
  Clock, CheckCircle, XCircle, AlertCircle, Settings,
  Filter, Search, Trash2, ChevronDown, RotateCcw
} from 'lucide-react';

export interface Activity {
  id: string;
  type: 'chart_created' | 'prediction_generated' | 'compatibility_checked' | 
        'panchang_viewed' | 'numerology_calculated' | 'consultation_booked' |
        'face_reading' | 'palmistry' | 'chart_viewed' | 'pdf_exported' |
        'theme_changed' | 'settings_updated' | 'learning_accessed';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error';
  metadata?: Record<string, any>;
}

interface ActivityTimelineProps {
  maxItems?: number;
  showFilters?: boolean;
  compact?: boolean;
}

export default function ActivityTimeline({ 
  maxItems = 20, 
  showFilters = true,
  compact = false 
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load activities from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem('activityHistory');
    if (savedActivities) {
      try {
        const parsed = JSON.parse(savedActivities);
        setActivities(parsed.slice(0, maxItems));
      } catch (e) {
        console.error('Failed to parse activities:', e);
      }
    }

    // Listen for new activities
    const handleNewActivity = (event: CustomEvent<Activity>) => {
      setActivities(prev => {
        const updated = [event.detail, ...prev].slice(0, maxItems);
        localStorage.setItem('activityHistory', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('new-activity' as any, handleNewActivity);
    return () => window.removeEventListener('new-activity' as any, handleNewActivity);
  }, [maxItems]);

  // Filter activities
  useEffect(() => {
    let filtered = [...activities];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.type === filterType);
    }

    // Filter by time
    const now = new Date();
    if (filterTime !== 'all') {
      filtered = filtered.filter(a => {
        const activityDate = new Date(a.timestamp);
        const diffTime = Math.abs(now.getTime() - activityDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (filterTime === 'today') return diffDays === 0;
        if (filterTime === 'week') return diffDays <= 7;
        if (filterTime === 'month') return diffDays <= 30;
        return true;
      });
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    setFilteredActivities(filtered);
  }, [activities, filterType, filterTime, searchQuery]);

  // Clear all activities
  const clearAllActivities = () => {
    setActivities([]);
    localStorage.removeItem('activityHistory');
    setShowClearConfirm(false);
  };

  // Get icon for activity type
  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      chart_created: User,
      prediction_generated: TrendingUp,
      compatibility_checked: Heart,
      panchang_viewed: Calendar,
      numerology_calculated: Hash,
      consultation_booked: Users,
      face_reading: Globe,
      palmistry: Target,
      chart_viewed: Eye,
      pdf_exported: Download,
      theme_changed: Settings,
      settings_updated: Settings,
      learning_accessed: BookOpen
    };
    return icons[type] || FileText;
  };

  // Get color for activity type
  const getActivityColor = (type: Activity['type']) => {
    const colors = {
      chart_created: 'from-purple-600 to-purple-700',
      prediction_generated: 'from-blue-600 to-blue-700',
      compatibility_checked: 'from-pink-600 to-pink-700',
      panchang_viewed: 'from-amber-600 to-amber-700',
      numerology_calculated: 'from-cyan-600 to-cyan-700',
      consultation_booked: 'from-green-600 to-green-700',
      face_reading: 'from-indigo-600 to-indigo-700',
      palmistry: 'from-rose-600 to-rose-700',
      chart_viewed: 'from-slate-600 to-slate-700',
      pdf_exported: 'from-emerald-600 to-emerald-700',
      theme_changed: 'from-violet-600 to-violet-700',
      settings_updated: 'from-gray-600 to-gray-700',
      learning_accessed: 'from-orange-600 to-orange-700'
    };
    return colors[type] || 'from-gray-600 to-gray-700';
  };

  // Get status icon
  const getStatusIcon = (status?: string) => {
    if (status === 'success') return CheckCircle;
    if (status === 'warning') return AlertCircle;
    if (status === 'error') return XCircle;
    return null;
  };

  // Format time ago
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {filteredActivities.slice(0, 5).map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div className={`p-2 bg-gradient-to-br ${colorClass} rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                <p className="text-xs text-slate-400">{getTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Activity Timeline
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Track your recent actions and history
          </p>
        </div>
        {activities.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && activities.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="chart_created">Charts</option>
            <option value="prediction_generated">Predictions</option>
            <option value="compatibility_checked">Compatibility</option>
            <option value="panchang_viewed">Panchang</option>
            <option value="numerology_calculated">Numerology</option>
            <option value="consultation_booked">Consultations</option>
          </select>

          {/* Time Filter */}
          <select
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value as any)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700/30">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-1">No activities yet</p>
            <p className="text-slate-500 text-sm">
              Your activity will appear here as you use the dashboard
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              const StatusIcon = getStatusIcon(activity.status);
              const isLast = index === filteredActivities.length - 1;

              return (
                <div key={activity.id} className="relative pl-8">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-[15px] top-12 bottom-0 w-px bg-gradient-to-b from-slate-700/50 to-transparent"></div>
                  )}

                  {/* Activity card */}
                  <div className="group relative">
                    {/* Icon */}
                    <div className={`absolute left-[-32px] top-2 p-2 bg-gradient-to-br ${colorClass} rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    {/* Content */}
                    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white">{activity.title}</h4>
                            {StatusIcon && (
                              <StatusIcon className={`w-4 h-4 ${
                                activity.status === 'success' ? 'text-green-400' :
                                activity.status === 'warning' ? 'text-yellow-400' :
                                'text-red-400'
                              }`} />
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{activity.description}</p>
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(activity.metadata).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300"
                                >
                                  {key}: <span className="text-purple-400">{String(value)}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowClearConfirm(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Clear All Activities?</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    This will permanently delete all {activities.length} activities from your history. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={clearAllActivities}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to add activities from anywhere in the app
export function addActivity(activity: Omit<Activity, 'id' | 'timestamp'>) {
  const newActivity: Activity = {
    ...activity,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };

  window.dispatchEvent(new CustomEvent('new-activity', { detail: newActivity }));
}
