'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Zap, Brain, Star, Award, TrendingUp, ArrowRight, Check, X, ChevronRight, Rocket, Target, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [statsInView, setStatsInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [featuresInView, setFeaturesInView] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [counters, setCounters] = useState({
    users: 0,
    accuracy: 0,
    models: 0,
  });

  // Generate stable particle positions once on client
  const [particles] = useState(() => 
    Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }))
  );

  useEffect(() => {
    // Mark component as mounted
    setMounted(true);

    // Show onboarding for first-time visitors
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setTimeout(() => setShowOnboarding(true), 2000);
    }

    // Mouse tracking for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    // Scroll progress tracking
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    // Scroll observer for stats animation
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsInView) {
            setStatsInView(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    // Features section observer
    const featuresObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeaturesInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    // CTA section observer
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCtaInView(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsElement = document.getElementById('stats-section');
    const featuresElement = document.getElementById('features');
    const ctaElement = document.getElementById('cta-section');

    if (statsElement) statsObserver.observe(statsElement);
    if (featuresElement) featuresObserver.observe(featuresElement);
    if (ctaElement) ctaObserver.observe(ctaElement);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (statsElement) statsObserver.unobserve(statsElement);
      if (featuresElement) featuresObserver.unobserve(featuresElement);
      if (ctaElement) ctaObserver.unobserve(ctaElement);
    };
  }, [statsInView]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = {
      users: 50000,
      accuracy: 98,
      models: 5,
    };

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);

      setCounters({
        users: Math.floor(targets.users * easeOutQuad),
        accuracy: Math.floor(targets.accuracy * easeOutQuad),
        models: Math.floor(targets.models * easeOutQuad),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounters(targets);
      }
    }, stepDuration);
  };

  const completeOnboarding = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowOnboarding(false);
  };

  const onboardingSteps = [
    {
      title: '🔥 Welcome to Aggressive Mode',
      description: 'Experience 5-model neural ensemble with 85-98% accuracy and sub-50ms cached responses.',
      icon: <Zap className="w-12 h-12 text-yellow-400" />,
    },
    {
      title: '🎯 AI-Powered Predictions',
      description: 'Get personalized life predictions using advanced ML algorithms and real-time insights.',
      icon: <Target className="w-12 h-12 text-purple-400" />,
    },
    {
      title: '🚀 Start Your Journey',
      description: 'Create your profile and unlock your cosmic destiny with our advanced astrology platform.',
      icon: <Rocket className="w-12 h-12 text-pink-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 overflow-hidden">
      {/* Scroll Progress Indicator - Only render on client */}
      {mounted && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-[200]">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-300 animate-gradient-shift"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      )}

      {/* Animated background with parallax */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main orbs with parallax */}
        <div 
          className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse transition-transform duration-300"
          style={mounted ? { transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` } : undefined}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse transition-transform duration-300 delay-1000" 
          style={mounted ? { transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` } : undefined}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse transition-transform duration-300 [animation-delay:2s]" 
          style={mounted ? { transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` } : undefined}
        ></div>

        {/* Floating particles - Only render on client to prevent hydration mismatch */}
        {mounted && particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          ></div>
        ))}

        {/* Shooting stars */}
        <div className="absolute top-20 right-20 w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star [animation-delay:3s]"></div>
        <div className="absolute top-40 left-40 w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-shooting-star [animation-delay:7s]"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        
        {/* Radial gradient spots */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-2xl animate-pulse [animation-delay:1.5s]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-pink-500/10 to-transparent rounded-full blur-2xl animate-pulse [animation-delay:3s]"></div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            {/* Close button */}
            <button
              onClick={completeOnboarding}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Step indicator */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              {onboardingSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === onboardingStep
                      ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'w-2 bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>

            {/* Content */}
            <div className="text-center mb-8 animate-slide-up">
              <div className="flex items-center justify-center mb-4">
                {onboardingSteps[onboardingStep].icon}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {onboardingSteps[onboardingStep].title}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {onboardingSteps[onboardingStep].description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between space-x-4">
              {onboardingStep > 0 && (
                <button
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all"
                >
                  Back
                </button>
              )}
              {onboardingStep < onboardingSteps.length - 1 ? (
                <button
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  href="/auth/register"
                  onClick={completeOnboarding}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  AstroAI
                </span>
                <span className="text-[10px] text-gray-500 -mt-1 tracking-wider">by RR Deshpande</span>
              </div>
            </Link>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="text-white/80 hover:text-white transition-all font-medium hover:scale-105 inline-block"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register"
                className="relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all overflow-hidden group"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge with Creator Branding */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-4 animate-bounce-subtle hover:scale-105 transition-transform cursor-default">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-sm font-semibold text-purple-300">
              🔥 Aggressive Mode • 85-98% ML Accuracy
            </span>
          </div>
          <div className="mb-8 animate-fade-in delay-100">
            <p className="text-sm text-gray-400 mb-2">
              <span className="opacity-75">Architected by</span>
            </p>
            <p className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text mb-1">
              Raghavendra Ramesh Deshpande
            </p>
            <p className="text-sm text-gray-300 font-medium">
              Solution Architect • 25+ Years IT Infrastructure Experience
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">Azure Certified</span>
              <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">VMware VCP 5</span>
              <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-300 rounded border border-pink-500/30">PRINCE2</span>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
            <span className="text-white inline-block animate-slide-in-left">Unlock Your</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent inline-block animate-slide-in-right delay-200 animate-gradient-shift">
              Cosmic Destiny
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of astrology with AI-powered predictions, neural ensemble models, 
            and lightning-fast insights. Your personalized cosmic journey starts here.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in delay-300">
            <Link 
              href="/auth/register"
              className="relative w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center justify-center group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
            <Link 
              href="#features"
              className="w-full sm:w-auto px-10 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all group"
            >
              <span className="flex items-center">
                Explore Features
                <Sparkles className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </Link>
          </div>

          {/* Stats with animated counters */}
          <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-105 transition-all group">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                {counters.users > 0 ? `${(counters.users / 1000).toFixed(0)}K+` : '50K+'}
              </div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-105 transition-all group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                {counters.accuracy > 0 ? `${counters.accuracy}%` : '98%'}
              </div>
              <div className="text-sm text-gray-400">Max Accuracy</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-105 transition-all group">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                &lt;50ms
              </div>
              <div className="text-sm text-gray-400">Response Time</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-105 transition-all group">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                {counters.models > 0 ? counters.models : '5'}
              </div>
              <div className="text-sm text-gray-400">Neural Models</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
                Powered by Advanced AI
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Enterprise-grade features for your cosmic journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 duration-300 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: '100ms' }}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  🔥 Aggressive Mode
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  5-model neural ensemble with 85-98% accuracy. Lightning-fast predictions with sub-50ms cached responses and 15% accuracy boost.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 duration-300 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: '200ms' }}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Real-Time Insights
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Get instant predictions powered by parallel processing, GPU acceleration, and intelligent Redis caching for maximum speed.
              </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 duration-300 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: '300ms' }}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Multi-Language Support
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Available in English, मराठी (Marathi), and हिंदी (Hindi). Get personalized insights in your preferred language.
              </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 duration-300 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: '400ms' }}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Vedic & Western
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive birth chart analysis combining both Vedic (Jyotish) and Western astrology traditions with AI interpretation.
              </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 duration-300 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: '500ms' }}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/10 group-hover:to-rose-500/10 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Life Predictions
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Forecast major life events with transit analysis, dasha periods, and ML-powered probability calculations for career, relationships, and more.
              </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 duration-300 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: '600ms' }}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                AI Interpretations
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced LLM-powered insights combining RAG engine, multiple AI models, and astrological knowledge for deep understanding.
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border border-purple-500/30 rounded-3xl p-12 text-center backdrop-blur-sm relative overflow-hidden transition-all duration-700 ${ctaInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 animate-gradient-shift"></div>
            
            {/* Floating decoration elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white animate-fade-in">
                Ready to Discover Your Path?
              </h2>
              <p className="text-xl text-gray-300 mb-8 animate-fade-in delay-100">
                Join thousands of seekers using AI-powered astrology
              </p>
              <Link 
                href="/auth/register"
                className="relative inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all group overflow-hidden animate-fade-in delay-200"
              >
                <span className="relative z-10 flex items-center">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              <p className="text-sm text-gray-400 mt-6 animate-fade-in delay-300">
                ✨ No credit card required • 🔥 Aggressive Mode included • 🎯 85-98% accuracy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section - Tech Stack & Credits */}
      <section className="relative z-10 py-16 px-6 bg-gradient-to-b from-transparent to-purple-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-sm text-gray-400">Architected with</span>
            <span className="text-red-500">❤️</span>
            <span className="text-sm text-gray-400">by</span>
            <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
              Raghavendra Ramesh Deshpande
            </span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Solution Architect • Cloud & Infrastructure Expert
            </h3>
            <p className="text-sm text-gray-400">
              25+ Years Experience • Azure, VMware, PRINCE2 Certified
            </p>
          </div>
          
          <h4 className="text-xl font-semibold text-white mb-4">
            Powered by Enterprise Tech Stack
          </h4>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">☁️ Azure Cloud</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">⚛️ React 19</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">▲ Next.js 16</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">🐍 FastAPI</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">🤖 OpenAI GPT</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">🧠 Neural Ensemble</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">💻 VMware vSphere</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">🎨 Tailwind CSS</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">🐳 Docker</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">⚡ Redis Cache</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-gray-300">🔧 PowerShell</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Enterprise-grade AI platform combining 25+ years of solution architecture expertise with cutting-edge machine learning. 
            Specialized in scalability, security, and cost efficiency across Banking, Energy, and Telecom industries.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold text-white">AstroAI</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Enterprise AI platform for astrological insights.
              </p>
              <div className="flex flex-col space-y-2">
                <p className="text-xs text-gray-500">Architected by</p>
                <p className="text-sm font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
                  Raghavendra Ramesh Deshpande
                </p>
                <p className="text-xs text-gray-400">Solution Architect</p>
                <p className="text-xs text-gray-500">25+ Years IT Infrastructure</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">Azure</span>
                  <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">VMware</span>
                  <span className="text-[10px] px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded">PRINCE2</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                <p>© 2025 AstroAI. All rights reserved.</p>
                <p className="text-xs text-gray-500 mt-1">Version 5.0.0 🔥 Aggressive Mode Enabled</p>
                <p className="text-xs text-gray-500 mt-1">📧 deshpande.raghavendra@gmail.com • 📱 +91 9011256699</p>
              </div>
              <div className="text-sm text-gray-400 text-center md:text-right">
                <p className="text-xs text-gray-500">Architected & Developed by</p>
                <p className="text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text font-bold text-base mt-1">
                  Raghavendra Ramesh Deshpande
                </p>
                <p className="text-xs text-gray-500 mt-1">Solution Architect • 25+ Years Experience</p>
                <p className="text-xs text-gray-400 mt-1">Azure, VMware, PRINCE2 Certified • IT Infrastructure Expert</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
