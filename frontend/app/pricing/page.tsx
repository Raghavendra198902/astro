'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, Sparkles, Star, Crown, Zap, Shield, Clock, Users, TrendingUp, Gift, HelpCircle } from 'lucide-react';

type BillingPeriod = 'monthly' | 'yearly';

interface PricingFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
}

const pricingFeatures: PricingFeature[] = [
  { name: 'Basic Birth Charts (Vedic & Western)', free: true, pro: true },
  { name: 'Daily Predictions', free: '5 per day', pro: 'Unlimited' },
  { name: 'Compatibility Analysis', free: '3 per month', pro: 'Unlimited' },
  { name: 'Chart Generation', free: '10 per month', pro: 'Unlimited' },
  { name: 'Numerology Reports', free: 'Basic', pro: 'Advanced' },
  { name: 'Palmistry Analysis', free: false, pro: true },
  { name: 'Face Reading', free: false, pro: true },
  { name: 'Detailed Dasha Analysis', free: false, pro: true },
  { name: 'Transit Predictions', free: 'Basic', pro: 'Detailed' },
  { name: 'Life Events Prediction', free: false, pro: true },
  { name: 'Panchang & Muhurat', free: 'Basic', pro: 'Advanced' },
  { name: 'AI-Powered Insights', free: 'Limited', pro: 'Full Access' },
  { name: 'Consultation Booking', free: 'With fees', pro: '10% discount' },
  { name: 'Priority Support', free: false, pro: true },
  { name: 'Export Reports (PDF)', free: false, pro: true },
  { name: 'Historical Data Access', free: '30 days', pro: 'Lifetime' },
  { name: 'Custom Remedies', free: false, pro: true },
  { name: 'Family Charts Management', free: '2 profiles', pro: 'Unlimited' },
  { name: 'Learning Resources', free: 'Free courses', pro: 'All courses' },
  { name: 'API Access', free: false, pro: 'Available' },
];

const faqs = [
  {
    question: 'Can I switch between monthly and yearly billing?',
    answer: 'Yes, you can upgrade to yearly billing at any time and receive a prorated credit. You can also switch from yearly to monthly at your next renewal date.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, and digital wallets including PayPal, Google Pay, and Apple Pay.'
  },
  {
    question: 'Is there a free trial for the Pro plan?',
    answer: 'Yes! All new users get a 7-day free trial of the Pro plan. No credit card required. You can cancel anytime during the trial period.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely. You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with the Pro plan, contact us within 30 days for a full refund.'
  },
  {
    question: 'Are there any discounts for students or educators?',
    answer: 'Yes! We offer a 20% discount for students and educators. Contact our support team with your valid educational ID to get your discount code.'
  },
  {
    question: 'What happens to my data if I downgrade to Free?',
    answer: 'Your data is never deleted. If you downgrade, you\'ll lose access to Pro features, but all your charts and reports remain saved. You can upgrade anytime to regain full access.'
  },
  {
    question: 'Do you offer enterprise or team plans?',
    answer: 'Yes! We offer custom enterprise plans for astrology businesses, consulting firms, and organizations. Contact sales@astroai.com for more information.'
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const monthlyPrice = 999;
  const yearlyPrice = 9990; // 833/month (16% savings)
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                AstroAI
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-purple-300 font-medium">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center space-x-2">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Yearly</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold">
                Save 16%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gray-500/20 rounded-xl">
                  <Star className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">Free</h3>
              </div>
              <p className="text-gray-400">Perfect for exploring astrology basics</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-bold text-white">₹0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Forever free, no credit card required</p>
            </div>

            <Link
              href="/auth/signup"
              className="w-full block text-center px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-semibold transition-all mb-8"
            >
              Get Started Free
            </Link>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-400 uppercase">What's included:</p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Basic birth charts (Vedic & Western)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">5 daily predictions per day</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">3 compatibility analyses per month</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">10 chart generations per month</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Basic numerology reports</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">2 family profile slots</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Access to free learning courses</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">30 days data history</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-2 border-purple-500/50 rounded-3xl p-8">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-white text-sm font-bold shadow-lg">
                ⭐ Most Popular
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Pro</h3>
              </div>
              <p className="text-gray-300">Unlock the full power of AI astrology</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-bold text-white">
                  ₹{billingPeriod === 'monthly' ? monthlyPrice : Math.round(yearlyPrice / 12)}
                </span>
                <span className="text-gray-400">/month</span>
              </div>
              {billingPeriod === 'yearly' && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-green-400">Billed ₹{yearlyPrice} yearly</p>
                  <p className="text-sm text-gray-400">Save ₹{yearlySavings} per year</p>
                </div>
              )}
              {billingPeriod === 'monthly' && (
                <p className="text-sm text-gray-400 mt-2">Billed monthly, cancel anytime</p>
              )}
            </div>

            <Link
              href={`/checkout?plan=pro&billing=${billingPeriod}`}
              className="w-full block text-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white rounded-xl font-semibold transition-all mb-8"
            >
              Start Free Trial
            </Link>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-purple-300 uppercase">Everything in Free, plus:</p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Unlimited predictions & charts</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Advanced palmistry & face reading</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Detailed Dasha & transit analysis</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Life events prediction with AI</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Advanced Panchang & Muhurat</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Full AI insights & recommendations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">10% discount on consultations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Priority customer support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Export reports as PDF</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Lifetime data access & history</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Custom remedies & solutions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Unlimited family profiles</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">Access to all premium courses</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">API access for developers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Detailed Feature Comparison
          </h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Free</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {pricingFeatures.map((feature, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-gray-300">{feature.name}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-400 text-sm">{feature.free}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-purple-300 text-sm font-medium">{feature.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">30-Day Guarantee</h4>
            <p className="text-gray-400 text-sm">Money back if not satisfied</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Users className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">50K+ Users</h4>
            <p className="text-gray-400 text-sm">Trusted by thousands</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">Cancel Anytime</h4>
            <p className="text-gray-400 text-sm">No long-term commitment</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <TrendingUp className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">4.8/5 Rating</h4>
            <p className="text-gray-400 text-sm">Highly rated by users</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-semibold flex items-center">
                    <HelpCircle className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                    {faq.question}
                  </span>
                  <span className={`text-purple-400 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 pt-2 text-gray-400 border-t border-white/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12 text-center">
          <Gift className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Your 7-Day Free Trial
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the full power of AstroAI Pro with no commitment. No credit card required.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/checkout?plan=pro&billing=monthly"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/help"
              className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-semibold transition-all text-lg"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
