'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  TrendingUp,
  Sparkles,
  Star,
  Clock,
  ArrowRight,
  Plus,
  Zap,
  Target,
  Award,
  Activity,
  CreditCard,
  ChevronRight,
  Eye,
  Download,
  Video,
  Phone
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      name: t.totalCharts || 'Total Charts',
      value: '12',
      change: '+2',
      changeLabel: t.thisMonth || 'this month',
      icon: BarChart3,
      gradient: 'from-violet-500 to-purple-600',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      iconColor: 'text-violet-600 dark:text-violet-400',
      trend: 'up'
    },
    {
      name: t.consultations || 'Consultations',
      value: '5',
      change: '2',
      changeLabel: t.upcoming || 'upcoming',
      icon: Calendar,
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: 'neutral'
    },
    {
      name: t.compatibility || 'Compatibility',
      value: '3',
      change: '2d',
      changeLabel: t.ago || 'ago',
      icon: Users,
      gradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
      trend: 'neutral'
    },
    {
      name: t.aiCredits || 'AI Credits',
      value: '150',
      change: '200',
      changeLabel: t.totalAvailable || 'total',
      icon: Sparkles,
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      trend: 'up'
    },
  ];

  const recentCharts = [
    { 
      id: 1,
      name: t.birthChart || 'Birth Chart', 
      date: '2024-11-10', 
      time: '14:30',
      type: t.vedic || 'Vedic',
      status: 'completed',
      color: 'violet'
    },
    { 
      id: 2,
      name: t.transitAnalysis || 'Transit Analysis', 
      date: '2024-11-08', 
      time: '10:15',
      type: t.western || 'Western',
      status: 'completed',
      color: 'blue'
    },
    { 
      id: 3,
      name: t.compatibilityReport || 'Compatibility', 
      date: '2024-11-05', 
      time: '16:45',
      type: t.kundalimilan || 'Kundali Milan',
      status: 'completed',
      color: 'pink'
    },
  ];

  const upcomingConsultations = [
    { 
      id: 1,
      astrologer: 'Dr. Sharma', 
      date: '2024-11-15', 
      time: '10:00 AM', 
      type: 'video',
      specialty: 'Vedic Astrology',
      duration: '45 min'
    },
    { 
      id: 2,
      astrologer: 'Priya Devi', 
      date: '2024-11-18', 
      time: '3:00 PM', 
      type: 'voice',
      specialty: 'Tarot Reading',
      duration: '30 min'
    },
  ];

  const quickActions = [
    { name: t.generateNewChart || 'New Chart', icon: Plus, href: '/dashboard/charts/new', color: 'violet' },
    { name: t.bookConsultation || 'Book Session', icon: Calendar, href: '/dashboard/consultations', color: 'blue' },
    { name: t.compatibility || 'Check Match', icon: Users, href: '/dashboard/compatibility', color: 'pink' },
    { name: t.predictions || 'Predictions', icon: Zap, href: '/dashboard/predictions', color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Section - Premium Design with Animation */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-violet-700 dark:via-purple-700 dark:to-indigo-800 p-8 md:p-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid_20s_linear_infinite]"></div>
        </div>
        
        {/* Floating Orbs with Animation */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className={`flex-1 min-w-[300px] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="flex items-center gap-2 mb-3 animate-fade-in">
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-spin-slow" />
                <span className="text-white/90 font-semibold text-sm uppercase tracking-wider">Premium Member</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-slide-up">
                {t.welcomeUser || 'Welcome back'}, <br />
                <span className="text-white/90 bg-clip-text">{user?.full_name || user?.email?.split('@')[0]}!</span>
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-2xl leading-relaxed animate-fade-in-delay">
                {t.cosmicJourney || 'Your cosmic journey continues. Explore your charts, book consultations, or discover compatibility insights.'}
              </p>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/charts/new"
                  className="group px-6 py-3.5 bg-white hover:bg-gray-50 text-violet-700 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 animate-bounce-subtle"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  {t.generateNewChart || 'New Chart'}
                </Link>
                <Link
                  href="/dashboard/consultations"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
                  {t.bookConsultation || 'Book Session'}
                </Link>
              </div>
            </div>

            {/* Stats Mini Cards with Stagger Animation */}
            <div className={`flex flex-col gap-3 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 min-w-[180px] hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white/70 text-xs font-medium uppercase tracking-wide">Total Reports</div>
                    <div className="text-white text-2xl font-bold tabular-nums">20</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 min-w-[180px] hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl animation-delay-150">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Activity className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="text-white/70 text-xs font-medium uppercase tracking-wide">Active This Month</div>
                    <div className="text-white text-2xl font-bold tabular-nums">12</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Modern Cards with Stagger Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{ animationDelay: `${index * 100}ms` }}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-500 overflow-hidden hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className={`w-7 h-7 ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`} strokeWidth={2} />
                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${stat.gradient} rounded-full flex items-center gap-1.5 text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {stat.trend === 'up' && <TrendingUp className="w-3 h-3 animate-bounce" />}
                    {stat.change}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tabular-nums group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                    {stat.name}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                  {stat.changeLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Charts - 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t.recentCharts || 'Recent Charts'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your latest astrological reports</p>
                </div>
              </div>
              <Link
                href="/dashboard/charts"
                className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl transition-all"
              >
                {t.viewAllCharts || 'View All'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {recentCharts.map((chart) => (
              <div
                key={chart.id}
                className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 bg-${chart.color}-100 dark:bg-${chart.color}-900/30 rounded-xl flex items-center justify-center`}>
                    <BarChart3 className={`w-6 h-6 text-${chart.color}-600 dark:text-${chart.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      {chart.name}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {chart.date} • {chart.time}
                      </span>
                      <span className={`px-2 py-0.5 bg-${chart.color}-100 dark:bg-${chart.color}-900/30 text-${chart.color}-700 dark:text-${chart.color}-300 rounded-full text-xs font-medium`}>
                        {chart.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label="View chart">
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label="Download chart">
                    <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}

            {recentCharts.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No charts yet</p>
                <Link
                  href="/dashboard/charts/new"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Chart
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Consultations - 1 column */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t.upcomingConsultations || 'Upcoming Sessions'}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {upcomingConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white mb-1">
                      {consultation.astrologer}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {consultation.specialty}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${consultation.type === 'video' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {consultation.type === 'video' ? (
                      <Video className={`w-4 h-4 ${consultation.type === 'video' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
                    ) : (
                      <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{consultation.date}</span>
                  <span>•</span>
                  <Clock className="w-4 h-4" />
                  <span>{consultation.time}</span>
                  <span>({consultation.duration})</span>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/25">
                  Join Session
                </button>
              </div>
            ))}

            {upcomingConsultations.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">No upcoming sessions</p>
                <Link
                  href="/dashboard/consultations"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {t.bookConsultation || 'Book Now'}
                </Link>
              </div>
            )}

            <Link
              href="/dashboard/consultations"
              className="block w-full py-2.5 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            >
              + {t.bookConsultation || 'Book New Session'}
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const colorClasses: Record<string, string> = {
              violet: 'from-violet-500 to-purple-600',
              blue: 'from-blue-500 to-cyan-600',
              pink: 'from-pink-500 to-rose-600',
              amber: 'from-amber-500 to-orange-600',
            };

            return (
              <Link
                key={index}
                href={action.href}
                className="group relative p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-transparent transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[action.color]} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative z-10">
                  <Icon className="w-8 h-8 text-gray-700 dark:text-gray-300 group-hover:text-white mb-3 transition-colors" strokeWidth={2} />
                  <div className="font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                    {action.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
