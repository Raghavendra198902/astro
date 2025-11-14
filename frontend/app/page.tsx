import Link from 'next/link';
import { Sparkles, Video, Brain, BarChart3, Users, Shield, Zap, ChevronRight, Star, TrendingUp, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header with Glass Effect */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">Astor AI</span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">Enterprise Astrology</span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-semibold transition-colors rounded-lg hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="group relative px-8 py-3 rounded-xl font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:scale-105 transition-transform"></div>
                <span className="relative flex items-center gap-2">
                  Get Started
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        {/* Hero with Premium Design */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-violet-50 border border-violet-200 rounded-full">
                <Zap className="w-4 h-4 text-violet-600" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-violet-900">Enterprise-Grade AI Astrology Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900">
                <span className="block">AI-Powered Astrology</span>
                <span className="block mt-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  for Modern Enterprises
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light">
                Transform your astrological journey with AI-powered insights, personalized natal charts, 
                and expert video consultations. Trusted by professionals worldwide.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/auth/register"
                  className="group relative px-10 py-4 rounded-xl font-semibold text-white overflow-hidden shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:scale-105 transition-transform"></div>
                  <span className="relative flex items-center justify-center gap-2 text-lg">
                    Start Free Trial
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/auth/login"
                  className="px-10 py-4 bg-white border-2 border-gray-300 text-gray-900 rounded-xl font-semibold text-lg hover:border-violet-600 hover:bg-gray-50 transition-all w-full sm:w-auto"
                >
                  Sign In
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 mt-12 border-t border-gray-200">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-xl mb-3">
                    <Users className="w-6 h-6 text-violet-600" strokeWidth={2} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-3">
                    <TrendingUp className="w-6 h-6 text-indigo-600" strokeWidth={2} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">Charts Generated</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-xl mb-3">
                    <Star className="w-6 h-6 text-violet-600" strokeWidth={2} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">Client Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Enterprise Features Built for Scale
              </h2>
              <p className="text-xl text-gray-600">
                Professional-grade tools designed for astrologers, enterprises, and seekers who demand excellence.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI Interpretations */}
              <div className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-violet-500 hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100 to-transparent rounded-bl-full opacity-50"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Brain className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Interpretations</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get personalized insights powered by advanced AI models trained on ancient wisdom and modern techniques.
                  </p>
                </div>
              </div>

              {/* Video Consultations */}
              <div className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-indigo-500 hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-full opacity-50"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Video className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Video Consultations</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Book live sessions with expert astrologers for deep, personalized guidance through secure video calls.
                  </p>
                </div>
              </div>

              {/* Advanced Charts */}
              <div className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-violet-500 hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100 to-transparent rounded-bl-full opacity-50"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <BarChart3 className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Comprehensive Charts</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Vedic & Western charts with Dashas, Yogas, transits, and compatibility analysis in stunning detail.
                  </p>
                </div>
              </div>

              {/* Compatibility Analysis */}
              <div className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-indigo-500 hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-full opacity-50"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Users className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Relationship Insights</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Advanced compatibility scoring using Kundali Milan and Western synastry techniques.
                  </p>
                </div>
              </div>

              {/* Enterprise Security */}
              <div className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-violet-500 hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100 to-transparent rounded-bl-full opacity-50"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Shield className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bank-grade encryption, JWT authentication, and SOC 2 compliance for your data protection.
                  </p>
                </div>
              </div>

              {/* Real-time Performance */}
              <div className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-indigo-500 hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-full opacity-50"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Zap className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Redis caching, async processing, and optimized algorithms for instant chart generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-violet-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
              <Award className="w-4 h-4 text-white" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-white">Trusted by 10,000+ Users Worldwide</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-violet-100 mb-10 max-w-2xl mx-auto">
              Join thousands of astrologers and seekers who have elevated their journey with Astor AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="px-10 py-4 bg-white text-violet-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all w-full sm:w-auto"
              >
                Start Free Trial
              </Link>
              <Link
                href="/auth/login"
                className="px-10 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all w-full sm:w-auto"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-white">Astor AI</span>
            </div>
            <p className="text-gray-400 text-center">
              Enterprise-grade astrology platform powered by AI and ancient wisdom.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Astor AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
