'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth.store';
import { 
  LayoutDashboard, 
  Users, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles,
  Menu,
  X,
  User,
  Bell,
  ChevronDown,
  Globe,
  Calculator,
  Scan,
  Hand,
  Zap,
  Calendar,
  Search,
  Command,
  Plus,
  CreditCard,
  HelpCircle,
  Sun,
  Moon,
  ChevronRight,
  Home
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/lib/contexts/language.context';
import { ThemeProvider, useTheme } from '@/lib/contexts/theme.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const t = dashboardTranslations[language];

  const navigation = [
    { name: t.dashboard, href: '/dashboard', icon: Home, color: 'violet' },
    { name: t.myCharts, href: '/dashboard/charts', icon: BarChart3, color: 'blue' },
    { name: t.consultations, href: '/dashboard/consultations', icon: CalendarIcon, color: 'green' },
    { name: t.compatibility, href: '/dashboard/compatibility', icon: Users, color: 'pink' },
    { name: t.dailyPanchang, href: '/dashboard/panchang', icon: Calendar, color: 'orange' },
    { name: 'Life Events', href: '/dashboard/life-events', icon: Sparkles, color: 'indigo' },
    { name: t.predictions, href: '/dashboard/predictions', icon: Zap, color: 'yellow' },
    { name: t.numerology, href: '/dashboard/numerology', icon: Calculator, color: 'purple' },
    { name: t.faceReading, href: '/dashboard/face-reading', icon: Scan, color: 'cyan' },
    { name: t.palmistry, href: '/dashboard/palmistry', icon: Hand, color: 'emerald' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> = {
      violet: {
        bg: isActive ? 'bg-violet-100 dark:bg-violet-900/30' : '',
        text: isActive ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-300'
      },
      blue: {
        bg: isActive ? 'bg-blue-100 dark:bg-blue-900/30' : '',
        text: isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
      },
      green: {
        bg: isActive ? 'bg-green-100 dark:bg-green-900/30' : '',
        text: isActive ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
      },
      pink: {
        bg: isActive ? 'bg-pink-100 dark:bg-pink-900/30' : '',
        text: isActive ? 'text-pink-700 dark:text-pink-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-700 dark:hover:text-pink-300'
      },
      orange: {
        bg: isActive ? 'bg-orange-100 dark:bg-orange-900/30' : '',
        text: isActive ? 'text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300'
      },
      yellow: {
        bg: isActive ? 'bg-yellow-100 dark:bg-yellow-900/30' : '',
        text: isActive ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-300'
      },
      purple: {
        bg: isActive ? 'bg-purple-100 dark:bg-purple-900/30' : '',
        text: isActive ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'
      },
      cyan: {
        bg: isActive ? 'bg-cyan-100 dark:bg-cyan-900/30' : '',
        text: isActive ? 'text-cyan-700 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-700 dark:hover:text-cyan-300'
      },
      emerald: {
        bg: isActive ? 'bg-emerald-100 dark:bg-emerald-900/30' : '',
        text: isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300'
      },
      indigo: {
        bg: isActive ? 'bg-indigo-100 dark:bg-indigo-900/30' : '',
        text: isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300'
      }
    };
    return colors[color] || colors.violet;
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Enterprise Modern Design */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full 
        ${sidebarCollapsed ? 'w-20' : 'w-72'}
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl 
        border-r border-gray-200/50 dark:border-gray-800/50 
        transform transition-all duration-300 ease-in-out shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          
          {/* Logo Section - Premium Design */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-900/10 dark:to-indigo-900/10">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-xl">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Astor AI
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                    PREMIUM
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          {!sidebarCollapsed && (
            <div className="px-4 pt-6 pb-4">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 transition-all transform hover:scale-[1.02]">
                <Plus className="w-5 h-5" />
                <span>{t.generateNewChart}</span>
              </button>
            </div>
          )}

          {/* Navigation - Modern Floating Style */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const colorClasses = getColorClasses(item.color, isActive);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3.5 rounded-xl 
                    font-medium transition-all duration-200
                    ${colorClasses.bg} ${colorClasses.text} ${colorClasses.hover}
                    ${isActive ? 'shadow-lg shadow-black/5 dark:shadow-black/20' : ''}
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-r-full" />
                  )}
                  <Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'ml-1'} transition-transform group-hover:scale-110`} strokeWidth={2} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Settings Section */}
          <div className="p-3 border-t border-gray-200/50 dark:border-gray-800/50 space-y-1.5">
            <Link
              href="/dashboard/settings"
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                transition-all ${sidebarCollapsed ? 'justify-center' : ''}
              `}
              title={sidebarCollapsed ? t.settings : ''}
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" strokeWidth={2} />
              {!sidebarCollapsed && <span>{t.settings}</span>}
            </Link>
          </div>

          {/* User Profile Card - Bottom */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
            {sidebarCollapsed ? (
              <button className="w-full p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.full_name || user.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} transition-all duration-300`}>
        
        {/* Top Header Bar - Glass Morphism Design */}
        <header className="sticky top-0 z-30 h-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search Bar - Enterprise Style */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 w-80 group hover:border-violet-300 dark:hover:border-violet-700 transition-all">
                <Search className="w-4 h-4 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400"
                />
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              
              {/* Theme Toggle - Modern */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600" />
                )}
              </button>

              {/* Language Selector - Premium */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
                >
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                    {languages.find(l => l.code === language)?.flag}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 backdrop-blur-xl">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setLanguageMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors
                          ${language === lang.code 
                            ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="flex-1 text-left">{lang.name}</span>
                        {language === lang.code && (
                          <div className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications - Premium Badge */}
              <button className="relative p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
              </button>

              {/* Credits Display */}
              <div className="hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-800">
                <CreditCard className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-bold text-violet-700 dark:text-violet-300">
                  250 Credits
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DashboardContent>{children}</DashboardContent>
      </LanguageProvider>
    </ThemeProvider>
  );
}
