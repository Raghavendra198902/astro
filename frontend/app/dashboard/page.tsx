'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, Calendar, Users, Sparkles, Star, Clock, ArrowRight, Plus, Zap,
  Target, Award, Activity, LogOut, Settings, TrendingUp, Eye, Video, Phone,
  Home, User, Bell, Search, Menu, X
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetch('http://localhost:8000/api/v1/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => { setUser(data); setLoading(false); })
    .catch(() => { localStorage.removeItem('token'); router.push('/auth/login'); });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your cosmic dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { name: 'Birth Charts', value: '0', change: '+0 this month', icon: BarChart3, gradient: 'from-violet-500 to-purple-600', href: '/dashboard/charts' },
    { name: 'Consultations', value: '0', change: '0 upcoming', icon: Calendar, gradient: 'from-blue-500 to-cyan-600', href: '/dashboard/consultations' },
    { name: 'Predictions', value: '0', change: '0 generated', icon: Zap, gradient: 'from-yellow-500 to-orange-600', href: '/dashboard/predictions' },
    { name: 'AI Credits', value: '250', change: '250 available', icon: Sparkles, gradient: 'from-pink-500 to-rose-600', href: '/dashboard/settings' },
  ];

  const quickActions = [
    { name: 'Generate Birth Chart', href: '/dashboard/charts', icon: BarChart3, color: 'violet', description: 'Create detailed natal chart' },
    { name: 'Daily Predictions', href: '/dashboard/predictions', icon: Zap, color: 'yellow', description: 'Get AI-powered insights' },
    { name: 'Book Consultation', href: '/dashboard/consultations', icon: Calendar, color: 'blue', description: 'Talk to expert astrologer' },
    { name: 'Compatibility Check', href: '/dashboard/compatibility', icon: Users, color: 'pink', description: 'Analyze relationship dynamics' },
    { name: 'Panchang', href: '/dashboard/panchang', icon: Clock, color: 'indigo', description: 'Hindu calendar & muhurat' },
    { name: 'Face Reading', href: '/dashboard/face-reading', icon: Eye, color: 'cyan', description: 'AI face analysis' },
  ];

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, active: true },
    { name: 'Birth Charts', href: '/dashboard/charts', icon: BarChart3 },
    { name: 'Predictions', href: '/dashboard/predictions', icon: Zap },
    { name: 'Consultations', href: '/dashboard/consultations', icon: Calendar },
    { name: 'Compatibility', href: '/dashboard/compatibility', icon: Users },
    { name: 'Panchang', href: '/dashboard/panchang', icon: Clock },
    { name: 'Face Reading', href: '/dashboard/face-reading', icon: Eye },
    { name: 'Palmistry', href: '/dashboard/palmistry', icon: Target },
    { name: 'Numerology', href: '/dashboard/numerology', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-white/10">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              AstroAI
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  item.active
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              href="/dashboard/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition group"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Settings</span>
            </Link>
            
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-gray-400">Premium Member</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Modern Header Bar */}
      <header className="lg:ml-64 fixed top-0 left-0 right-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          {/* Left Side - Mobile Menu + Search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search charts, predictions..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                AstroAI
              </span>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all hover:scale-105 shadow-lg">
              <Plus className="w-4 h-4" />
              <span>New Chart</span>
            </button>

            {/* Mobile Search */}
            <button className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white relative group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">3</span>
            </button>

            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-white/10">
              <div className="flex items-center gap-3 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer group">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-white">{user?.email?.split('@')[0] || 'User'}</p>
                  <p className="text-xs text-gray-400">Premium Plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 md:p-10">
              <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-60 h-60 bg-purple-400/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                  <span className="text-white/90 font-semibold text-sm uppercase tracking-wider">Premium Member</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  Welcome back, <br />
                  <span className="text-white/90">{user?.email?.split('@')[0] || 'Seeker'}!</span>
                </h1>
                <p className="text-white/80 text-lg mb-8 max-w-2xl">Your cosmic journey continues. Explore your charts, book consultations, or discover compatibility insights.</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/dashboard/charts" className="group px-6 py-3.5 bg-white hover:bg-gray-50 text-violet-700 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    New Chart
                  </Link>
                  <Link href="/dashboard/consultations" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 text-white rounded-xl font-semibold transition-all flex items-center gap-2 hover:scale-105">
                    <Calendar className="w-5 h-5" />
                    Book Session
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </Link>
          ))}
        </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Quick Actions
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Link key={action.name} href={action.href} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all hover:scale-105">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-lg group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{action.name}</h3>
                          <p className="text-sm text-gray-400">{action.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h3 className="font-semibold">Today's Cosmic Insight</h3>
              </div>
              <p className="text-white/90 mb-4">The stars align in your favor today. Jupiter's position brings opportunities for growth.</p>
              <Link href="/dashboard/predictions" className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
                View Full Prediction <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-white">Premium Features</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Target className="w-4 h-4 text-green-400" />
                  Unlimited birth charts
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Advanced predictions
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Video className="w-4 h-4 text-green-400" />
                  Video consultations
                </li>
              </ul>
              <Link href="/dashboard/settings" className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Manage Subscription
              </Link>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a href="tel:+1234567890" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition">
                  <Phone className="w-4 h-4 text-blue-400" />
                  Call Support
                </a>
                <Link href="/dashboard/consultations" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition">
                  <Video className="w-4 h-4 text-purple-400" />
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
