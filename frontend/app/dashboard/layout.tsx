'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, LayoutDashboard, User, Calendar, TrendingUp,
  Heart, Users, BarChart3, Settings, Moon, Sun, Bell,
  Search, Menu, X, LogOut, ChevronDown, Star, Zap,
  Shield, CreditCard, Globe, BookOpen, MessageSquare, HelpCircle
} from 'lucide-react';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import NotificationCenter from '../components/NotificationCenter';
import ThemeSwitcher from '../components/ThemeSwitcher';
import LanguageSwitcher from '../components/LanguageSwitcher';
import CommandPalette from '../components/CommandPalette';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useTranslations } from '../hooks/useTranslations';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { nav, common } = useTranslations();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const pathname = usePathname();

  // Keyboard shortcut for command palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: nav.dashboard || 'Dashboard', 
      href: '/dashboard',
      badge: null
    },
    { 
      icon: User, 
      label: nav.birthChart || 'Birth Chart', 
      href: '/dashboard/charts',
      badge: null
    },
    { 
      icon: TrendingUp, 
      label: nav.predictions || 'Predictions', 
      href: '/dashboard/predictions',
      badge: '3'
    },
    { 
      icon: Calendar, 
      label: nav.panchang || 'Panchang', 
      href: '/dashboard/panchang',
      badge: null
    },
    { 
      icon: Heart, 
      label: nav.compatibility || 'Compatibility', 
      href: '/dashboard/compatibility',
      badge: null
    },
    { 
      icon: Users, 
      label: nav.consultations || 'Consultations', 
      href: '/dashboard/consultations',
      badge: '1'
    },
    { 
      icon: Star, 
      label: nav.numerology || 'Numerology', 
      href: '/dashboard/numerology',
      badge: null
    },
    { 
      icon: BarChart3, 
      label: nav.lifeEvents || 'Life Events', 
      href: '/dashboard/life-events',
      badge: null
    },
    { 
      icon: Globe, 
      label: nav.faceReading || 'Face Reading', 
      href: '/dashboard/face-reading',
      badge: 'AI'
    },
    { 
      icon: BookOpen, 
      label: nav.learning || 'Learning', 
      href: '/dashboard/learning',
      badge: null
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/15 via-pink-600/10 to-violet-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
        sidebarOpen ? 'w-72' : 'w-20'
      } hidden lg:block`}>
        <div className="h-full bg-slate-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              {sidebarOpen && (
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    AstroAI
                  </span>
                  <p className="text-xs text-gray-500">v5.0 Pro</p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${
                  isActive(item.href) ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'
                }`} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        item.badge === 'AI' 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                          : 'bg-purple-600/30 text-purple-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="p-3 border-t border-white/10 space-y-1">
            <Link
              href="/dashboard/settings"
              className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all ${
                isActive('/dashboard/settings')
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{nav.settings || 'Settings'}</span>}
            </Link>
            
            {sidebarOpen && (
              <div className="mt-4 p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-bold text-white">{common.upgradeToPro || 'Upgrade to Pro'}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{common.unlockFeatures || 'Unlock AI predictions & premium features'}</p>
                <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-lg hover:scale-105 transition-transform">
                  {common.upgradeNow || 'Upgrade Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <aside className="absolute top-0 left-0 w-80 h-full bg-slate-950/95 backdrop-blur-xl border-r border-white/10 flex flex-col">
            {/* Mobile Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    AstroAI
                  </span>
                  <p className="text-xs text-gray-500">v5.0 Pro</p>
                </div>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      item.badge === 'AI' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'bg-purple-600/30 text-purple-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:block p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Search Bar - Triggers Command Palette */}
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="hidden md:flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-96 hover:bg-white/10 transition-all group"
                >
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  <span className="text-gray-500 group-hover:text-gray-400 flex-1 text-left transition-colors">
                    {common.searchPlaceholder || 'Search charts, predictions...'}
                  </span>
                  <kbd className="px-2 py-1 text-xs bg-white/10 rounded border border-white/20">⌘K</kbd>
                </button>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <NotificationCenter />

                {/* Language Switcher - Hidden */}
                {/* <LanguageSwitcher /> */}

                {/* Theme Switcher */}
                <ThemeSwitcher />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">TU</span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-white">Test User</p>
                      <p className="text-xs text-gray-400">Seeker Plan</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">Test User</p>
                        <p className="text-xs text-gray-400">testuser@example.com</p>
                      </div>
                      <div className="py-2">
                        <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{common.profile || 'Profile'}</span>
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-sm">{common.billing || 'Billing'}</span>
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm">{common.privacy || 'Privacy'}</span>
                        </Link>
                        <Link href="/help" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                          <HelpCircle className="w-4 h-4" />
                          <span className="text-sm">{common.helpCenter || 'Help Center'}</span>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-white/10">
                        <button className="flex items-center space-x-3 px-4 py-2 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-semibold">{common.signOut || 'Sign Out'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative z-10 p-4 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 px-4 lg:px-8 py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>© 2025 AstroAI. Built by Raghavendra Ramesh Deshpande</p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/help" className="hover:text-white transition-colors">Help</Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
    </ThemeProvider>
  );
}
