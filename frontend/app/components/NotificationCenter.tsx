'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Bell, X, Check, Sparkles, Star, Heart, Calendar, 
  TrendingUp, Award, Zap, Info, AlertCircle, CheckCircle,
  Clock, Trash2, Settings as SettingsIcon
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'prediction' | 'compatibility' | 'chart' | 'system' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: string;
  actionUrl?: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  // Load notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notifications:', e);
      }
    } else {
      // Initialize with welcome notifications
      const welcomeNotifications: Notification[] = [
        {
          id: Date.now().toString(),
          type: 'system',
          title: '🎉 Welcome to AstroAI!',
          message: 'Your cosmic journey begins. Explore predictions, charts, and insights.',
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'achievement',
          title: '🏆 First Steps',
          message: 'Achievement unlocked: Create your first birth chart to get started!',
          timestamp: new Date().toISOString(),
          read: false,
        }
      ];
      setNotifications(welcomeNotifications);
      localStorage.setItem('notifications', JSON.stringify(welcomeNotifications));
    }

    // Listen for new notifications from other components
    const handleNewNotification = (e: CustomEvent) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...e.detail,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      setNotifications(prev => {
        const updated = [newNotification, ...prev].slice(0, 50); // Keep last 50
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('newNotification' as any, handleNewNotification);
    return () => window.removeEventListener('newNotification' as any, handleNewNotification);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    if (confirm('Clear all notifications?')) {
      setNotifications([]);
      localStorage.removeItem('notifications');
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'prediction':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'compatibility':
        return <Heart className="w-5 h-5 text-pink-400" />;
      case 'chart':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-green-400" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-shake' : ''}`} />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-purple-500/10 z-50 overflow-hidden animate-slideDown">
          {/* Header */}
          <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'unread'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium">No notifications yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  {filter === 'unread' ? "You're all caught up!" : 'Notifications will appear here'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/30">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-white/5 transition-all group ${
                      !notification.read ? 'bg-purple-600/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 mt-0.5 p-2 rounded-lg ${
                        !notification.read ? 'bg-purple-600/20' : 'bg-slate-800/50'
                      }`}>
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`font-semibold text-sm ${
                            !notification.read ? 'text-white' : 'text-slate-300'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{getTimeAgo(notification.timestamp)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-700/50 bg-slate-900/50 flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex-1 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAll}
                className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}

// Helper function to trigger notifications from other components
export const sendNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  const event = new CustomEvent('newNotification', { detail: notification });
  window.dispatchEvent(event);
};
