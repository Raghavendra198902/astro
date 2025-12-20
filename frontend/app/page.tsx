'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Star, Moon, Sun, Zap, TrendingUp, Shield, 
  BarChart3, Users, Award, ArrowRight, Check, ChevronRight, 
  Brain, Cpu, Database, Globe, Menu, X
} from 'lucide-react';
import { useTranslations } from './hooks/useTranslations';

export default function LandingPage() {
  const { landing: t } = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 relative perspective-1000">
      {/* Ultra-Advanced 3D Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs with layered depth */}
        <div className="absolute top-20 left-10 w-[700px] h-[700px] bg-gradient-to-br from-purple-600/25 via-pink-600/20 to-violet-600/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-600/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/15 via-teal-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-fuchsia-500/20 via-purple-600/15 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Enhanced grid with multiple layers */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
        
        {/* Radial spotlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_70%)]"></div>
        
        {/* Animated floating particles with varying sizes */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400/50 rounded-full blur-sm animate-float"></div>
        <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-cyan-400/40 rounded-full blur-sm animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-pink-400/50 rounded-full blur-sm animate-float" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-violet-400/30 rounded-full blur-md animate-float" style={{ animationDelay: '3.5s' }}></div>
        
        {/* Subtle scanning line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>
      </div>

      {/* Navigation - Glass Morphism */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-2xl group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  AstroAI
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Cpu className="w-3 h-3" />
                  <span>v5.0 Pro</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Pricing
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                About
              </Link>
              <div className="w-px h-6 bg-white/10"></div>
              <Link 
                href="/auth/login"
                className="px-5 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 animate-in slide-in-from-top">
              <Link href="#features" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                About
              </Link>
              <Link href="/auth/login" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center rounded-xl font-semibold">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Enhanced */}
      <section className="relative z-10 px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-full mb-8 shadow-lg shadow-purple-500/10 animate-slide-in-bottom">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-sm font-medium text-gray-200">Enterprise AI Platform • 25+ Years Solution Architecture</span>
              <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                Live
              </div>
            </div>
            
            {/* Main Heading with Advanced 3D Animation */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight animate-slide-in-bottom">
              <span className="inline-block transform hover:scale-105 transition-transform duration-300">
                Unlock Your
              </span>
              <br />
              <span className="relative inline-block group perspective-1000">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 blur-xl opacity-40 animate-pulse"></span>
                <span className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent animate-gradient transform-3d group-hover:scale-110 transition-transform duration-500">
                  Cosmic Destiny
                </span>
              </span>
              <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 animate-gradient transform hover:scale-105 transition-transform duration-300">
                with Advanced AI
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Experience the perfect fusion of <span className="text-purple-400 font-semibold">ancient Vedic wisdom</span> and 
              <span className="text-pink-400 font-semibold"> cutting-edge AI technology</span>. 
              Built with <span className="text-cyan-400 font-semibold">25+ years enterprise architecture expertise</span> from Banking, Energy & Telecom sectors.
            </p>

            {/* Technology Stack Badge */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {[
                { icon: Brain, label: '5-Model AI Ensemble', color: 'purple' },
                { icon: Database, label: 'pgVector DB', color: 'blue' },
                { icon: Cpu, label: '<50ms Response', color: 'pink' },
                { icon: Globe, label: 'Multi-Language', color: 'cyan' },
              ].map((tech) => (
                <div key={tech.label} className={`flex items-center space-x-2 px-4 py-2 bg-${tech.color}-500/10 border border-${tech.color}-500/30 rounded-lg`}>
                  <tech.icon className={`w-4 h-4 text-${tech.color}-400`} />
                  <span className="text-sm text-gray-300">{tech.label}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/auth/register"
                className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-2xl text-lg font-bold overflow-hidden shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center space-x-3">
                  <Sparkles className="w-6 h-6" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              <Link 
                href="/auth/login?demo=true"
                className="group px-10 py-5 bg-white/5 backdrop-blur-xl border-2 border-white/20 text-white rounded-2xl text-lg font-bold hover:bg-white/10 hover:border-white/30 transition-all flex items-center space-x-3"
              >
                <span>Try Live Demo</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Enhanced Stats with Glass Morphism */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { label: 'Active Users', value: '50K+', icon: Users, color: 'purple', trend: '+12% this month' },
                { label: 'Predictions Generated', value: '1M+', icon: Sparkles, color: 'pink', trend: '24/7 uptime' },
                { label: 'Accuracy Rate', value: '95%', icon: Award, color: 'cyan', trend: 'Industry leading' },
                { label: 'Response Time', value: '<50ms', icon: Zap, color: 'yellow', trend: 'Lightning fast' },
              ].map((stat) => (
                <div key={stat.label} className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-600/10 to-${stat.color}-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative">
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 bg-gradient-to-br from-${stat.color}-600/20 to-${stat.color}-600/10 rounded-xl`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                    <div className="text-sm font-semibold text-gray-300 mb-1">{stat.label}</div>
                    <div className={`text-xs text-${stat.color}-400`}>{stat.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Branding Section */}
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl mb-6 shadow-2xl shadow-purple-500/20 hover:scale-105 transition-all duration-300 animate-scale-in">
                <Award className="w-6 h-6 text-yellow-400 animate-pulse" />
                <span className="text-xl font-black bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">Raghavendra Ramesh Deshpande</span>
              </div>
              <p className="text-gray-300 text-lg font-semibold mb-3">
                Solution Architect • 25+ Years Excellence in IT Infrastructure & Cloud Solutions
              </p>
              <p className="text-gray-400 text-base mb-4 leading-relaxed max-w-3xl mx-auto">
                Specialized in <span className="text-purple-400 font-semibold">Windows Server Migrations (2012→2022)</span>, 
                <span className="text-pink-400 font-semibold"> Hybrid Cloud Solutions</span>, and 
                <span className="text-cyan-400 font-semibold"> PowerShell Automation</span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                <div className="group px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 hover:scale-105 transition-all">
                  <span className="text-sm text-blue-300 font-semibold">Microsoft Azure Administrator</span>
                </div>
                <div className="group px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 hover:scale-105 transition-all">
                  <span className="text-sm text-purple-300 font-semibold">VMware VCP 5 (vSphere 5.1)</span>
                </div>
                <div className="group px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 hover:scale-105 transition-all">
                  <span className="text-sm text-green-300 font-semibold">PRINCE2 Practitioner</span>
                </div>
                <div className="group px-4 py-2 bg-orange-600/20 border border-orange-500/30 rounded-lg hover:bg-orange-600/30 hover:scale-105 transition-all">
                  <span className="text-sm text-orange-300 font-semibold">MCSA: Windows Server</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Banking • Energy • Telecom • IT Services • 99.9% Uptime Strategies
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
                <span className="flex items-center space-x-1">
                  <span>📧</span>
                  <span>Raghavendra.deshpande@tcs.com</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📱</span>
                  <span>+91 9011256699</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🔗</span>
                  <span>github.com/Raghavendra198902</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section id="features" className="relative z-10 px-6 py-24 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Enterprise-Grade Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Powerful AI-Driven
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Astrology Platform
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need for comprehensive astrological insights, powered by advanced machine learning
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI Predictions',
                description: '5-model neural ensemble with 95%+ accuracy. Get instant daily, weekly, and monthly predictions powered by GPT-4 and LLaMA.',
                color: 'from-purple-500 to-pink-500',
                badge: 'Most Popular',
                stats: '1M+ predictions/day',
              },
              {
                icon: BarChart3,
                title: 'Chart Analysis',
                description: 'Complete natal, transit, and synastry charts with detailed planetary positions, aspects, and house cusps.',
                color: 'from-blue-500 to-cyan-500',
                badge: 'Professional',
                stats: '100% accuracy',
              },
              {
                icon: Moon,
                title: 'Vedic & Western',
                description: 'Support for both Vedic (Indian) and Western astrology systems with Swiss Ephemeris calculations.',
                color: 'from-orange-500 to-yellow-500',
                badge: 'Dual System',
                stats: 'ISO certified',
              },
              {
                icon: Users,
                title: 'Compatibility',
                description: 'Advanced Kundali Milan (36 Guna matching) and Western synastry for comprehensive relationship analysis.',
                color: 'from-pink-500 to-rose-500',
                badge: 'Relationship',
                stats: '36-point analysis',
              },
              {
                icon: TrendingUp,
                title: 'Life Events',
                description: 'Predict major life events using Vimshottari Dasha, transits, and progressive charts with ML optimization.',
                color: 'from-green-500 to-emerald-500',
                badge: 'Predictive',
                stats: '20-year forecast',
              },
              {
                icon: Shield,
                title: 'Privacy & Security',
                description: 'Enterprise-grade AES-256 encryption, OAuth 2.0 authentication, and GDPR compliance. Your data is always safe.',
                color: 'from-indigo-500 to-purple-500',
                badge: 'Secure',
                stats: 'SOC 2 certified',
              },
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="group relative p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 perspective-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Enhanced glow effect with multiple layers */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 blur-xl`}></div>
                <div className={`absolute inset-0 bg-gradient-to-tl ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-700`}></div>
                
                {/* Badge with animation */}
                <div className="absolute top-4 right-4 animate-slide-in-right">
                  <span className={`px-3 py-1 bg-gradient-to-r ${feature.color} text-white text-xs font-bold rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.badge}
                  </span>
                </div>

                {/* Icon with 3D effect */}
                <div className="relative mb-6 animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500`}></div>
                  <div className={`relative inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl shadow-2xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 transform-3d backface-hidden`}>
                    <feature.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-500 transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Stats */}
                <div className={`flex items-center space-x-2 text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>{feature.stats}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Technology Stack */}
          <div className="mt-20 p-8 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Powered by Industry-Leading Technology</h3>
              <p className="text-gray-400">Enterprise-grade infrastructure for maximum reliability</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'FastAPI', desc: 'Python Backend', icon: Cpu },
                { name: 'PostgreSQL', desc: 'pgVector DB', icon: Database },
                { name: 'Next.js 16', desc: 'React 19', icon: Globe },
                { name: 'Redis', desc: 'Caching Layer', icon: Zap },
              ].map((tech) => (
                <div key={tech.name} className="text-center">
                  <div className="inline-flex p-3 bg-white/5 rounded-xl mb-2">
                    <tech.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-sm font-semibold text-white">{tech.name}</div>
                  <div className="text-xs text-gray-500">{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Ultra Modern */}
      <section id="pricing" className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300 font-medium">Flexible Pricing Plans</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-green-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From free to enterprise, we have a plan that scales with your needs
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Seeker',
                subtitle: 'For Beginners',
                price: 'Free',
                period: 'forever',
                icon: Star,
                features: [
                  '5 AI predictions per month',
                  'Basic natal chart',
                  'Daily horoscope',
                  'Community forum access',
                  'Mobile app access',
                ],
                cta: 'Start Free',
                popular: false,
                color: 'blue',
              },
              {
                name: 'Explorer',
                subtitle: 'Most Popular',
                price: '$29',
                period: 'per month',
                icon: Sparkles,
                features: [
                  'Unlimited AI predictions',
                  'Advanced chart analysis',
                  'Compatibility reports',
                  'Transit predictions',
                  'Priority email support',
                  'API access (1000 calls/day)',
                  'Export to PDF',
                ],
                cta: 'Get Started',
                popular: true,
                color: 'purple',
              },
              {
                name: 'Master',
                subtitle: 'Enterprise',
                price: '$99',
                period: 'per month',
                icon: Award,
                features: [
                  'Everything in Explorer',
                  'White-label solution',
                  'Custom AI model training',
                  'Dedicated account manager',
                  'SLA guarantee (99.9% uptime)',
                  'Unlimited API calls',
                  'Custom integrations',
                  'Advanced analytics',
                ],
                cta: 'Contact Sales',
                popular: false,
                color: 'pink',
              },
            ].map((plan, index) => (
              <div 
                key={plan.name}
                className={`group relative ${
                  plan.popular ? 'lg:-mt-8 lg:scale-105' : ''
                }`}
              >
                {/* Glow effect */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                )}

                <div 
                  className={`relative p-8 rounded-3xl border-2 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 perspective-1000 transform-3d ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-pink-900/40 border-purple-500/50 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70' 
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-white/10'
                  }`}
                >
                  {/* Popular Badge with animation */}
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 animate-rotate-in">
                      <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center space-x-2 animate-shimmer">
                        <Star className="w-4 h-4 fill-current animate-pulse" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Header */}
                  <div className="text-center mb-8 pt-4">
                    <div className={`inline-flex p-4 bg-gradient-to-br from-${plan.color}-500/20 to-${plan.color}-600/10 rounded-2xl mb-4`}>
                      <plan.icon className={`w-8 h-8 text-${plan.color}-400`} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">{plan.name}</h3>
                    {!plan.popular && (
                      <p className="text-sm text-gray-400 mb-4">{plan.subtitle}</p>
                    )}
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      {plan.price !== 'Free' && (
                        <span className="text-gray-400 ml-2 text-lg">/{plan.period.split(' ')[1]}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">{plan.period}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li 
                        key={feature} 
                        className="flex items-start space-x-3 group/item"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-${plan.color}-500/20 to-${plan.color}-600/10 flex items-center justify-center mt-0.5`}>
                          <Check className={`w-4 h-4 text-${plan.color}-400`} />
                        </div>
                        <span className="text-gray-300 text-sm leading-relaxed group-hover/item:text-white transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button with Advanced Effects */}
                  <Link 
                    href="/auth/register"
                    className={`group/btn relative block w-full py-4 text-center rounded-2xl font-bold transition-all duration-300 overflow-hidden hover:scale-110 active:scale-95 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 hover:bg-[position:100%_0]'
                        : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-white/20'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    )}
                    <span className="relative z-10 flex items-center justify-center space-x-2 backface-hidden">
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </span>
                    {plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise Contact */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">Need a custom solution for your organization?</p>
            <Link 
              href="/auth/register"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">Talk to Enterprise Sales</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Modern */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[3rem] p-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
            {/* Inner container with gradient background */}
            <div className="relative bg-gradient-to-br from-purple-900/90 via-slate-900/90 to-pink-900/90 backdrop-blur-xl rounded-[2.8rem] p-12 md:p-20">
              {/* Animated background elements */}
              <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative text-center">
                {/* Icon constellation */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="p-3 bg-purple-500/20 rounded-2xl backdrop-blur-xl">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="p-3 bg-pink-500/20 rounded-2xl backdrop-blur-xl">
                    <Star className="w-8 h-8 text-pink-400" />
                  </div>
                  <div className="p-3 bg-cyan-500/20 rounded-2xl backdrop-blur-xl">
                    <Brain className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                  Ready to Unlock
                  <br />
                  Your <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">Cosmic Potential</span>?
                </h2>
                
                <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Join <span className="font-bold text-white">50,000+ users</span> who trust AstroAI for accurate predictions, 
                  detailed analysis, and life-changing insights powered by advanced AI
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
                  {[
                    { value: '95%', label: 'Accuracy' },
                    { value: '<50ms', label: 'Response' },
                    { value: '24/7', label: 'Available' },
                    { value: '1M+', label: 'Predictions' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons with Enhanced 3D Effects */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
                  <Link 
                    href="/auth/register"
                    className="group relative px-12 py-5 bg-white text-purple-900 rounded-2xl text-lg font-black overflow-hidden shadow-2xl hover:shadow-white/60 transition-all transform hover:scale-110 active:scale-95 perspective-1000 transform-3d"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                    <span className="relative flex items-center space-x-3 backface-hidden">
                      <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>
                  <Link 
                    href="/auth/login?demo=true"
                    className="group relative px-12 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white rounded-2xl text-lg font-bold hover:bg-white/20 hover:border-white/50 hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0 group-hover:via-purple-600/30 transition-all duration-500"></div>
                    <span className="relative backface-hidden">View Demo</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>SOC 2 Certified</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>GDPR Compliant</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>99.9% Uptime SLA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Modern */}
      <footer className="relative z-10 px-6 py-16 border-t border-white/10 bg-gradient-to-b from-transparent to-slate-950/50">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    AstroAI
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Cpu className="w-3 h-3" />
                    <span>v5.0 Pro</span>
                  </div>
                </div>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Enterprise AI astrology platform by <span className="text-purple-400 font-semibold">Raghavendra Ramesh Deshpande</span>, 
                Solution Architect with 25+ years in Banking, Energy & Telecom. 
                Built with <span className="text-cyan-400 font-semibold">Azure, VMware & PowerShell automation</span> expertise.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="group p-2 bg-white/5 hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-pink-600/20 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20">
                  <Globe className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>
                <a href="#" className="group p-2 bg-white/5 hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-pink-600/20 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20">
                  <Star className="w-5 h-5 text-gray-400 group-hover:text-pink-400 group-hover:fill-current transition-all" />
                </a>
                <a href="#" className="group p-2 bg-white/5 hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-pink-600/20 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20">
                  <Users className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'API Docs', 'Roadmap', 'Changelog'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact', 'Privacy'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-2">
                © 2025 AstroAI. All rights reserved.
              </p>
              <div className="flex flex-col items-center md:items-start space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-500">Architected by</span>
                  <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Raghavendra Ramesh Deshpande
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Solution Architect • 25+ Years • Azure & VMware Certified
                </p>
                <p className="text-xs text-gray-700">
                  Windows Server Migrations • Hybrid Cloud • PowerShell Automation
                </p>
                <p className="text-xs text-gray-700">
                  Banking • Energy • Telecom • IT Services
                </p>
              </div>
            </div>

            {/* Trust Badges with Enhanced Effects */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="group flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-gradient-to-r hover:from-green-600/20 hover:to-emerald-600/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 border border-transparent hover:border-green-500/30">
                <Shield className="w-4 h-4 text-green-400 group-hover:animate-pulse" />
                <span className="text-xs text-gray-400 group-hover:text-green-300 transition-colors">SOC 2 Certified</span>
              </div>
              <div className="group flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 border border-transparent hover:border-blue-500/30">
                <Check className="w-4 h-4 text-green-400 group-hover:animate-pulse" />
                <span className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors">GDPR Compliant</span>
              </div>
              <div className="group flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-gradient-to-r hover:from-yellow-600/20 hover:to-orange-600/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 border border-transparent hover:border-yellow-500/30">
                <Zap className="w-4 h-4 text-yellow-400 group-hover:animate-pulse" />
                <span className="text-xs text-gray-400 group-hover:text-yellow-300 transition-colors">99.9% Uptime SLA</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
