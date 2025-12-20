'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Book, MessageCircle, Mail, Phone, HelpCircle,
  ChevronDown, ChevronRight, ExternalLink, Video, FileText,
  Sparkles, Clock, Shield, CreditCard
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I generate my birth chart?',
      answer: 'Navigate to Dashboard > Charts > New Chart. Enter your birth date, time, and place. Our AI will generate a detailed Vedic or Western birth chart based on your preferences.'
    },
    {
      question: 'What is the difference between Vedic and Western astrology?',
      answer: 'Vedic astrology uses the sidereal zodiac and focuses on karma and spiritual growth. Western astrology uses the tropical zodiac and emphasizes psychological insights. You can choose your preferred system in Settings.'
    },
    {
      question: 'How accurate are the AI predictions?',
      answer: 'Our AI combines traditional astrological wisdom with machine learning trained on thousands of charts. While astrology is interpretive, our system provides personalized insights based on your unique birth data.'
    },
    {
      question: 'How do consultations work?',
      answer: 'Book a consultation through Dashboard > Consultations. Choose your astrologer, select a time slot, and receive a meeting link. Consultations include chart review and personalized guidance.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'We offer a 30-day money-back guarantee for Pro subscriptions. If you\'re not satisfied, contact support within 30 days of purchase for a full refund.'
    },
    {
      question: 'How are AI credits used?',
      answer: 'AI credits are consumed when generating predictions, detailed chart analyses, or using advanced features. Free users get 250 credits/month, Pro users get unlimited credits.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use industry-standard encryption and never share your personal or birth data. See our Privacy Policy for details on how we protect your information.'
    },
    {
      question: 'Can I change my birth details?',
      answer: 'Yes, go to Dashboard > Settings > Profile to update your birth information. This will affect future chart generations and predictions.'
    },
    {
      question: 'What languages are supported?',
      answer: 'Currently we support English, Hindi (हिंदी), and Marathi (मराठी). More languages will be added soon. Change language in Settings.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'Go to Dashboard > Settings > Billing and click "Cancel Subscription". Your Pro features will remain active until the end of your billing period.'
    }
  ];

  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of using AstroAI',
      icon: Book,
      href: '/docs/getting-started'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: Video,
      href: '/docs/videos'
    },
    {
      title: 'API Documentation',
      description: 'For developers integrating our API',
      icon: FileText,
      href: '/docs/api'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: MessageCircle,
      href: '/community'
    }
  ];

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'support@astroai.com',
      icon: Mail,
      action: 'mailto:support@astroai.com'
    },
    {
      title: 'Live Chat',
      description: 'Available 24/7',
      icon: MessageCircle,
      action: '#'
    },
    {
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      icon: Phone,
      action: 'tel:+15551234567'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                AstroAI
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Search our knowledge base or get in touch with support
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Link
                key={index}
                href={resource.href}
                className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
              >
                <Icon className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-400">{resource.description}</p>
              </Link>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-all"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Still need help?
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Our support team is here to assist you
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.action}
                  className="flex flex-col items-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-400 text-center">{method.description}</p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 mb-4">Looking for something else?</p>
          <div className="flex items-center justify-center space-x-6">
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/docs" className="text-purple-400 hover:text-purple-300 transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
