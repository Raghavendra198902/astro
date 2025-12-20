'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, Star, Calendar, Heart, Users, 
  Zap, Award, BarChart3, ArrowRight, Sparkles, Loader2,
  Flame, Moon, Sun, Activity, Target
} from 'lucide-react';
import QuickStatsWidget from '../components/QuickStatsWidget';
import ActivityTimeline from '../components/ActivityTimeline';
import { useTranslations } from '../hooks/useTranslations';

interface Stats {
  charts_count: number;
  predictions_count: number;
  consultations_count: number;
  compatibility_count: number;
}

interface Prediction {
  id: string;
  title: string;
  created_at: string;
  category: string;
  confidence?: number;
}

interface PanchangData {
  tithi: string;
  nakshatra: string;
  yoga: string;
}

export default function DashboardPage() {
  const { dashboard } = useTranslations();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Load dashboard statistics from analytics endpoint
      try {
        const statsRes = await fetch('/api/v1/analytics/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const data = await statsRes.json();
          const overview = data.overview || {};
          setStats({
            charts_count: overview.charts_generated || 0,
            predictions_count: overview.predictions_made || 0,
            consultations_count: overview.consultations_booked || 0,
            compatibility_count: overview.compatibility_checks || 0
          });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
      
      // Load today's panchang (using default Mumbai coordinates)
      try {
        const panchangRes = await fetch(
          '/api/v1/panchang/',
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (panchangRes.ok) {
          const data = await panchangRes.json();
          setPanchang({
            tithi: data.tithi?.name || 'N/A',
            nakshatra: data.nakshatra?.name || 'N/A',
            yoga: data.yoga?.name || 'N/A'
          });
        }
      } catch (error) {
        console.error('Failed to load panchang:', error);
      }

      // Load recent predictions
      try {
        const predictionsRes = await fetch('/api/v1/events/?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (predictionsRes.ok) {
          const data = await predictionsRes.json();
          if (Array.isArray(data)) {
            setPredictions(data.slice(0, 5));
          }
        }
      } catch (error) {
        console.error('Failed to load predictions:', error);
      }
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    { label: dashboard.birthCharts || 'Birth Charts', value: stats?.charts_count || 0, change: '', icon: Star, color: 'purple' },
    { label: dashboard.predictions || 'Predictions', value: stats?.predictions_count || 0, change: '', icon: TrendingUp, color: 'blue' },
    { label: dashboard.consultations || 'Consultations', value: stats?.consultations_count || 0, change: '', icon: Users, color: 'green' },
    { label: dashboard.compatibility || 'Compatibility', value: stats?.compatibility_count || 0, change: '', icon: Heart, color: 'pink' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl animate-pulse"></div>
            </div>
          <Loader2 className="w-16 h-16 text-white animate-spin relative z-10 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">{dashboard.loading || 'Loading Your Cosmic Dashboard'}</h2>
        <p className="text-gray-400 text-lg">{dashboard.aligningStars || 'Aligning the stars...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-500 rounded-full animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
        <div className="absolute top-40 right-40 w-3 h-3 bg-pink-500 rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-40 left-60 w-2 h-2 bg-blue-500 rounded-full animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
        <div className="absolute top-60 right-20 w-2 h-2 bg-cyan-500 rounded-full animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }}></div>
      </div>

      {/* Welcome Section */}
      <div className="relative group overflow-hidden bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 animate-slideInFromTop">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="animate-slideInFromLeft">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex space-x-1">
                <Moon className="w-6 h-6 text-purple-400 animate-pulse" />
                <Sun className="w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <Star className="w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">{dashboard.cosmicDashboard || 'Cosmic Dashboard'}</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {dashboard.welcome?.replace('{name}', user?.name || dashboard.seeker || 'Seeker') || `Welcome back, ${user?.name || 'Seeker'}! ✨`}
            </h1>
            <p className="text-gray-300 text-xl font-medium">
              {dashboard.subtitle || 'Your cosmic journey continues. Explore your predictions and insights.'}
            </p>
          </div>
          <div className="hidden lg:block animate-slideInFromRight">
            <div className="relative">
              {/* Rotating rings */}
              <div className="absolute inset-0 w-40 h-40 border-4 border-purple-500/30 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-2 w-36 h-36 border-4 border-pink-500/30 rounded-full animate-spin-reverse"></div>
              
              {/* Center orb */}
              <div className="relative w-40 h-40 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Sparkles className="w-20 h-20 text-white relative z-10 animate-spin-slow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, idx) => (
          <div
            key={stat.label}
            className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-slideInFromBottom overflow-hidden"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-600/0 to-${stat.color}-600/0 group-hover:from-${stat.color}-600/10 group-hover:to-${stat.color}-600/5 transition-all duration-500 rounded-2xl`}></div>
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`relative p-3 bg-gradient-to-br from-${stat.color}-600/20 to-${stat.color}-600/10 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  {/* Icon glow */}
                  <div className={`absolute inset-0 bg-${stat.color}-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400 relative z-10 group-hover:rotate-12 transition-transform duration-300`} />
                </div>
                <Activity className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition-colors duration-300" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-4xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-400 font-semibold group-hover:text-gray-300 transition-colors duration-300">{stat.label}</p>
              </div>

              {/* Progress bar animation */}
              <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-400 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Stats Widget */}
      <QuickStatsWidget />

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Predictions */}
        <div className="lg:col-span-2 group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-500 animate-slideInFromLeft overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:via-pink-600/5 group-hover:to-purple-600/5 transition-all duration-700 rounded-2xl"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Recent Predictions</h2>
              </div>
              <button 
                onClick={() => window.location.href = '/dashboard/predictions'}
                className="group/btn flex items-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 hover:text-purple-300 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            <div className="space-y-4">
              {predictions.length > 0 ? (
                predictions.map((pred, idx) => (
                  <div
                    key={pred.id}
                    className="group/card relative bg-gradient-to-r from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 border border-white/10 hover:border-purple-500/30 rounded-xl transition-all duration-500 cursor-pointer overflow-hidden hover:scale-[1.02] hover:-translate-y-1 animate-fadeIn"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    onClick={() => window.location.href = `/dashboard/predictions/${pred.id}`}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative flex items-center justify-between p-5">
                      <div className="flex-1 flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg group-hover/card:scale-110 transition-transform duration-300">
                          <Target className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold mb-1 text-lg group-hover/card:text-purple-300 transition-colors duration-300">{pred.title}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(pred.created_at).toLocaleDateString()}</span>
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded text-xs font-semibold">{pred.category}</span>
                            {pred.confidence && (
                              <>
                                <span>•</span>
                                <span className="flex items-center space-x-1 text-green-400 font-semibold">
                                  <Activity className="w-3 h-3" />
                                  <span>{pred.confidence}%</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-600 group-hover/card:text-purple-400 group-hover/card:translate-x-2 group-hover/card:scale-125 transition-all duration-300" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 animate-fadeIn">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full">
                      <Flame className="w-16 h-16 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Start Your Journey</h3>
                  <p className="text-gray-400 mb-6 text-lg">Unlock the secrets of your destiny</p>
                  <button 
                    onClick={() => window.location.href = '/dashboard/predictions'}
                    className="group/cta relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Get Your First Prediction</span>
                      <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 animate-slideInFromRight">
          <div className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 overflow-hidden hover:scale-[1.02] transition-all duration-500">
            {/* Animated glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-yellow-400/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/dashboard/charts'}
                  className="group/btn w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400/40 text-white rounded-xl font-semibold transition-all duration-300 text-left flex items-center justify-between hover:scale-105 hover:-translate-y-0.5"
                >
                  <span className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-purple-400 group-hover/btn:rotate-180 transition-transform duration-500" />
                    <span>Generate Chart</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover/btn:text-purple-400 group-hover/btn:translate-x-1 transition-all duration-300" />
                </button>
                <button 
                  onClick={() => window.location.href = '/dashboard/predictions'}
                  className="group/btn w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-blue-400/40 text-white rounded-xl font-semibold transition-all duration-300 text-left flex items-center justify-between hover:scale-105 hover:-translate-y-0.5"
                >
                  <span className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-400 group-hover/btn:scale-125 transition-transform duration-300" />
                    <span>New Prediction</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover/btn:text-blue-400 group-hover/btn:translate-x-1 transition-all duration-300" />
                </button>
                <button 
                  onClick={() => window.location.href = '/dashboard/compatibility'}
                  className="group/btn w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-pink-400/40 text-white rounded-xl font-semibold transition-all duration-300 text-left flex items-center justify-between hover:scale-105 hover:-translate-y-0.5"
                >
                  <span className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-pink-400 group-hover/btn:scale-125 transition-transform duration-300" />
                    <span>Check Compatibility</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover/btn:text-pink-400 group-hover/btn:translate-x-1 transition-all duration-300" />
                </button>
                <button 
                  onClick={() => window.location.href = '/dashboard/consultations'}
                  className="group/btn relative w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold overflow-hidden hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-between px-1">
                    <span className="flex items-center space-x-3">
                      <Users className="w-5 h-5" />
                      <span>Book Consultation</span>
                    </span>
                    <Sparkles className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-cyan-600/10 to-blue-600/10 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 overflow-hidden hover:scale-[1.02] transition-all duration-500 hover:border-cyan-400/40">
            {/* Animated moon */}
            <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <Moon className="w-32 h-32 text-cyan-400 animate-pulse" />
            </div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-cyan-400/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h2 className="text-xl font-bold text-white">Today's Panchang</h2>
              </div>
              {panchang ? (
                <div className="space-y-4">
                  <div className="group/item flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105">
                    <span className="text-gray-400 font-medium flex items-center space-x-2">
                      <Moon className="w-4 h-4 text-cyan-400" />
                      <span>Tithi</span>
                    </span>
                    <span className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{panchang.tithi}</span>
                  </div>
                  <div className="group/item flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105">
                    <span className="text-gray-400 font-medium flex items-center space-x-2">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span>Nakshatra</span>
                    </span>
                    <span className="text-white font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{panchang.nakshatra}</span>
                  </div>
                  <div className="group/item flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105">
                    <span className="text-gray-400 font-medium flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Yoga</span>
                    </span>
                    <span className="text-white font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{panchang.yoga}</span>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/dashboard/panchang'}
                    className="group/btn w-full mt-4 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 animate-pulse">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
                    <Calendar className="w-12 h-12 text-cyan-600 relative z-10" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Loading panchang data...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 animate-slideInFromBottom" style={{ animationDelay: '1.2s' }}>
        <ActivityTimeline maxItems={10} showFilters={true} />
      </div>

      {/* Upgrade Banner */}
      <div className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl p-8 overflow-hidden hover:scale-[1.02] transition-all duration-500 animate-slideInFromBottom">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 animate-slideInFromLeft">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-400/20 rounded-lg backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
                <Award className="w-7 h-7 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="px-3 py-1 bg-yellow-400/20 backdrop-blur-sm text-yellow-300 font-black text-sm uppercase tracking-wider rounded-full">
                Premium Features
              </span>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3 group-hover:scale-105 transition-transform duration-300 origin-left">
              Unlock Your Full Potential
            </h2>
            <p className="text-purple-100 text-xl font-medium max-w-2xl">
              Get unlimited predictions, AI-powered analysis, priority support, and exclusive cosmic insights
            </p>
            
            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20">
                ✨ Unlimited Predictions
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20">
                🤖 AI Analysis
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20">
                👑 Priority Support
              </span>
            </div>
          </div>
          
          <button className="group/btn relative px-10 py-5 bg-white text-purple-900 rounded-2xl font-black text-xl overflow-hidden hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-white/50 animate-slideInFromRight">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-pink-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center space-x-3">
              <span>Upgrade to Pro</span>
              <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
