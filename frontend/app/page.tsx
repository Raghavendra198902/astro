"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Stars, 
  TrendingUp, 
  Heart,
  Users,
  Calendar,
  Zap,
  Shield,
  ChevronRight,
  Check,
  ArrowRight,
  BookOpen,
  Compass
} from "lucide-react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                AstroAI
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition">Features</Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition">Testimonials</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="text-gray-300 hover:text-white transition font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-purple-300">AI-Powered Astrological Insights</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Unlock Your{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Cosmic Destiny
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Experience the future of astrology with AI-powered birth chart analysis, 
              personalized predictions, and real-time cosmic guidance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {[
                { label: "Active Users", value: "50K+", icon: Users },
                { label: "Charts Generated", value: "100K+", icon: Stars },
                { label: "Predictions Made", value: "500K+", icon: TrendingUp },
                { label: "Accuracy Rate", value: "98%", icon: Check }
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <stat.icon className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need for deep astrological insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Moon,
                title: "Birth Chart Analysis",
                description: "Generate detailed Vedic and Western birth charts with planetary positions, houses, and aspects.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Sparkles,
                title: "AI Interpretations",
                description: "Get personalized insights powered by advanced AI analyzing your unique astrological signature.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Heart,
                title: "Compatibility Matching",
                description: "Discover relationship compatibility through synastry analysis and composite charts.",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: Calendar,
                title: "Life Events Prediction",
                description: "Forecast major life events with transit analysis and dasha period calculations.",
                color: "from-orange-500 to-amber-500"
              },
              {
                icon: BookOpen,
                title: "Numerology Insights",
                description: "Unlock the power of numbers with comprehensive numerology analysis and life path guidance.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: Compass,
                title: "Daily Guidance",
                description: "Receive personalized daily horoscopes and panchang information for optimal timing.",
                color: "from-teal-500 to-emerald-500"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:scale-105"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Enter your birth details including date, time, and location for accurate calculations."
              },
              {
                step: "02",
                title: "Generate Charts",
                description: "Our AI analyzes your data and generates comprehensive birth charts and calculations."
              },
              {
                step: "03",
                title: "Get Insights",
                description: "Receive personalized interpretations, predictions, and guidance for your life journey."
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-7xl font-bold text-purple-500/20 mb-4">{step.step}</div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute top-12 -right-4 w-8 h-8 text-purple-500/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400">
              Flexible pricing for every journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Seeker",
                price: "Free",
                description: "Perfect for exploring astrology",
                features: [
                  "1 Birth Chart",
                  "Basic Interpretations",
                  "Daily Horoscope",
                  "Community Access"
                ],
                cta: "Get Started",
                highlighted: false
              },
              {
                name: "Mystic",
                price: "$19",
                period: "/month",
                description: "For serious astrology enthusiasts",
                features: [
                  "Unlimited Charts",
                  "AI Interpretations",
                  "Life Event Predictions",
                  "Compatibility Analysis",
                  "Priority Support",
                  "Premium Reports"
                ],
                cta: "Start Free Trial",
                highlighted: true
              },
              {
                name: "Oracle",
                price: "$49",
                period: "/month",
                description: "For professional astrologers",
                features: [
                  "Everything in Mystic",
                  "Consultation Booking",
                  "Client Management",
                  "White-label Reports",
                  "API Access",
                  "Dedicated Support"
                ],
                cta: "Contact Sales",
                highlighted: false
              }
            ].map((plan, i) => (
              <div 
                key={i}
                className={`relative p-8 rounded-2xl ${
                  plan.highlighted 
                    ? 'bg-gradient-to-b from-purple-600/20 to-pink-600/20 border-2 border-purple-500' 
                    : 'bg-white/5 backdrop-blur-sm border border-white/10'
                } hover:scale-105 transition-transform`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">
                    {plan.price}
                    {plan.period && <span className="text-lg text-gray-400">{plan.period}</span>}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/register"
                  className={`block w-full py-3 rounded-full font-semibold text-center transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of satisfied seekers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Entrepreneur",
                content: "The AI interpretations are incredibly accurate! This platform has helped me make better decisions in my business and personal life.",
                rating: 5
              },
              {
                name: "Michael Rodriguez",
                role: "Life Coach",
                content: "I use AstroAI with all my clients. The depth of analysis and ease of use makes it an invaluable tool for my practice.",
                rating: 5
              },
              {
                name: "Priya Patel",
                role: "Software Engineer",
                content: "As a skeptic, I was amazed by how detailed and insightful the birth chart analysis was. The predictions have been remarkably on point.",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Stars key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Discover Your Path?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of seekers on their journey to self-discovery
            </p>
            <Link 
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold">AstroAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered astrological insights for the modern seeker.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 AstroAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
